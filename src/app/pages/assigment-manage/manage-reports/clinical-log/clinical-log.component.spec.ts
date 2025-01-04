import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClinicalLogComponent } from './clinical-log.component';

describe('ClinicalLogComponent', () => {
  let component: ClinicalLogComponent;
  let fixture: ComponentFixture<ClinicalLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClinicalLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ClinicalLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
