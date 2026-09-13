import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Vacaciones } from 'src/app/Modelos/vacaciones';
import { LoginService } from 'src/app/services/login.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { UsersService } from 'src/app/services/users.service';


@Component({
  selector: 'app-vervacacion',
  templateUrl: './vervacacion.component.html',
  styleUrls: ['./vervacacion.component.css']
})
export class VervacacionComponent implements OnInit {

  vacacion: Vacaciones = {};
  id_vacaciones: number = 0;
  user: number = 0;

  estados = [{
    valor: 'pendiente',
    color: 'warning'
  },
  {
    valor: 'aprobada',
    color: 'success'
  },
  {
    valor: 'rechazada',
    color: 'danger'
  },
  {
    valor: 'eliminada',
    color: 'primary'
  }
  ];

  rechazar: number = 0;
  loading: boolean = false;
  banderaEliminar: boolean = false;

  constructor(
    public vacacionesService: VacacionesService,
    private activatedRoute: ActivatedRoute, public loginService: LoginService,
    private location: Location,
    private _snackBar: MatSnackBar,
    public usuariosService: UsersService
  ) { }

  ngOnInit(): void {
    this.id_vacaciones = this.activatedRoute.snapshot.params.id;
    this.user = this.activatedRoute.snapshot.params.user;
    this.getVacacionById(this.id_vacaciones);
  }

  eliminarVacaciones() {
    this.banderaEliminar = true;
  }

  eliminarV(motivo:any){
    //console.log(motivo.value);
    if(motivo.value == '' || motivo.value == undefined || motivo.value == null){
      alert('Debe ingresar un motivo.');
      return
    }
    var data = {
      id_vacaciones : this.id_vacaciones,
      motivo_eliminacion: motivo.value
    }

    if(confirm('Desea eliminar esta solicitud de vacaciones?')){
      this.vacacionesService.eliminarVacaciones(data).subscribe(
        res => {
          alert('Solicitud de vacaciones eliminada con exito.');
          this.getVacacionById(this.id_vacaciones);
        },
        err => {
          alert('Error al eliminar la solicitud de vacaciones')
        }
      )
    }

    
  }

  cancelarEliminar() {
    this.banderaEliminar = false;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  volver() {
    this.location.back();
  }

  aprobarVacaciones() {
    if (!confirm("¿Está seguro de aprobar estas vacaciones?")) {
      return;
    }

    var data = {
      id_vacaciones: this.vacacion.id_vacaciones,
      estado: 1,
      comentario: null
    }

    this.loading = true;

    this.vacacionesService.revisarVacaciones(data).subscribe(
      res => {
        this.getVacacionById(this.id_vacaciones);
        this.openSnackBar('Vacaciones aprobadas', 'cerrar');
      },
      err => alert(err.error.message)
    )

  }

  rechazarVacaciones(motivo: any) {
    if (!confirm("¿Está seguro de rechazar la licencia?")) {
      return;
    }

    if (motivo.value == "") {
      alert("Por favor, ingrese un motivo");
      return;
    }

    var data = {
      id_vacaciones: this.vacacion.id_vacaciones,
      estado: 2,
      comentario: motivo.value
    }

    this.loading = true;


    this.vacacionesService.revisarVacaciones(data).subscribe(
      res => {
        this.openSnackBar('Vacaciones rechazadas', 'cerrar');
        this.getVacacionById(this.id_vacaciones);
      },
      err => {
        console.error(err.error.message);
        this.loading = false;
      }

    )
  }

  btnRechazar() {
    this.rechazar = 1;
  }

  btnCancelarRechazar() {
    if (!confirm("¿Está seguro de cancelar la operacion?")) {
      return;
    }
    this.rechazar = 0;
  }

  getVacacionById(id: number) {
    this.vacacionesService.getVacacionesByIdVacaciones(id).subscribe(
      res => {
        this.vacacion = res[0];
        //console.log(this.vacacion)

        if (this.vacacion.estado != undefined) {
          this.vacacion.estado_string = this.estados[this.vacacion.estado].valor;
          this.vacacion.estado_color = this.estados[this.vacacion.estado].color;
        }

      },
      err => alert(err.error.message)
    )
  }

  esFechaMenorHoy(fecha: string | undefined): boolean {
    //console.log(fecha)
    if (fecha != undefined) {
      const fechaSeleccionada: Date = new Date(fecha);
      const fechaHoy: Date = new Date();
      //console.log('Fecha seleccionada: ',fechaSeleccionada);
      //console.log('Fecha hoy: ',fechaHoy)
      return fechaSeleccionada > fechaHoy;
    } else return false;

  }



}
