import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrationIncomeComponent } from './registration-income.component';

describe('RegistrationIncomeComponent', () => {
  let component: RegistrationIncomeComponent;
  let fixture: ComponentFixture<RegistrationIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrationIncomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrationIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
