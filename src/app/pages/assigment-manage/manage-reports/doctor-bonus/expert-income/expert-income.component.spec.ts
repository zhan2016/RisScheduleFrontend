import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpertIncomeComponent } from './expert-income.component';

describe('ExpertIncomeComponent', () => {
  let component: ExpertIncomeComponent;
  let fixture: ComponentFixture<ExpertIncomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExpertIncomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpertIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
