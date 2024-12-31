import { TestBed } from '@angular/core/testing';

import { ShiftReportGroupResolver } from './shift-report-group.resolver';

describe('ShiftReportGroupResolver', () => {
  let resolver: ShiftReportGroupResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ShiftReportGroupResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
