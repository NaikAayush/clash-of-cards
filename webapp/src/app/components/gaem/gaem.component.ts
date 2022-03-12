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

@Component({
  selector: 'app-gaem',
  templateUrl: './gaem.component.html',
  styleUrls: ['./gaem.component.css'],
})
export class GaemComponent implements OnInit {
  public deckCards: Card[];
  public fightingZones: Card[][] = [[], []];

  constructor(private service: GaemService) {
    this.deckCards = service.serveHand(4);
  }

  ngOnInit(): void {}

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

  hasEmptyFightingZones(): boolean {
    const numFightingZones = this.fightingZones.length;
    const filledFightingZones = this.numCardsInFightingZones();

    return numFightingZones !== filledFightingZones;
  }

  numCardsInFightingZones(): number {
    return this.fightingZones.filter((zone) => zone.length > 0).length;
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

    this.deckCards = this.deckCards.concat(
      this.service.serveHand(this.availableSpaceInDeck())
    );
  }

  cardDied(zoneIndex: number) {
    console.log(`Killing card with index ${zoneIndex}`);
    this.fightingZones[zoneIndex].shift();
  }
}
