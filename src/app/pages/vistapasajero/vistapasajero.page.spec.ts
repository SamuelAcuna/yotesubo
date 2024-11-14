import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistapasajeroPage } from './vistapasajero.page';

describe('VistapasajeroPage', () => {
  let component: VistapasajeroPage;
  let fixture: ComponentFixture<VistapasajeroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistapasajeroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
