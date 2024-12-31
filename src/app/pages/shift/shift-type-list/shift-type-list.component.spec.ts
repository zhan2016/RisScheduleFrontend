import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShiftTypeListComponent } from './shift-type-list.component';

describe('ShiftTypeListComponent', () => {
  let component: ShiftTypeListComponent;
  let fixture: ComponentFixture<ShiftTypeListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ShiftTypeListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ShiftTypeListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
