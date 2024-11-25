import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptionKeyFormComponent } from './encryption-key-form.component';

describe('EncryptionKeyFormComponent', () => {
  let component: EncryptionKeyFormComponent;
  let fixture: ComponentFixture<EncryptionKeyFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncryptionKeyFormComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncryptionKeyFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
