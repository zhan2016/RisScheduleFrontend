import { TestBed } from '@angular/core/testing';

import { UserQuotaService } from './user-quota.service';

describe('UserQuotaService', () => {
  let service: UserQuotaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserQuotaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
