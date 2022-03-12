import { Component, OnInit } from '@angular/core';
import { GaemService } from 'src/app/services/gaem/gaem.service';

@Component({
  selector: 'app-gaem',
  templateUrl: './gaem.component.html',
  styleUrls: ['./gaem.component.css'],
})
export class GaemComponent implements OnInit {
  constructor(service: GaemService) {}

  ngOnInit(): void {}
}
