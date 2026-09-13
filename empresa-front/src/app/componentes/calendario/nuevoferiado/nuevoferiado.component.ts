import { Component, OnInit } from '@angular/core';
import { Feriado } from 'src/app/Modelos/feriado';
import { FeriadosService } from 'src/app/services/feriados.service'
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { LoginService } from 'src/app/services/login.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nuevoferiado',
  templateUrl: './nuevoferiado.component.html',
  styleUrls: ['./nuevoferiado.component.css']
})
export class NuevoferiadoComponent implements OnInit {

  feriado: Feriado = {
    fecha_feriado: '',
    descripcion: ''
  }

  constructor(public feriadoService: FeriadosService, private location: Location, public loginService: LoginService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  guardarNoticia() {

    if (this.feriado.fecha_feriado == '' || this.feriado.descripcion == '') {
      alert('Debe completar todos los campos');
      return;
    }
    this.feriadoService.createFeriado(this.feriado).subscribe(
      res => {
        this.openSnackBar('El feriado se creo correctamente', 'cerrar');
        this.location.back();
      },
      err => {
        alert('Error ' + err.error.message);
      }
    );
  }

  cancelar() {
    if (confirm("¿Está seguro de cancelar?")) {
      this.location.back();
    }
  }

}
