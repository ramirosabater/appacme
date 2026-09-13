import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Oportunidad } from 'src/app/Modelos/oportunidad';
import { LoginService } from 'src/app/services/login.service';
import { OportunidadesService } from 'src/app/services/oportunidades.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-detalle-oportunidad',
  templateUrl: './detalle-oportunidad.component.html',
  styleUrls: ['./detalle-oportunidad.component.css']
})
export class DetalleOportunidadComponent implements OnInit {

  id_empleo = 0;

  oportunidad: Oportunidad = {
    id_empleo: 0,
    fecha_creacion: '',
    fecha_publicacion: '',
    fecha_fin_publicacion: '',
    titulo: '',
    descripcion: '',
    id_carga_horaria: 0,
    id_modalidad: 0,
    id_ubicacion: 0,
    id_area: 0,
    estado: '',
    estado_color:'',
    carga_horaria: '',
    modalidad: '',
    ubicacion: '',
    area: '',
    requisitos: [],
    beneficios: []
  };

  requisito: string = '';
  beneficio: string = '';


  constructor(private oportunidadesService: OportunidadesService, public loginService: LoginService,
    private rutaActiva: ActivatedRoute, private location: Location
  ) { }

  ngOnInit(): void {
    this.id_empleo = this.rutaActiva.snapshot.params.id_empleo;
    // console.log('params:',this.id_empleo)
    this.getOportunidadById(this.id_empleo);
    //console.log('OportunidadById:', this.getOportunidadById(this.id_empleo));
  }

  getOportunidadById(id_empleo: any) {
    this.oportunidadesService.getOportunidadesById(id_empleo).subscribe(
      res => {
        this.oportunidad = res;
      },
      err => alert(err.error.message)
    );
  }

  addBeneficio() {
    var data = {
      id_empleo: this.id_empleo,
      beneficio: this.beneficio,
    }
    this.oportunidadesService.addBeneficio(data).subscribe(
      res => {
        alert('Beneficio agregado con éxito.');
        this.beneficio = '';
        this.getOportunidadById(data.id_empleo);
      },
      err => {
        alert('Error al agregar beneficio.');
      }
    );
  }

  eliminarBeneficio(id_beneficio: any) {
    this.oportunidadesService.eliminarBeneficio(id_beneficio).subscribe(
      res => {
        alert('Beneficio eliminado con éxito.');
        this.getOportunidadById(this.id_empleo);

      },
      err => {
        alert('Error al eliminar beneficio.');
      }
    );
  }

  addRequisito() {
    //if (this.nuevoRequisito == '') return;
    var data = {
      id_empleo: this.id_empleo,
      requisito: this.requisito,
    }
    this.oportunidadesService.addRequisito(data).subscribe(
      res => {
        alert('Requisito agregado con éxito.');
        this.requisito = '';
        this.getOportunidadById(data.id_empleo);
      },
      err => {
        alert('Error al agregar requisito');
      }
    );
  }

  eliminarRequisito(id_requisito: any) {
    this.oportunidadesService.eliminarRequisito(id_requisito).subscribe(
      res => {
        alert('Requisito eliminado con éxito.');
        this.getOportunidadById(this.id_empleo);

      },
      err => {
        alert('Error al eliminar requisito.');
      }
    );
  }

  guardarCambios(): void {
    const id = this.oportunidad.id_empleo;

    this.oportunidadesService.updateOportunidad(id, this.oportunidad).subscribe(
      () => {
        alert('Cambios guardados correctamente');
      },
      error => {
        console.error('Error al guardar los cambios', error);
        alert('Ocurrió un error al guardar los cambios');
      }
    );
  }

}
