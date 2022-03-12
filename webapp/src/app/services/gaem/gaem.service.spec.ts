import { TestBed } from '@angular/core/testing';

import { GaemService } from './gaem.service';

describe('GaemService', () => {
  let service: GaemService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GaemService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
