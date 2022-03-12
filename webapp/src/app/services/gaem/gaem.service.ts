import { Injectable } from '@angular/core';
import { UrlHandlingStrategy } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class GaemService {
  private deckCards: string[];

  constructor() {
    // TODO: initialize this deck with real stuff and not scam strings
    this.deckCards = ["tako_1", "tako_2", "tako_3", "tako_4", "tako_5", "tako_6", "tako_7", "tako_8"];
  }

  serveHand(req: number) {
    let hand: string[] = Array();
    if (req > this.deckCards.length) {
      hand.push(...this.deckCards);
      this.deckCards = Array(); // empty the entire array
    } else {
      while (hand.length != req) {
        let card: string = this.deckCards[Math.floor(Math.random() * this.deckCards.length) | 0];
        if (!hand.includes(card)) {
          hand.push(card);
        }
      }
      this.deckCards = this.deckCards.filter(card => !hand.includes(card)); // remove the cards added to the deck
    }
    return hand;
  }
}
