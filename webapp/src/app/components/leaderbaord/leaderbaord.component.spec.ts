import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaderbaordComponent } from './leaderbaord.component';

describe('LeaderbaordComponent', () => {
  let component: LeaderbaordComponent;
  let fixture: ComponentFixture<LeaderbaordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeaderbaordComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaderbaordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
