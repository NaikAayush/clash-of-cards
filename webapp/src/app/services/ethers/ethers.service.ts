import { Injectable } from '@angular/core';
import { BigNumber, ContractInterface, ethers, Signer, utils } from 'ethers';
import { Observable, of } from 'rxjs';

declare let window: any;

@Injectable({
  providedIn: 'root',
})
export class EthersService {
  provider: any;
  signer?: Signer;
  utils = utils;
  loggedIn = false;
  constructor() {
    // this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
  }

  authState() {
    return new Observable((observer) => {
      setInterval(() => {
        if (this.loggedIn) {
          observer.next(this.loggedIn);
          observer.complete();
        } else {
          observer.next(this.loggedIn);
        }
      }, 1000);
    });
  }

  async loginMetamask() {
    if (window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum, 'any');
      await this.provider.send('eth_requestAccounts', []);
      this.signer = this.provider.getSigner();
      this.loggedIn = true;
    } else {
      var ask = window.confirm(
        'Metamask is not detected, you can use sequence.\nDo you want to install Metamask?'
      );
      if (ask) {
        window.open('https://metamask.io');
      }
    }
  }

  async initEthers() {
    if (window.ethereum) {
      await this.provider.send('eth_requestAccounts', []);
      this.signer = this.provider.getSigner();
    }
  }

  async isLoggedIn() {
    const accounts = await this.provider.listAccounts();
    if (accounts.length > 0) {
      this.initEthers();
    }
    return accounts.length > 0;
  }

  async getAddress() {
    const accounts = await this.provider.listAccounts();
    if (accounts.length > 0) {
      this.initEthers();
      return accounts[0];
    }
  }

  async signMessage(message: string) {
    let messageHash = ethers.utils.solidityKeccak256(['string'], [message]);
    const signature = await this.signer?.signMessage(
      ethers.utils.arrayify(messageHash)
    );
    return signature;
  }

  async decodeData(typesArray: Array<string>, raw_log_data: string) {
    const abiCoder = new utils.AbiCoder();
    const decodedParameters = abiCoder.decode(typesArray, raw_log_data);
    return decodedParameters;
  }

  toWei(amount: string) {
    return this.utils.parseEther(amount).toString();
  }

  fromWei(amount: BigNumber) {
    return this.utils.formatEther(amount).toString();
  }

  async initSignerContract(contractAddress: string, abi: ContractInterface) {
    await this.initEthers();
    return new ethers.Contract(contractAddress, abi, this.signer);
  }
}
