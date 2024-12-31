import { TestBed } from '@angular/core/testing';

import { AssignmentStrategyService } from './assignment-strategy.service';

describe('AssignmentStrategyService', () => {
  let service: AssignmentStrategyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssignmentStrategyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
