import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VistaconductorPage } from './vistaconductor.page';

describe('VistaconductorPage', () => {
  let component: VistaconductorPage;
  let fixture: ComponentFixture<VistaconductorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VistaconductorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
