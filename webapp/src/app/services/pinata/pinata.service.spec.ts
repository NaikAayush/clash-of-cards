import { TestBed } from '@angular/core/testing';

import { PinataService } from './pinata.service';

describe('PinataService', () => {
  let service: PinataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PinataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
