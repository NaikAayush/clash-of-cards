import { Component, Input, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';

@Component({
  selector: 'app-card-item-market',
  templateUrl: './card-item-market.component.html',
  styleUrls: ['./card-item-market.component.css'],
})
export class CardItemMarketComponent implements OnInit {
  @Input() cid: string = '';
  url: string = '';
  constructor(private contractService: ContractService) {}

  ngOnInit() {
    this.url = 'https://mygateway.mypinata.cloud/ipfs/' + this.cid;
  }

  async buy() {
    await this.contractService.buyNFT(this.url, '10');
  }
}
