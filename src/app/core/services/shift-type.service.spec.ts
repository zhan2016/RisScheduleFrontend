import { TestBed } from '@angular/core/testing';

import { ShiftTypeService } from './shift-type.service';

describe('ShiftTypeService', () => {
  let service: ShiftTypeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShiftTypeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
