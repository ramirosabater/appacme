import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Licencia } from 'src/app/Modelos/licencia';
import { LicenciasService } from 'src/app/services/licencias.service';
import { LoginService } from 'src/app/services/login.service';
import { environment } from 'src/environments/environment';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-ver-licencia',
  templateUrl: './ver-licencia.component.html',
  styleUrls: ['./ver-licencia.component.css']
})
export class VerLicenciaComponent implements OnInit {

  licencia: Licencia = {};
  estados = [{
    valor: 'Pendiente',
    color: 'warning'
  },
  {
    valor: 'Aprobado',
    color: 'success'
  },
  {
    valor: 'Rechazado',
    color: 'danger'
  }
  ];

  loading: boolean = false;

  rechazar: number = 0;

  estado: string = '';

  dias: number = 0;
  user: number = 0;
  url: string = environment.ruta_api;

  constructor(
    public licenciasService: LicenciasService,
    private location: Location,
    private rutaActiva: ActivatedRoute,
    public loginService: LoginService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    const id_licencia = this.rutaActiva.snapshot.params.id;
    this.user = this.rutaActiva.snapshot.params.user;
    this.getLicencia(id_licencia);

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  aprobarJefe() {
    if (!confirm("¿Está seguro de aprobar la licencia?")) {
      return;
    }

    var data = {
      id_licencia: this.licencia.id_licencia,
      revision_jefe: 1
    }

    this.loading = true;

    this.licenciasService.revisarLicenciaJefe(data).subscribe(
      res => {
        this.openSnackBar('Licencia aprobada', 'cerrar');
        this.getLicencia(this.licencia.id_licencia);
      },
      err => alert(err.error.message)
    );
  }

  rechazarJefe(motivoJefe: any) {
    if (motivoJefe.value == "") {
      alert("Debe ingresar un motivo");
      return;
    }
    if (!confirm("¿Está seguro de rechazar la licencia?")) {
      return;
    }

    var data = {
      id_licencia: this.licencia.id_licencia,
      revision_jefe: 2,
      motivo_jefe: motivoJefe.value
    }

    this.loading = true;

    this.licenciasService.rechazarLicenciaJefe(data).subscribe(
      res => {
        this.openSnackBar('Licencia rechazada', 'cerrar');
        this.getLicencia(this.licencia.id_licencia);
      },
      err => alert(err.error.message)
    );

  }

  aprobarRecursos() {
    if (!confirm("¿Está seguro de aprobar la licencia?")) {
      return;
    }

    var data = {
      id_licencia: this.licencia.id_licencia,
      revision_recursos: 1
    }

    this.loading = true;

    this.licenciasService.revisarLicenciaRecursos(data).subscribe(
      res => {
        this.openSnackBar('Licencia aprobada', 'cerrar');
        this.getLicencia(this.licencia.id_licencia);
      },
      err => alert(err.error.message)
    );
  }

  rechazarRecursos(motivoRecursos: any) {
    if (motivoRecursos.value == "") {
      alert("Debe ingresar un motivo");
      return;
    }
    if (!confirm("¿Está seguro de rechazar la licencia?")) {
      return;
    }

    var data = {
      id_licencia: this.licencia.id_licencia,
      revision_recursos: 2,
      motivo_recursos: motivoRecursos.value
    }

    this.loading = true;

    this.licenciasService.rechazarLicenciaRecursos(data).subscribe(
      res => {
        this.openSnackBar('Licencia rechazada', 'cerrar');
        this.getLicencia(this.licencia.id_licencia);
      },
      err => alert(err.error.message)
    );
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

  getLicencia(id_licencia: any) {
    this.licenciasService.getLicenciaById(id_licencia).subscribe(
      res => {
        this.licencia = res[0];
        //console.log(this.licencia);
        if (this.licencia.estado != undefined && this.licencia.revision_jefe != undefined && this.licencia.revision_recursos != undefined) {
          this.licencia.estado_string = this.estados[this.licencia.estado].valor;
          this.estado = this.estados[this.licencia.estado].color
          this.licencia.revision_jefe_string = this.estados[this.licencia.revision_jefe].valor;
          this.licencia.revision_recursos_string = this.estados[this.licencia.revision_recursos].valor;
          this.licencia.revision_jefe_color = this.estados[this.licencia.revision_jefe].color;
          this.licencia.revision_recursos_color = this.estados[this.licencia.revision_recursos].color;
        }
        if (this.licencia.age?.days != undefined)
          this.dias = this.licencia.age?.days;

        //console.log(this.licencia);
      },
      err => alert(err.error.message)
    );
  }

}
