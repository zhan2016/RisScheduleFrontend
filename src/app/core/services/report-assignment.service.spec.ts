import { TestBed } from '@angular/core/testing';

import { ReportAssignmentService } from './report-assignment.service';

describe('ReportAssignmentService', () => {
  let service: ReportAssignmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportAssignmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
