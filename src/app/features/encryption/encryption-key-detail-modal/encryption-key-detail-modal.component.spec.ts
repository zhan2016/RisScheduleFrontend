import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptionKeyDetailModalComponent } from './encryption-key-detail-modal.component';

describe('EncryptionKeyDetailModalComponent', () => {
  let component: EncryptionKeyDetailModalComponent;
  let fixture: ComponentFixture<EncryptionKeyDetailModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncryptionKeyDetailModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncryptionKeyDetailModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
