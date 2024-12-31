import { TestBed } from '@angular/core/testing';

import { ShiftReportGroupService } from './shift-report-group.service';

describe('ShiftReportGroupService', () => {
  let service: ShiftReportGroupService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftReportGroupService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
