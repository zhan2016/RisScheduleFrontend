import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EncryptionKeyListComponent } from './encryption-key-list.component';

describe('EncryptionKeyListComponent', () => {
  let component: EncryptionKeyListComponent;
  let fixture: ComponentFixture<EncryptionKeyListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EncryptionKeyListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EncryptionKeyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
