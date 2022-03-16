import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ContractService } from 'src/app/services/contract.service';
import { environment } from 'src/environments/environment';
import CardData from '../../../assets/data.json';
@Component({
  selector: 'app-marketplace',
  templateUrl: './marketplace.component.html',
  styleUrls: ['./marketplace.component.css'],
})
export class MarketplaceComponent implements OnInit {
  dataRare: Array<string> = [];
  dataSuperRare: Array<string> = [];
  constructor(
    private contractService: ContractService,
    private http: HttpClient
  ) {}

  async ngOnInit() {
    const resRare: any = await this.getPinataRare();
    const resSuperRare: any = await this.getPinataSuperRare();

    resRare.rows.forEach((element: { ipfs_pin_hash: string }) => {
      this.dataRare.push(element.ipfs_pin_hash);
    });
    resSuperRare.rows.forEach((element: { ipfs_pin_hash: string }) => {
      this.dataSuperRare.push(element.ipfs_pin_hash);
    });
  }

  async buy() {
    await this.contractService.buyNFT('hp', '0.01');
  }

  async getPinataRare() {
    const url =
      'https://api.pinata.cloud/data/pinList?metadata[keyvalues][rarity]={"value":0.5,"op":"eq"}';

    return await this.http
      .get(url, {
        headers: {
          pinata_api_key: environment.pinata_api_key,
          pinata_secret_api_key: environment.pinata_secret_api_key,
        },
      })
      .toPromise();
  }
  async getPinataSuperRare() {
    const url =
      'https://api.pinata.cloud/data/pinList?metadata[keyvalues][rarity]={"value":1,"op":"eq"}';

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
