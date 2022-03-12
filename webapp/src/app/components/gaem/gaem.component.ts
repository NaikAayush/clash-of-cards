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

  constructor(service: GaemService) {
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
    return drop.data.length == 0;
  }
}
