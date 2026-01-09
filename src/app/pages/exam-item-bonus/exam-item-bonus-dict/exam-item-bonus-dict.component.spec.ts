import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamItemBonusDictComponent } from './exam-item-bonus-dict.component';

describe('ExamItemBonusDictComponent', () => {
  let component: ExamItemBonusDictComponent;
  let fixture: ComponentFixture<ExamItemBonusDictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExamItemBonusDictComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExamItemBonusDictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
