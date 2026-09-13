import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListaPostulantesGeneralesComponent } from './lista-postulantes-generales.component';

describe('ListaPostulantesGeneralesComponent', () => {
  let component: ListaPostulantesGeneralesComponent;
  let fixture: ComponentFixture<ListaPostulantesGeneralesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListaPostulantesGeneralesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListaPostulantesGeneralesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
