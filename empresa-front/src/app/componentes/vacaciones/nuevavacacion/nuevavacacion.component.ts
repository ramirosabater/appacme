import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Empleado } from 'src/app/Modelos/empleado';
import { Vacaciones } from 'src/app/Modelos/vacaciones';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { LoginService } from 'src/app/services/login.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nuevavacacion',
  templateUrl: './nuevavacacion.component.html',
  styleUrls: ['./nuevavacacion.component.css']
})
export class NuevavacacionComponent implements OnInit {

  vacacion: Vacaciones = {};
  empleado: Empleado = {};
  dias_restantes = 0;
  loading = false;


  constructor(
    public loginService: LoginService,
    private location: Location,
    public vacacionesService: VacacionesService,
    public empleadosService: EmpleadosService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getEmpleadoById(this.loginService.data.user.id_usuario);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }


  guardarVacaciones(form: NgForm) {
    if (form.value.fecha_inicio == undefined || form.value.fecha_fin == undefined || form.value.fecha_reintegro == undefined) {
      alert('Por favor, complete todos los campos');
      return;
    }

    if (form.value.fecha_reintegro > form.value.fecha_fin && form.value.fecha_fin >= form.value.fecha_inicio) {


      var data = {
        id_empleado: this.loginService.data.user.id_usuario,
        fecha_inicio: form.value.fecha_inicio,
        fecha_fin: form.value.fecha_fin,
        fecha_reintegro: form.value.fecha_reintegro,
        estado: 0,
        update_at: new Date()
      }


      this.loading = true;

      this.vacacionesService.createVacaciones(data).subscribe(
        res => {
          this.openSnackBar('Vacaciones solicitadas con exito', 'cerrar');
          this.location.back();
        },
        err => {
          alert(err.error.message);
          this.loading = false;
        }
      )

    } else {
      alert('Por favor, ingrese fechas válidas');
    }

  }

  cancelar() {
    if (confirm('¿Está seguro de cancelar?')) {
      this.location.back();
    }
  }

  getEmpleadoById(id: number) {
    this.empleadosService.getEmpleadosById(id).subscribe(
      res => {
        this.empleado = res[0];
        if (this.empleado.dias_restantes != undefined) {
          this.dias_restantes = this.empleado.dias_restantes;
        }
      },
      err => alert(err.error.message)
    )
  }

}
