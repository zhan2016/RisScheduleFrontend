import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftReportGroupListComponent } from './shift-report-group-list.component';

describe('ShiftReportGroupListComponent', () => {
  let component: ShiftReportGroupListComponent;
  let fixture: ComponentFixture<ShiftReportGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftReportGroupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftReportGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
