import {
  Component,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { Card } from 'src/app/models/card';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-draggable-card',
  templateUrl: './draggable-card.component.html',
  styleUrls: ['./draggable-card.component.css'],
  animations: [
    trigger('addedRemoved', [
      state(
        'added',
        style({
          opacity: '100%',
          position: 'relative',
          top: '0rem',
        })
      ),
      state(
        'removed',
        style({ opacity: '0%', position: 'relative', top: '3rem' })
      ),
      // NOTE: do not change these without also changing the timeouts
      transition('added => removed', [animate('1s')]),
      transition('removed => added', [animate('0.5s')]),
    ]),
  ],
})
export class DraggableCardComponent implements OnInit {
  @Input() card?: Card;
  @Input() showHealth?: boolean;
  @Input() dragDisabled?: boolean;

  @ViewChild('template', { static: true }) template?: TemplateRef<any>;

  constructor() {}

  ngOnInit(): void {}
}
