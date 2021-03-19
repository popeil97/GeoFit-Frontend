import { TestBed } from '@angular/core/testing';

import { SwagService } from './swag.service';

describe('SwagService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SwagService = TestBed.get(SwagService);
    expect(service).toBeTruthy();
  });
});
