import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { GaemService } from 'src/app/services/gaem/gaem.service';

@Component({
  selector: 'app-gaem',
  templateUrl: './gaem.component.html',
  styleUrls: ['./gaem.component.css'],
})
export class GaemComponent implements OnInit {
  public deckCards: string[] = ['one', 'two', 'three', 'four'];
  public fightingZones: string[][] = [[], []];

  constructor(service: GaemService) {}

  ngOnInit(): void {}

  dropCard(event: CdkDragDrop<string[]>, targetNumber: number = 0) {
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
      }
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }

  canBeDroppedToFight(drag: CdkDrag, drop: CdkDropList) {
    return drop.data.length == 0;
  }
}
