import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { Card, CardMeta } from 'src/app/models/card';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  collection: Card[];
  collectionDropList: Card[][];
  selectedCardList: Card[][];
  selectedZoneIds = Array.from(Array(10).keys()).map(
    (i) => `selected-zone-${i}`
  );
  collectionZoneIds: string[];

  constructor() {
    // TODO: remove dis
    const someCardMeta: CardMeta = {
      imgUrl: '/assets/images/card-example.svg',
      damage: 100,
      maxHealth: 500,
    };
    this.collection = [
      new Card(someCardMeta),
      new Card(someCardMeta),
      new Card(someCardMeta),
      new Card(someCardMeta),
      new Card(someCardMeta),
      new Card(someCardMeta),
      new Card(someCardMeta),
      new Card(someCardMeta),
    ];
    this.collection.forEach((card) => {
      card.added = true;
    });

    this.collectionDropList = this.collection.map((card) => [card]);
    this.collectionZoneIds = Array.from(
      Array(this.collectionDropList.length).keys()
    ).map((i) => `collection-zone-${i}`);
    this.selectedCardList = Array.from({ length: 8 }, () => []);
  }

  ngOnInit(): void {}

  dropCard(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (event.container.data.length == 0) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }

    console.log(event.previousContainer.data, event.container.data);
  }

  canBeDropped(drag: CdkDrag, drop: CdkDropList) {
    return drop.data.length === 0;
  }

  goToBattle() {
    const allSelectedFilled =
      this.selectedCardList.filter((arr) => arr.length > 0).length == 8;

    let message = "Let's go to battle!";
    let toContinue = true;

    if (!allSelectedFilled) {
      message = 'You have empty slots in your deck!';
      toContinue = false;
      console.log(toContinue, message);
    }

    if (toContinue) {
      console.log(message);
    }
  }
}
