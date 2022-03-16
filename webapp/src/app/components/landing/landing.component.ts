import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  scaleSetting = {
    scale: 1.1,
  };
  scaleLogoSetting = {
    scale: 1.1,
    max: 0,
  };
  constructor() {}

  ngOnInit(): void {}

  goToLink(url: string) {
    window.open(url, '_blank');
  }
}
