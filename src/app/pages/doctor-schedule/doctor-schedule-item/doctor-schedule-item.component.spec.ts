import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorScheduleItemComponent } from './doctor-schedule-item.component';

describe('DoctorScheduleItemComponent', () => {
  let component: DoctorScheduleItemComponent;
  let fixture: ComponentFixture<DoctorScheduleItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorScheduleItemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorScheduleItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
