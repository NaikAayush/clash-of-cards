import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { GaemService } from 'src/app/services/gaem/gaem.service';
import { Card, CardMeta } from 'src/app/models/card';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Subscription, timer } from 'rxjs';
import { Router } from '@angular/router';
import { ScoreService } from 'src/app/services/score/score.service';
import { ContractService } from 'src/app/services/contract.service';
import { PinataService } from 'src/app/services/pinata.service';
import { environment } from 'src/environments/environment';

const IS_DEMO: boolean = true;

@Component({
  selector: 'app-gaem',
  templateUrl: './gaem.component.html',
  styleUrls: ['./gaem.component.css'],
  animations: [
    trigger('addedRemoved', [
      state(
        'added',
        style({
          opacity: '100%',
          position: 'relative',
          top: '0rem',
        })
      ),
      state(
        'removed',
        style({ opacity: '0%', position: 'relative', top: '3rem' })
      ),
      // NOTE: do not change these without also changing the timeouts
      transition('added => removed', [animate('1s')]),
      transition('removed => added', [animate('0.5s')]),
    ]),
  ],
})
export class GaemComponent implements OnInit {
  public deckCards: Card[] = [];
  public fightingZones: Card[][] = [[], []];
  public roundNum: number = 1;
  public secondsElapsed: number = 90;
  public roundTimes: number[] = [];
  public timer = timer(1000, 1000);
  public coinsEarned: number = 100;
  public waitingForResp = false;

  public enemyCards: Card[] = [];
  public enemyFightingZones: Card[][] = [[], []];

  private subscription?: Subscription;
  showWinModal = false;
  showLoseModal = false;

  constructor(
    private service: GaemService,
    private router: Router,
    private scorer: ScoreService,
    private contractService: ContractService,
    private pinata: PinataService
  ) {
    this.service.onReset(() => {
      this.reset();
    });

    if (IS_DEMO) {
      this.initEnemyCards();
    }
  }

  async initEnemyCards() {
    this.waitingForResp = true;
    const enemyCardIDs = [
      'QmdgWrQbFmM7NufQ8iha1MHnpxrpnKU9uJZfxaFEwNm4dv',
      'QmcS5haCaAFYSKuRKtwUuTr6QeHij7u5hphBhWBAmFj56b',
      'QmNM4yD8chQEizpZWvrgVE3yV1iBRqPaDp3FqYhKPURajg',
      'QmTLPmnSeKwgWFiKvDfuLXkBEuFFpaUYPLdLtighRhw8F2',

      'QmaP8Pyca9v2W4fggHAz6TUPkVCcFyuY8aG2hsjq5U8zk1',
      'QmVVve2Ze6UZZSKfgJZCo4DGR8oUTxiuAfvf28k1KeRupg',
      'Qmf1yWvchtMAQ8bBYhna5V4HBJxTTUAwQozz8HmaR978pq',
      'QmPZdjbkXyJF6kjj8B5ysFh7mJMjqGBV9AQCyQUUFyg3be',
    ];

    const enemyCardsMeta = await Promise.all(
      enemyCardIDs.map(async (id) => {
        const metadata = await this.pinata.getMetadeta(id);
        const someCardMeta: CardMeta = {
          imgUrl: environment.apiUrl + 'ipfs/' + id,
          damage: metadata.damage,
          maxHealth: metadata.health,
        };

        return someCardMeta;
      })
    );

    this.enemyCards = enemyCardsMeta.map((meta) => new Card(meta));

    console.log('Initialized enemy cards');

    // for (let i = 0; i < this.enemyCards.length; ++i) {
    //   this.enemyCards[i].takeDamage((i + 1) * 60);
    // }

    this.waitingForResp = false;
  }

  reset() {
    this.deckCards = [];
    this.addToDeck(this.service.serveHand(4));
    this.fightingZones = [[], []];
    this.roundNum = 1;

    this.resetTimer();

    this.roundTimes = [];

    this.showLoseModal = false;
    this.showWinModal = false;

    if (this.service.matchId === undefined) {
      console.error("Match ID wasn't set aaa");
    } else if (this.service.enemyAddress === undefined) {
      console.error("enemy address wasn't set aaa");
    } else {
      if (!IS_DEMO) {
        this.contractService.listenForEnemyCard(
          this.service.matchId,
          this.service.enemyAddress,
          (card1: Card, card2: Card) => {
            this.enemyFightingZones[0][0] = card1;
            this.enemyFightingZones[1][0] = card2;

            setTimeout(() => {
              this.enemyFightingZones[0][0].added = true;
              this.enemyFightingZones[1][0].added = true;
            }, 500);
          }
        );
      }
    }
  }

  stopTimer() {
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
  }

  resetTimer() {
    this.stopTimer();

    this.timer = timer(1000, 1000);
    const roundTimeLimit = 120;
    this.secondsElapsed = 120;
    this.subscription = this.timer.subscribe((val) => {
      this.secondsElapsed = 120 - (val + 1);

      if (this.secondsElapsed <= 0) {
        this.secondsElapsed = 0;

        this.showLoseModal = true;
      }
    });
  }

  addToDeck(newCards: Card[]) {
    this.deckCards = this.deckCards.concat(newCards);

    setTimeout(() => {
      this.deckCards.forEach((card) => {
        card.added = true;
      });
    }, 500);
  }

  ngOnInit(): void {
    this.reset();
  }

  dropCard(event: CdkDragDrop<Card[]>, targetNumber: number = 0) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else if (targetNumber > 0) {
      if (event.container.data.length == 0) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
        // event.container.element.nativeElement.classList.remove('h-48');
        // event.container.element.nativeElement.classList.remove('w-32');
      }
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
      // event.previousContainer.element.nativeElement.classList.add('h-48');
      // event.previousContainer.element.nativeElement.classList.add('w-32');
    }
  }

  canBeDroppedToFight(drag: CdkDrag, drop: CdkDropList) {
    return drop.data.length === 0;
  }

  canBeDroppedToDeck(drag: CdkDrag, drop: CdkDropList) {
    return true;
  }

  hasEmptyFightingZones(): boolean {
    const numFightingZones = this.fightingZones.length;
    const filledFightingZones = this.numCardsInFightingZones();

    return numFightingZones !== filledFightingZones;
  }

  numCardsInFightingZones(): number {
    return this.fightingZones
      .filter((zone) => zone.length > 0)
      .filter((zone) => zone[0].isAlive() && zone[0].added).length;
  }

  availableSpaceInDeck(): number {
    return 4 - this.deckCards.length;
  }

  addEnemyCards() {
    for (let fightingZone of this.enemyFightingZones) {
      if (fightingZone.length == 0) {
        const newCard = this.enemyCards.shift();
        if (newCard !== undefined) {
          fightingZone.push(newCard);

          console.log('Added enemy card', newCard);

          setTimeout(() => {
            newCard.added = true;
          }, 500);
        }
      }
    }
  }

  checkPlayerWin() {
    if (IS_DEMO) {
      if (
        this.enemyCards.length == 0 &&
        this.enemyFightingZones.filter((zone) => zone.length > 0).length == 0
      ) {
        console.log('Win!');
        this.showWinModal = true;

        this.waitingForResp = true;
        this.contractService.gibMoni(this.coinsEarned.toString()).then(() => {
          this.waitingForResp = false;
        });
      }
    } else {
      // TODO: implement this
      return;
    }
  }

  async continue() {
    if (this.waitingForResp) {
      return;
    }

    let message = 'Next round started';
    let toContinue = true;

    if (this.hasEmptyFightingZones() && this.deckCards.length > 0) {
      message =
        'There are empty fighting zones and you have cards left on your deck!';
      toContinue = false;
    }

    if (this.numCardsInFightingZones() === 0) {
      message = 'No cards in fighting zone!';
      toContinue = false;
    }

    console.log(this.fightingZones);
    console.log(toContinue, message);

    if (toContinue) {
      this.waitingForResp = true;
      this.stopTimer();
      this.roundTimes.push(this.secondsElapsed);

      if (!IS_DEMO) {
        if (this.service.matchId !== undefined) {
          const cardSubmitProm = this.contractService.submitCards(
            this.service.matchId,
            this.fightingZones[0][0],
            this.fightingZones[1][0]
          );

          const roundEndProm = this.contractService.listenForRoundEnd(
            this.service.matchId
          );

          const data = await Promise.all([cardSubmitProm, roundEndProm]);
          const round = data[1];
          console.log('Round ended!', round);

          if (this.service.isPlayer1) {
            const myDamages = [
              this.fightingZones[0][0].health - round.p1_card1.hp.toNumber(),
              this.fightingZones[1][0].health - round.p1_card2.hp.toNumber(),
            ];

            const enemyDamages = [
              this.enemyFightingZones[0][0].health -
                round.p2_card1.hp.toNumber(),
              this.enemyFightingZones[1][0].health -
                round.p2_card2.hp.toNumber(),
            ];

            this.takeDamages(this.fightingZones, myDamages);
            this.takeDamages(this.enemyFightingZones, enemyDamages);
          } else {
            const myDamages = [
              this.fightingZones[0][0].health - round.p2_card1.hp.toNumber(),
              this.fightingZones[1][0].health - round.p2_card2.hp.toNumber(),
            ];

            const enemyDamages = [
              this.enemyFightingZones[0][0].health -
                round.p1_card1.hp.toNumber(),
              this.enemyFightingZones[1][0].health -
                round.p1_card2.hp.toNumber(),
            ];

            this.takeDamages(this.fightingZones, myDamages);
            this.takeDamages(this.enemyFightingZones, enemyDamages);
          }

          this.roundCompleted();
          this.resetTimer();
          this.roundNum += 1;

          if (this.noCardsLeft()) {
            this.stopTimer();
            this.showLoseModal = true;
          }
        } else {
          console.error("Match ID wasn't set aaa");
        }
      } else {
        setTimeout(() => {
          // TODO: remove this sim
          this.addEnemyCards();

          setTimeout(() => {
            this.waitingForResp = false;

            const enemyDamages = this.enemyFightingZones.map(
              (zone) => zone[0]?.meta.damage
            );
            this.takeDamages(this.fightingZones, enemyDamages);
            const playerDamages = this.fightingZones.map(
              (zone) => zone[0]?.meta.damage
            );
            this.takeDamages(this.enemyFightingZones, playerDamages);
            this.roundCompleted();

            this.resetTimer();
            this.roundNum += 1;

            if (this.noCardsLeft()) {
              this.showLoseModal = true;
            }
          }, 1000);
        }, 2000);
      }
    }
  }

  takeDamages(zones: Card[][], damages: number[]) {
    zones.forEach((cards, index) => {
      if (cards.length > 0) {
        const damage = damages.shift();
        if (damage !== undefined) {
          const alive = cards[0].takeDamage(damage);
          if (!alive) {
            this.cardDied(zones, index);
          }
        }
      }
    });
  }

  updateScore() {
    this.coinsEarned = this.scorer.getScore(
      this.deckCards.concat(
        this.fightingZones
          .filter((zone) => zone.length > 0)
          .map((zone) => zone[0]),
        this.service.deckCards
      ),
      this.roundTimes
    );
  }

  roundCompleted() {
    this.updateScore();
    this.checkPlayerWin();

    this.addToDeck(
      this.service.serveHand(
        this.availableSpaceInDeck() - this.numCardsInFightingZones()
      )
    );
  }

  noCardsLeft(): boolean {
    return (
      this.availableSpaceInDeck() == 4 && this.numCardsInFightingZones() == 0
    );
  }

  cardDied(zones: Card[][], zoneIndex: number) {
    const removedCard = zones[zoneIndex][0];
    if (removedCard !== undefined) {
      removedCard.added = false;
    }

    setTimeout(() => {
      zones[zoneIndex].shift();

      this.updateScore();
    }, 1000);
  }

  playAgain() {
    this.router.navigateByUrl('/dashboard');
  }
}
