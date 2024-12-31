import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamKindListComponent } from './exam-kind-list.component';

describe('ExamKindListComponent', () => {
  let component: ExamKindListComponent;
  let fixture: ComponentFixture<ExamKindListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamKindListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamKindListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
