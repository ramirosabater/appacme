import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';
import { OportunidadesService } from 'src/app/services/oportunidades.service';
import { ActivatedRoute } from '@angular/router';
import { Area, Carga_horaria, Modalidad, Ubicacion } from 'src/app/Modelos/oportunidad';
import { Estado } from 'src/app/Modelos/estado';

@Component({
  selector: 'app-nueva-oportunidad',
  templateUrl: './nueva-oportunidad.component.html',
  styleUrls: ['./nueva-oportunidad.component.css']
})
export class NuevaOportunidadComponent implements OnInit {

  oportunidad: any = {
    fecha_creacion: new Date().toISOString().split('T')[0],
    fecha_publicacion: '',
    fecha_fin_publicacion: '',
    titulo: '',
    descripcion: '',
    id_carga_horaria: null,
    id_modalidad: null,
    id_ubicacion: null,
    id_area: null,
    estado: '',
    requisitos: []
  };

  cargasHorarias :Carga_horaria[]=[];

  modalidades: Modalidad[] = [];

  ubicaciones: Ubicacion[] = [];

  areas: Area[] = [];

    estados = [
    { id: 1, estado: 'activo' },
    { id: 2, estado: 'borrador' },
    { id: 3, estado: 'finalizado' }
  ];

  esEdicion: boolean = false;

  constructor(private oportunidadesService: OportunidadesService, public loginService: LoginService,
    private location: Location, private activeRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    const id_empleo = this.activeRoute.snapshot.params.id_empleo;

    this.getUbicaciones();
    this.getAreas();
    this.getCargaHoraria();
    this.getModalidad();
    
    
    if (id_empleo) {
      this.esEdicion = true;

      this.oportunidadesService.getOportunidadesById(id_empleo).subscribe(
        res => {
          this.oportunidad = {
            ...res,
            fecha_creacion: this.formatearFecha(res.fecha_creacion),
            fecha_publicacion: this.formatearFecha(res.fecha_publicacion),
            fecha_fin_publicacion: this.formatearFecha(res.fecha_fin_publicacion),
          }

        },
        err => alert(err.error.message)
      );
    } else {
      this.oportunidad = {};
    }
  }


  guardarOportunidad(form: NgForm) {

    if (this.esEdicion) {
      const data = {
        id_empleo: this.oportunidad.id_empleo, // si lo necesitás
        fecha_creacion: form.value.fecha_creacion,
        fecha_publicacion: form.value.fecha_publicacion,
        fecha_fin_publicacion: form.value.fecha_fin_publicacion,
        titulo: form.value.titulo,
        descripcion: form.value.descripcion,
        id_carga_horaria: Number(form.value.id_carga_horaria),
        id_modalidad: Number(form.value.id_modalidad),
        id_ubicacion: Number(form.value.id_ubicacion),
        id_area: Number(form.value.id_area),
        estado: form.value.estado
      };
      this.oportunidadesService.updateOportunidad(this.oportunidad.id_empleo, data).subscribe(
        res => {
          alert('Oportunidad editada con éxito.');
          this.location.back();

        },
        err => {
          alert('Error al editar oportunidad');
        }
      );
    } else {
      console.log('Oportunidad a guardar:', form.value);
      var data = {
        fecha_creacion: form.value.fecha_creacion,
        fecha_publicacion: form.value.fecha_publicacion,
        fecha_fin_publicacion: form.value.fecha_fin_publicacion,
        titulo: form.value.titulo,
        descripcion: form.value.descripcion,
        id_carga_horaria: Number(form.value.id_carga_horaria),
        id_modalidad: Number(form.value.id_modalidad),
        id_ubicacion: Number(form.value.id_ubicacion),
        id_area: Number(form.value.id_area),
        estado: form.value.estado
      };

      this.oportunidadesService.nuevaOportunidad(data).subscribe(
        res => {
          alert('Oportunidad creada con éxito.');
          this.location.back();
        },
        err => {
          alert('Error al crear oportunidad');
        }
      );
    }
  }

  cancelar() {
    this.location.back();
  }

  formatearFecha(fecha: string): string {
    if (!fecha) return '';

    const date = new Date(fecha);
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}-${month}-${day}`;
  }

  getUbicaciones() {
    this.oportunidadesService.getUbicaciones().subscribe(
      res => {
        this.ubicaciones = res;
      },
      err => alert(err.error.message)
    );
  }

  getAreas() {
    this.oportunidadesService.getAreas().subscribe(
      res => {
        this.areas = res;
      },
      err => alert(err.error.message)
    );
  }

    getCargaHoraria() {
    this.oportunidadesService.getCargaHoraria().subscribe(
      res => {
        this.cargasHorarias = res;
      },
      err => alert(err.error.message)
    );
  }

    getModalidad() {
    this.oportunidadesService.getModalidades().subscribe(
      res => {
        this.modalidades = res;
      },
      err => alert(err.error.message)
    );
  }

  


}
