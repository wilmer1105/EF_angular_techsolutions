import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpleadoDashboardComponent } from './empleado-dashboard';

describe('EmpleadoDashboard', () => {
  let component: EmpleadoDashboardComponent;
  let fixture: ComponentFixture<EmpleadoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmpleadoDashboardComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(EmpleadoDashboardComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
