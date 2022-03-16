import {
  CdkDrag,
  CdkDragDrop,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { HttpClient } from '@angular/common/http';
import {
  Component,
  DoCheck,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Router } from '@angular/router';
import { Card, CardMeta } from 'src/app/models/card';
import { ContractService } from 'src/app/services/contract/contract.service';
import { EthersService } from 'src/app/services/ethers/ethers.service';
import { GaemService } from 'src/app/services/gaem/gaem.service';
import { PinataService } from 'src/app/services/pinata.service';
import { ServerService } from 'src/app/services/server.service';
import { environment } from 'src/environments/environment';
import { BigNumber, ContractInterface, ethers, Signer, utils } from 'ethers';

declare global {
  interface Window {
    ethereum: any;
  }
}

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  loading = false;
  collection: Card[] = [];
  collectionDropList: Card[][] = [];
  selectedCardList: Card[][] = [];
  selectedZoneIds = Array.from(Array(10).keys()).map(
    (i) => `selected-zone-${i}`
  );
  collectionZoneIds: string[] = [];
  balance: string = '0';
  data: Array<string> = [];
  dataCommon: Array<string> = [];
  status = false;

  constructor(
    private gaemService: GaemService,
    private router: Router,
    private contractService: ContractService,
    private http: HttpClient,
    private pinata: PinataService,
    private ethersService: EthersService,
    private serverService: ServerService
  ) {
    const observer = {
      next: function (value: any) {
        console.log(value);
      },
      error: function (value: any) {
        console.log(value);
      },
      complete: function () {
        console.log('complete');
      },
    };
    let status: boolean;
    this.ethersService.authState().subscribe((data: any) => {
      this.status = data;
      console.log(this.status);
      if (this.status == true) {
        this.setupDashboard();
      }
    });
  }

  async ngOnInit() {}

  async setupDashboard() {
    this.loading = true;
    const nftBalance = await this.contractService.getNFTBalance();
    if (nftBalance == 0) {
      this.loading = true;
      const account = await this.ethersService.provider.send(
        'eth_requestAccounts',
        []
      );
      await this.serverService.mintInitNFT(account[0]);
      await this.serverService.mintInitToken(account[0]);
      this.loading = false;
      window.location.reload();
    }
    this.data = await this.contractService.getNFTs();
    this.balance = (await this.contractService.getBalance()).split('.')[0];
    await this.newUser();
    console.log(this.data);
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i].length == 46) {
        const metadata = await this.pinata.getMetadeta(this.data[i]);
        console.log(metadata);
        const someCardMeta: CardMeta = {
          imgUrl: environment.apiUrl + 'ipfs/' + this.data[i],
          damage: metadata.damage,
          maxHealth: metadata.health,
        };
        this.collection?.push(new Card(someCardMeta));
      }
    }
    this.collection.forEach((card) => {
      card.added = true;
    });

    this.collectionDropList = this.collection.map((card) => [card]);
    this.collectionZoneIds = Array.from(
      Array(this.collectionDropList.length).keys()
    ).map((i) => `collection-zone-${i}`);
    this.selectedCardList = Array.from({ length: 8 }, () => []);
    console.log(this.collection);
    this.loading = false;

    // for (let i = 1; i < this.dataCommon.length; i++) {
    //   const metadata = await this.pinata.getMetadeta(this.dataCommon[i]);
    //   const someCardMeta: CardMeta = {
    //     imgUrl: environment.apiUrl + 'ipfs/' + this.dataCommon[i],
    //     damage: metadata.damage,
    //     maxHealth: metadata.health,
    //   };
    //   this.collection?.push(new Card(someCardMeta));
    // }
  }

  async newUser() {
    const resCommon: any = await this.getPinataCommon();
    resCommon.rows.forEach((element: { ipfs_pin_hash: string }) => {
      this.dataCommon.push(element.ipfs_pin_hash);
    });
  }

  async getPinataCommon() {
    const url =
      'https://api.pinata.cloud/data/pinList?metadata[keyvalues][rarity]={"value":"0","op":"eq"}';

    return await this.http
      .get(url, {
        headers: {
          pinata_api_key: environment.pinata_api_key,
          pinata_secret_api_key: environment.pinata_secret_api_key,
        },
      })
      .toPromise();
  }

  dropCard(event: CdkDragDrop<Card[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      if (event.container.data.length == 0) {
        transferArrayItem(
          event.previousContainer.data,
          event.container.data,
          event.previousIndex,
          event.currentIndex
        );
      }
    }

    console.log(event.previousContainer.data, event.container.data);
  }

  canBeDropped(drag: CdkDrag, drop: CdkDropList) {
    return drop.data.length === 0;
  }

  async goToBattle() {
    const allSelectedFilled =
      this.selectedCardList?.filter((arr) => arr.length > 0).length == 8;

    let message = "Let's go to battle!";
    let toContinue = true;

    if (!allSelectedFilled) {
      message = 'You have empty slots in your deck!';
      toContinue = false;
      console.log(toContinue, message);
    }

    if (toContinue) {
      this.loading = true;
      console.log(message);
      const selectedCards = this.selectedCardList?.map((arr) => arr[0]);
      this.gaemService.setDeckCards(selectedCards);
      await this.contractService.joinQueue(
        (matchId: BigNumber, enemyAddress: string) => {
          console.log('Starting match with ID', matchId);

          this.gaemService.matchId = matchId;
          this.gaemService.enemyAddress = enemyAddress;

          this.router.navigateByUrl('/gaem');
        }
      );
    }
  }
}
