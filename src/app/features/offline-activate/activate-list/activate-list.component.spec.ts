import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateListComponent } from './activate-list.component';

describe('ActivateListComponent', () => {
  let component: ActivateListComponent;
  let fixture: ComponentFixture<ActivateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ActivateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
