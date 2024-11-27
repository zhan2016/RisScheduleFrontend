import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingCarComponent } from './loading-car.component';

describe('LoadingCarComponent', () => {
  let component: LoadingCarComponent;
  let fixture: ComponentFixture<LoadingCarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoadingCarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingCarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
