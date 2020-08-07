import { TestBed } from '@angular/core/testing';

import { ImageService } from './image.service';

describe('NotificationsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ImageService = TestBed.get(ImageService);
    expect(service).toBeTruthy();
  });
});