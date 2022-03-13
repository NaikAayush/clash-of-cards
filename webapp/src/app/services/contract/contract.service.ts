import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { EthersService } from '../ethers/ethers.service';
import ClashToken from '../../../assets/abis/ClashToken.json';
import ClashNFT from '../../../assets/abis/ClashOfCards.json';
import { ContractInterface } from 'ethers';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  clashTokenContract: any;
  clashNFTContract: any;
  account: any;

  constructor(private ethersService: EthersService) {}

  async initContracts() {
    this.clashTokenContract = await this.ethersService.initSignerContract(
      environment.clashTokenAddress,
      ClashToken.abi as ContractInterface
    );
    this.clashNFTContract = await this.ethersService.initSignerContract(
      environment.clashNFTAddress,
      ClashNFT.abi as ContractInterface
    );
  }

  async buyNFT(url: string, amount: string) {
    await this.initContracts();
    this.account = await this.ethersService.provider.send(
      'eth_requestAccounts',
      []
    );
    console.log(this.account[0]);
    console.log(this.ethersService.utils.parseEther(amount).toString());
    const tx = await this.clashTokenContract.approve(
      environment.clashNFTAddress,
      this.ethersService.utils.parseEther(amount).toString()
    );
    await tx.wait();
    await this.clashNFTContract.payToMint(
      this.account[0],
      url,
      this.ethersService.utils.parseEther(amount).toString()
    );
    await tx.wait();
  }
}
