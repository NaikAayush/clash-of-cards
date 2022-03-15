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
  constructor() {}

  ngOnInit(): void {}
}
