import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevaOportunidadComponent } from './nueva-oportunidad.component';

describe('NuevaOportunidadComponent', () => {
  let component: NuevaOportunidadComponent;
  let fixture: ComponentFixture<NuevaOportunidadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NuevaOportunidadComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NuevaOportunidadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
