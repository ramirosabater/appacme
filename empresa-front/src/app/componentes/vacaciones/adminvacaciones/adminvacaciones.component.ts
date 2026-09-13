import { Component, OnInit } from '@angular/core';
import { Vacaciones } from 'src/app/Modelos/vacaciones';
import { LoginService } from 'src/app/services/login.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-adminvacaciones',
  templateUrl: './adminvacaciones.component.html',
  styleUrls: ['./adminvacaciones.component.css']
})
export class AdminvacacionesComponent implements OnInit {

  vacaciones:Vacaciones[] = [];
  //jefe_directo = 33;

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

  constructor(
    public vacacionesService: VacacionesService, public loginService: LoginService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.getVacacionesByJefeDirecto(this.loginService.data.user.id_usuario);
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getVacacionesByJefeDirecto(id: number){
    this.vacacionesService.getVacacionesByJefeDirecto(id).subscribe(
      res => {
        this.vacaciones = res;
        this.vacaciones.forEach(vacacion => {
          if(vacacion.estado != undefined){
            vacacion.estado_string = this.estados[vacacion.estado].valor;
            vacacion.estado_color = this.estados[vacacion.estado].color;
          }
        });
      },
      err => alert(err.error.message)
    )
  }

}
