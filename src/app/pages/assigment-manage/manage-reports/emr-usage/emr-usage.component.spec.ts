import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmrUsageComponent } from './emr-usage.component';

describe('EmrUsageComponent', () => {
  let component: EmrUsageComponent;
  let fixture: ComponentFixture<EmrUsageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmrUsageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EmrUsageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
