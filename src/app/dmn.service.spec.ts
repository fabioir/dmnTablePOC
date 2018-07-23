import { TestBed, inject } from '@angular/core/testing';

import { DmnService } from './dmn.service';

describe('DmnService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [DmnService]
    });
  });

  it('should be created', inject([DmnService], (service: DmnService) => {
    expect(service).toBeTruthy();
  }));
});
