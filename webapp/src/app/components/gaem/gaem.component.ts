import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { GaemService } from 'src/app/services/gaem/gaem.service';
import { Card } from 'src/app/models/card';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { timer } from 'rxjs';

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
  public coinsEarned: number = 100;

  constructor(private service: GaemService) {
    this.service.onReset(() => {
      this.reset();
    });
  }

  reset() {
    this.deckCards = [];
    this.addToDeck(this.service.serveHand(4));
    this.fightingZones = [[], []];
    this.roundNum = 1;
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

  continue() {
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
      // TODO: remove this sim
      this.roundCompleted([100, 100]);
    }
  }

  roundCompleted(damages: number[]) {
    this.fightingZones.forEach((cards, index) => {
      if (cards.length > 0) {
        const damage = damages.shift();
        if (damage !== undefined) {
          const alive = cards[0].takeDamage(damage);
          if (!alive) {
            this.cardDied(index);
          }
        }
      }
    });

    this.addToDeck(
      this.service.serveHand(
        this.availableSpaceInDeck() - this.numCardsInFightingZones()
      )
    );
  }

  cardDied(zoneIndex: number) {
    console.log(`Killing card with index ${zoneIndex}`);
    const removedCard = this.fightingZones[zoneIndex][0];
    if (removedCard !== undefined) {
      removedCard.added = false;
    }

    setTimeout(() => {
      this.fightingZones[zoneIndex].shift();
    }, 1000);
  }
}
