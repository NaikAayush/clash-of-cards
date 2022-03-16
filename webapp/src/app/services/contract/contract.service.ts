import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EthersService } from '../ethers/ethers.service';
import ClashToken from '../../../assets/abis/ClashToken.json';
import ClashNFT from '../../../assets/abis/ClashOfCards.json';
import ClashMatchMaking from '../../../assets/abis/ClashMatchMaking.json';
import { BigNumber, ContractInterface } from 'ethers';
import { Card } from 'src/app/models/card';

interface ContractCard {
  hp: BigNumber;
  maxHp: BigNumber;
  atk: BigNumber;
  url: string;
}

function toActualCard(contractCard: ContractCard): Card {
  const newCard = new Card({
    imgUrl: contractCard.url,
    maxHealth: contractCard.maxHp.toNumber(),
    damage: contractCard.atk.toNumber(),
  });

  newCard.health = contractCard.hp.toNumber();

  return newCard;
}

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  clashTokenContract: any;
  clashNFTContract: any;
  clashMatchMakingContract: any;
  account: any;

  currentMatchId?: BigNumber;
  otherPlayerAddr?: string;

  constructor(private ethersService: EthersService) {}

  async initContracts() {
    if (
      this.clashTokenContract === null ||
      this.clashTokenContract === undefined
    ) {
      console.log('Initializing clash token contract.');
      this.clashTokenContract = await this.ethersService.initSignerContract(
        environment.clashTokenAddress,
        ClashToken.abi as ContractInterface
      );
    }

    if (this.clashNFTContract === null || this.clashNFTContract === undefined) {
      console.log('Initializing clash NFT contract.');
      this.clashNFTContract = await this.ethersService.initSignerContract(
        environment.clashNFTAddress,
        ClashNFT.abi as ContractInterface
      );
    }

    if (
      this.clashMatchMakingContract === null ||
      this.clashMatchMakingContract === undefined
    ) {
      console.log('Initializing clash match making contract.');
      this.clashMatchMakingContract =
        await this.ethersService.initSignerContract(
          environment.clashMatchAddress,
          ClashMatchMaking.abi as ContractInterface
        );
    }
  }

  async buyNFT(url: string, amount: string) {
    await this.initContracts();
    this.account = await this.ethersService.provider.send(
      'eth_requestAccounts',
      []
    );
    console.log(this.account[0]);
    console.log(this.ethersService.utils.parseEther(amount).toString());
    let tx = await this.clashTokenContract.approve(
      environment.clashNFTAddress,
      this.ethersService.utils.parseEther(amount).toString()
    );
    await tx.wait();
    tx = await this.clashNFTContract.payToMint(
      this.account[0],
      url,
      this.ethersService.utils.parseEther(amount).toString()
    );
    await tx.wait();
    console.log(tx);
  }

  async getNFTs() {
    await this.initContracts();
    this.account = await this.ethersService.provider.send(
      'eth_requestAccounts',
      []
    );
    return await this.clashNFTContract.getAllNFTs(this.account[0]);
  }

  async getBalance() {
    await this.initContracts();
    this.account = await this.ethersService.provider.send(
      'eth_requestAccounts',
      []
    );
    return this.ethersService.fromWei(
      await this.clashTokenContract.balanceOf(this.account[0])
    );
  }

  async joinQueue(matchStartedCb: (_: BigNumber, __: string) => void) {
    await this.initContracts();
    this.account = await this.ethersService.provider.send(
      'eth_requestAccounts',
      []
    );
    console.log('Address', this.account[0]);

    const amount = 50;

    const approveTx = await this.clashTokenContract.approve(
      environment.clashMatchAddress,
      this.ethersService.utils.parseEther(amount.toString()).toString()
    );
    await approveTx.wait();
    console.log('Approved stake', approveTx);

    const tx = await this.clashMatchMakingContract.joinQueue(
      this.account[0],
      this.ethersService.utils.parseEther(amount.toString()).toString()
    );
    await tx.wait();
    console.log('Joined queue', tx);

    this.listenForMatchId(matchStartedCb);
  }

  async listenForMatchId(matchStartedCb: (_: BigNumber, __: string) => void) {
    await this.initContracts();
    this.account = await this.ethersService.provider.send(
      'eth_requestAccounts',
      []
    );

    console.log('Listening for match IDs');

    const event = this.clashMatchMakingContract.filters.PublishMatchId();

    const eventCb = (player1: string, player2: string, matchId: BigNumber) => {
      console.log('Got a match ID', player1, player2, matchId);
      player1 = player1.toLowerCase();
      player2 = player2.toLowerCase();
      const myAddress = this.account[0].toLowerCase();

      if (player1 === myAddress) {
        console.log("Got match for me. I'm player 1.");
        this.currentMatchId = matchId;
        this.otherPlayerAddr = player2;

        matchStartedCb(matchId, this.otherPlayerAddr);
        this.clashMatchMakingContract.off(event, eventCb);
      } else if (player2 === myAddress) {
        console.log("Got match for me. I'm player 2.");
        this.currentMatchId = matchId;
        this.otherPlayerAddr = player1;

        matchStartedCb(matchId, this.otherPlayerAddr);
        this.clashMatchMakingContract.off(event, eventCb);
      } else {
        console.log('Not my match.');
      }
    };

    this.clashMatchMakingContract.on(event, eventCb);
  }

  async submitCards(matchId: BigNumber, card1: Card, card2: Card) {
    await this.initContracts();
    this.account = await this.ethersService.provider.send(
      'eth_requestAccounts',
      []
    );
    const myAddress = this.account[0];
    console.log('Address', myAddress);

    const tx = await this.clashMatchMakingContract.submitCard(
      matchId,
      this.account[0],
      card1.health,
      card1.meta.maxHealth,
      card1.meta.damage,
      card1.meta.imgUrl,
      card2.health,
      card2.meta.maxHealth,
      card2.meta.damage,
      card2.meta.imgUrl
    );
    await tx.wait();
    console.log('Joined queue', tx);
  }

  async getNFTBalance() {
    await this.initContracts();
    this.account = await this.ethersService.provider.send(
      'eth_requestAccounts',
      []
    );
    return await this.clashNFTContract.balanceOf(this.account[0]);
  }

  async listenForEnemyCard(matchId: BigNumber, enemyAddress: string) {
    const event = this.clashMatchMakingContract.filters.OpponentCardSubmit(
      enemyAddress,
      matchId
    );

    this.clashMatchMakingContract.on(
      event,
      (enemyAddress: string, matchId: BigNumber, card1: any, card2: any) => {
        console.log('Got enemy cards', enemyAddress, matchId, card1, card2);
      }
    );
  }

  listenForRoundEnd(matchId: BigNumber) {
    const event = this.clashMatchMakingContract.filters.EndOfRound(matchId);

    const prom = new Promise((resolve, reject) => {
      this.clashMatchMakingContract.once(
        event,
        (matchId: BigNumber, player1: string, player2: string, round: any) => {
          console.log('round was over', matchId, player1, player2, round);
          resolve(round);
        }
      );
    });

    return prom;
  }
}
