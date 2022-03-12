import { Injectable } from '@angular/core';
import { Card, CardMeta } from 'src/app/models/card';

@Injectable({
  providedIn: 'root',
})
export class GaemService {
  private deckCards: Card[];

  constructor() {
    // TODO: initialize this deck with real stuff and not scam strings
    const someCardMeta: CardMeta = {
      imgUrl: '/assets/images/card-example.svg',
      damage: 100,
      maxHealth: 500,
    };
    this.deckCards = [
      new Card(someCardMeta),
      new Card(someCardMeta),
      new Card(someCardMeta),
      new Card(someCardMeta),
      new Card(someCardMeta),
      new Card(someCardMeta),
      new Card(someCardMeta),
      new Card(someCardMeta),
    ];
  }

  serveHand(req: number): Card[] {
    let hand: Card[] = Array();
    if (req > this.deckCards.length) {
      hand.push(...this.deckCards);
      this.deckCards = Array(); // empty the entire array
    } else {
      while (hand.length != req) {
        let card: Card =
          this.deckCards[Math.floor(Math.random() * this.deckCards.length) | 0];
        if (!hand.includes(card)) {
          hand.push(card);
        }
      }
      this.deckCards = this.deckCards.filter((card) => !hand.includes(card)); // remove the cards added to the deck
    }
    return hand;
  }
}
