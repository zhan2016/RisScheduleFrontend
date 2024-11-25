import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PatchLicenseListComponent } from './patch-license-list.component';

describe('PatchLicenseListComponent', () => {
  let component: PatchLicenseListComponent;
  let fixture: ComponentFixture<PatchLicenseListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PatchLicenseListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PatchLicenseListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
