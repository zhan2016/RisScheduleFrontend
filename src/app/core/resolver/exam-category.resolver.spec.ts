import { TestBed } from '@angular/core/testing';

import { ExamCategoryResolver } from './exam-category.resolver';

describe('ExamCategoryResolver', () => {
  let resolver: ExamCategoryResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(ExamCategoryResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
