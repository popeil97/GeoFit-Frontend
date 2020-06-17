import { TestBed } from '@angular/core/testing';

import { CoordinatesService } from './coordinates.service';

describe('CoordinatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoordinatesService = TestBed.get(CoordinatesService);
    expect(service).toBeTruthy();
  });
});
