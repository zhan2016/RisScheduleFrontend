import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLeaveRequestComponent } from './user-leave-request.component';

describe('UserLeaveRequestComponent', () => {
  let component: UserLeaveRequestComponent;
  let fixture: ComponentFixture<UserLeaveRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserLeaveRequestComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLeaveRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
