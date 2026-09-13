import { Component, OnInit } from '@angular/core';
import { Licencia } from 'src/app/Modelos/licencia';
import { LicenciasService } from 'src/app/services/licencias.service';
import { LoginService } from 'src/app/services/login.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-admlicencias',
  templateUrl: './admlicencias.component.html',
  styleUrls: ['./admlicencias.component.css']
})
export class AdmlicenciasComponent implements OnInit {

  licencias: Licencia[] = [];

  estados = [{
    valor: 'pendiente',
    color: 'warning'
  },
  {
    valor: 'aprobado',
    color: 'success'
  },
  {
    valor: 'rechazado',
    color: 'danger'
  }
  ];

  constructor(public licenciasService: LicenciasService, public loginService: LoginService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.getLicenciasByJefe(this.loginService.data.user.id_usuario);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getLicenciasByJefe(id_jefe: any) {
    this.licenciasService.getLicenciasByIdJefe(id_jefe).subscribe(
      res => {
        this.licencias = res;
        this.licencias.forEach(licencia => {
          if(licencia.estado != undefined){
            licencia.estado_string = this.estados[licencia.estado].valor;
            licencia.estado_color = this.estados[licencia.estado].color;
          }
        }
        );
      },
      err => alert(err.error.message)
    );
  }

}