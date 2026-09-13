import { Component, OnInit } from '@angular/core';
import { Feriado } from 'src/app/Modelos/feriado';
import { Rol } from 'src/app/Modelos/rol';
import { FeriadosService } from 'src/app/services/feriados.service'
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-admcalendario',
  templateUrl: './admcalendario.component.html',
  styleUrls: ['./admcalendario.component.css']
})
export class AdmcalendarioComponent implements OnInit {

  feriados: Feriado[] = [];
  proximoFeriado: Feriado = {};

  isAdminFeriados: boolean = false;
  roles: any[] = [];

  constructor(public feriadoService:FeriadosService, public loginService: LoginService) { }

  ngOnInit(): void {
    this.isAdminFeriados = false;
    this.roles = this.loginService.data.user.roles;
    this.getFeriados();
    this.getProximoFeriado();
  }
  
  idAdminFeriados() {

    for (let rol of this.roles) {
      if (rol == 'Administrador Feriados') {
        this.isAdminFeriados = true;
      }
    }
  }

  getFeriados() {
    this.feriadoService.getFeriados().subscribe(
      res => {
        this.feriados = res;
      },
      err => alert(err.error.message)
    );
    this.idAdminFeriados();
  }

  getProximoFeriado() {
    this.feriadoService.getProximoFeriado().subscribe(
      res => {
        this.proximoFeriado = res[0];
      },
      err => alert(err.error.message)
    );
  }

}
