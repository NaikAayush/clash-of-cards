import { Injectable } from '@angular/core';
import { BigNumber } from 'ethers';
import { Card, CardMeta } from 'src/app/models/card';

@Injectable({
  providedIn: 'root',
})
export class GaemService {
  public deckCards: Card[];
  private onResetCb?: () => void;
  public matchId?: BigNumber;

  constructor() {
    // TODO: initialize this deck with real stuff and not scam strings
    const someCardMeta: CardMeta = {
      imgUrl: '/assets/images/card-example.svg',
      damage: 200,
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
    for (let i = 0; i < this.deckCards.length; ++i) {
      this.deckCards[i].takeDamage((i + 1) * 50);
    }
  }

  public onReset(fn: () => void) {
    this.onResetCb = fn;
  }

  public setDeckCards(newCards: Card[]) {
    this.deckCards = newCards;

    if (this.onResetCb !== undefined) {
      this.onResetCb();
    }
  }

  hasCardsLeft(): boolean {
    return this.deckCards.length > 0;
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
