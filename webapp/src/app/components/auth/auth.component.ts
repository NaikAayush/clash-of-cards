import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { openCloseAnimation } from '../../services/animation/animation.service';
import { EthersService } from 'src/app/services/ethers/ethers.service';
import { SequenceService } from 'src/app/services/sequence/sequence.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
  animations: [openCloseAnimation],
})
export class AuthComponent implements OnInit {
  modalShow: boolean = false;
  constructor(
    private ethersService: EthersService,
    private router: Router,
    private sequence: SequenceService
  ) {}

  async ngOnInit() {
    this.modalShow = true;
    // if (await this.ethersService.isLoggedIn()) {
    //   this.modalShow = false;
    // } else {
    //   setTimeout(() => {
    //     this.modalShow = true;
    //   }, 1000);
    // }
  }

  async login() {
    await this.ethersService.loginMetamask();
    this.modalShow = false;
  }
  async loginSequence() {
    await this.sequence.login();
  }
}
