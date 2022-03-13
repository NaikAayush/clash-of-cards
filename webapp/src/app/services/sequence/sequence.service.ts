import { Injectable } from '@angular/core';
import { sequence } from '0xsequence';

@Injectable({
  providedIn: 'root',
})
export class SequenceService {
  constructor() {}

  async login() {
    const wallet = new sequence.Wallet('mainnet');
    const connectDetails = await wallet.connect();

    console.log('=> connected?', connectDetails.connected);
  }
}
