import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DoctorSelectComponent } from './doctor-select.component';

describe('DoctorSelectComponent', () => {
  let component: DoctorSelectComponent;
  let fixture: ComponentFixture<DoctorSelectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DoctorSelectComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DoctorSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
