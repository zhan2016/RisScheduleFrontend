import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportAssignmentComponent } from './report-assignment.component';

describe('ReportAssignmentComponent', () => {
  let component: ReportAssignmentComponent;
  let fixture: ComponentFixture<ReportAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportAssignmentComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
