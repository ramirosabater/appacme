import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Domicilio } from 'src/app/Modelos/domicilios';
import { DomiciliosService } from 'src/app/services/domicilios.service';
import { LoginService } from 'src/app/services/login.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-nuevo-domicilio',
  templateUrl: './nuevo-domicilio.component.html',
  styleUrls: ['./nuevo-domicilio.component.css']
})
export class NuevoDomicilioComponent implements OnInit {

  domicilio: Domicilio = {
    calle: '',
    numero: '',
    localidad: '',
    provincia: '',
    observaciones: '',
    tipo_direccion: 0,
  };

  file: any = null;

  id_empleado: number = 0;

  constructor(public loginService: LoginService, public domiciliosService: DomiciliosService, private location: Location,
    private _snackBar: MatSnackBar, private rutaActiva: ActivatedRoute,) { }

  ngOnInit(): void {
    this.id_empleado = this.rutaActiva.snapshot.params.id;
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  cancelar() {
    if (confirm('¿Desea cancelar?')) {
      this.location.back();
    }
  }

  guardarDomicilio(form: NgForm) {
    //console.log(form);
    if (form.value.calle == '' || form.value.numero == '' || form.value.localidad == '' || form.value.provincia == '' || form.value.tipo_direccion == 0 || form.value.observaciones == '') {
      alert('Complete todos los campos');
      return;
    }

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
    } else {
      alert('Debe adjuntar una foto del frente del domicilio');
      return
    }

    var data = {
      calle: form.value.calle,
      numero: form.value.numero,
      localidad: form.value.localidad,
      provincia: form.value.provincia,
      tipo_direccion: form.value.tipo_direccion,
      id_usuario: this.loginService.data.user.id_usuario,
      observaciones: form.value.observaciones
    }
    //console.log(data);
    this.domiciliosService.createDomicilio(form.value.calle, form.value.numero, form.value.localidad, form.value.provincia, form.value.tipo_direccion, form.value.observaciones, this.file, this.id_empleado).subscribe(
      res => {
        this.openSnackBar('Domicilio guardado con exito', 'cerrar');
        this.location.back();
      },
      err => {
        alert(err.error.message);
        //console.log(err);
      }
    )
  }

}
