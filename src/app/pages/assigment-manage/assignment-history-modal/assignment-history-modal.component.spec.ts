import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignmentHistoryModalComponent } from './assignment-history-modal.component';

describe('AssignmentHistoryModalComponent', () => {
  let component: AssignmentHistoryModalComponent;
  let fixture: ComponentFixture<AssignmentHistoryModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignmentHistoryModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignmentHistoryModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
