import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract/contract.service';
import { environment } from 'src/environments/environment';
import CardData from '../../../assets/data.json';
@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css'],
})
export class MarketplaceComponent implements OnInit {
  data: Array<string>;
  constructor(
    private contractService: ContractService,
    private http: HttpClient
  ) {
    this.data = CardData.data;
  }

  async ngOnInit() {
    const res = await this.getPinata();

    console.log(res);
  }

  async buy() {
    await this.contractService.buyNFT('0.01');
  }

  async getPinata() {
    const url =
      'hhttps://api.pinata.cloud/data/pinList?metadata[keyvalues]%3D{"rarity":1}';

    return await this.http
      .get(url, {
        headers: {
          pinata_api_key: environment.pinata_api_key,
          pinata_secret_api_key: environment.pinata_secret_api_key,
        },
      })
      .toPromise();
  }
}
