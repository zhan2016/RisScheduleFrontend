import { TestBed } from '@angular/core/testing';

import { ReportGroupService } from './report-group.service';

describe('ReportGroupService', () => {
  let service: ReportGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
