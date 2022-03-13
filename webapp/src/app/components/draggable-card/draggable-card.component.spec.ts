import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DraggableCardComponent } from './draggable-card.component';

describe('DraggableCardComponent', () => {
  let component: DraggableCardComponent;
  let fixture: ComponentFixture<DraggableCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DraggableCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DraggableCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
