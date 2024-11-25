import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserQuotaComponent } from './user-quota.component';

describe('UserQuotaComponent', () => {
  let component: UserQuotaComponent;
  let fixture: ComponentFixture<UserQuotaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserQuotaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserQuotaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
