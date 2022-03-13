import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardItemMarketComponent } from './card-item-market.component';

describe('CardItemMarketComponent', () => {
  let component: CardItemMarketComponent;
  let fixture: ComponentFixture<CardItemMarketComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardItemMarketComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardItemMarketComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
