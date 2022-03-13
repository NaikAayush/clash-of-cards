import { Injectable } from '@angular/core';
import { Card } from 'src/app/models/card';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  constructor() {}

  getScore(cards: Card[], roundTimes: number[]) {
    const cardsLost = 8 - cards.length;
    const baseScore = 100;

    let score = baseScore;

    score -= 10 * cardsLost;
    const timeMultiplier = 0.2;
    const maxRounds = 6;
    for (
      let roundId = 0;
      roundId < roundTimes.length && roundId < maxRounds;
      roundId++
    ) {
      score -= timeMultiplier * (30 - roundTimes[roundId]);
    }

    return score;
  }
}
