import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EllipsisCellComponent } from './ellipsis-cell.component';

describe('EllipsisCellComponent', () => {
  let component: EllipsisCellComponent;
  let fixture: ComponentFixture<EllipsisCellComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EllipsisCellComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EllipsisCellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
