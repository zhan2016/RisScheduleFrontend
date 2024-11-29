import { TestBed } from '@angular/core/testing';

import { OfflineActivateService } from './offline-activate.service';

describe('OfflineActivateService', () => {
  let service: OfflineActivateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfflineActivateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
