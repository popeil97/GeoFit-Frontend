import { TestBed } from '@angular/core/testing';

import { CheckpointService } from './checkpoint.service';

describe('CheckpointService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckpointService = TestBed.get(CheckpointService);
    expect(service).toBeTruthy();
  });
});
