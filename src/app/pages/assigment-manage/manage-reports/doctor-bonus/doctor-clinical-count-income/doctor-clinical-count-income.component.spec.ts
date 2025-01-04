import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorClinicalCountIncomeComponent } from './doctor-clinical-count-income.component';

describe('DoctorClinicalCountIncomeComponent', () => {
  let component: DoctorClinicalCountIncomeComponent;
  let fixture: ComponentFixture<DoctorClinicalCountIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorClinicalCountIncomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorClinicalCountIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
