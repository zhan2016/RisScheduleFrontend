import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportGroupListComponent } from './report-group-list.component';

describe('ReportGroupListComponent', () => {
  let component: ReportGroupListComponent;
  let fixture: ComponentFixture<ReportGroupListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReportGroupListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportGroupListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
