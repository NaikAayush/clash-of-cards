import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-item-market',
  templateUrl: './card-item-market.component.html',
  styleUrls: ['./card-item-market.component.css'],
})
export class CardItemMarketComponent implements OnInit {
  @Input() cid: string = '';
  url: string = '';
  constructor() {}

  ngOnInit() {
    this.url = 'https://mygateway.mypinata.cloud/ipfs/' + this.cid;
  }
}
