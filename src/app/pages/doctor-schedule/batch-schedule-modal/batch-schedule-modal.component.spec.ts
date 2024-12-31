import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BatchScheduleModalComponent } from './batch-schedule-modal.component';

describe('BatchScheduleModalComponent', () => {
  let component: BatchScheduleModalComponent;
  let fixture: ComponentFixture<BatchScheduleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BatchScheduleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BatchScheduleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
