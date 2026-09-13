import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Licencia } from 'src/app/Modelos/licencia';
import { TipoLicencia } from 'src/app/Modelos/tipo_licencia';
import { LicenciasService } from 'src/app/services/licencias.service';
import { Location } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { Empleado } from 'src/app/Modelos/empleado';

@Component({
  selector: 'app-nuevalicencia',
  templateUrl: './nuevalicencia.component.html',
  styleUrls: ['./nuevalicencia.component.css']
})
export class NuevalicenciaComponent implements OnInit {

  licencia: Licencia = {
    id_licencia: 0,
    id_empleado: 0,
    tipo_licencia: 0,
    fecha_inicio: '',
    fecha_fin: '',
    fecha_reintegro: '',
    descripcion: '',
    adjunto: '',
    revision_jefe: 0,
    revision_recursos: 0,
    estado: 0
  }

  empleado: Empleado = {};

  tiposLicencia: TipoLicencia[] = [];

  file: any = null;

  loading = false;

  constructor(
    public licenciasService: LicenciasService,
    public empleadosService: EmpleadosService,
    public location: Location,
    public loginService: LoginService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getTipoLicencias();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
    }
  }

  getTipoLicencias() {

    this.empleadosService.getEmpleadosById(this.loginService.data.user.id_usuario).subscribe(
      res => {
        this.empleado = res[0];
        if (this.empleado.id_empresa != undefined) {
          this.licenciasService.getTiposLicenciaByEmpresa(this.empleado.id_empresa).subscribe(
            res => {
              this.tiposLicencia = res;
              //console.log(res)
              //console.log(this.loginService.data.user)
            },
            err => {
              alert('Error al obtener tipos de licencias')
            }
          )
        }
      },
      err => {
        alert('Error al obtener empleado')
      }
    )
  }



  guardarLicencia(form: NgForm) {
    form.value.id_empleado = 0;
    form.value.revision_jefe = 0;
    form.value.revision_recursos = 0;
    form.value.estado = 0;
    //validar que el formulario sea valido
    if (form.valid) {

      if (form.value.fecha_inicio > form.value.fecha_fin || form.value.fecha_inicio > form.value.fecha_reintegro || form.value.fecha_fin > form.value.fecha_reintegro || form.value.fecha_inicio == form.value.fecha_reintegro || form.value.fecha_fin == form.value.fecha_reintegro || form.value.fecha_inicio == '' || form.value.fecha_fin == '' || form.value.fecha_reintegro == '') {
        alert('Las fechas no son válidas');
        return
      }

      if (form.value.tipo_licencia == 0) {
        alert('Debe seleccionar un tipo de licencia');
        return
      }

      var tieneAdjunto = false;

      if (this.file) {
        //validaciones del archivo
        if (this.file.size > 30000000) {
          alert('El archivo no puede ser mayor a 30 MB');
          return
        }

        if (this.file.type != "image/jpeg" && this.file.type != "image/png" && this.file.type != "image/gif" && this.file.type != "application/pdf") {
          alert('Solo se aceptan archivos con formato de imagen: p.ej. jpg, png, gif y pdf.');
          return
        }

        tieneAdjunto = true;
      }


      // const { id_empleado, tipo_licencia, fecha_inicio, fecha_fin, fecha_reintegro, descripcion, revision_jefe, revision_recursos, estado } = req.body;
      var data = {
        id_empleado: this.loginService.data.user.id_usuario,
        tipo_licencia: form.value.tipo_licencia,
        fecha_inicio: form.value.fecha_inicio,
        fecha_fin: form.value.fecha_fin,
        fecha_reintegro: form.value.fecha_reintegro,
        descripcion: form.value.descripcion,
        revision_jefe: 0,
        revision_recursos: 0,
        estado: 0
      };

      
      this.loading = true;
      this.licenciasService.createLicencia(data)
        .subscribe(
          res => {
            //console.log(res);
            if (tieneAdjunto) {
              var lic: Licencia = res[0];
              this.licenciasService.adjuntarArchivoLicencia(lic.id_licencia, this.file)
                .subscribe(
                  res => {
                    this.loading = false;
                  },
                  err => alert('Error al adjuntar el archivo')
                );
            }
            this.openSnackBar('Licencia creada con exito', 'cerrar');
            this.location.back();
          },
          err => alert(err)
        );

    }
    else {
      alert("Todos los campos son obligatorios");
    }
  }

  cancelar() {
    if (confirm("¿Seguro que desea cancelar?")) {
      this.location.back();
    }
  }

}
