import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract/contract.service';

@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css'],
})
export class MarketplaceComponent implements OnInit {
  constructor(private contractService: ContractService) {}

  ngOnInit(): void {}

  async buy() {
    await this.contractService.buyNFT('0.01');
  }
}
