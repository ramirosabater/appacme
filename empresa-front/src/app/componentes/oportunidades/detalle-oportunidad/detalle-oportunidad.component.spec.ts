import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleOportunidadComponent } from './detalle-oportunidad.component';

describe('DetalleOportunidadComponent', () => {
  let component: DetalleOportunidadComponent;
  let fixture: ComponentFixture<DetalleOportunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetalleOportunidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetalleOportunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
