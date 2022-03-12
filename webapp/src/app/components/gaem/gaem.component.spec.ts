import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GaemComponent } from './gaem.component';

describe('GaemComponent', () => {
  let component: GaemComponent;
  let fixture: ComponentFixture<GaemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GaemComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GaemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
