import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/Modelos/empleado';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-listado-legajos',
  templateUrl: './listado-legajos.component.html',
  styleUrls: ['./listado-legajos.component.css']
})
export class ListadoLegajosComponent implements OnInit {

  users: Empleado[] = [];
  estado: string = ''; //Activo o Inactivo
  color: string = ''; //color del estado
  constructor(public loginService:LoginService, public empleadosService:EmpleadosService) { }

  ngOnInit(): void {
    this.getUsers()
  }

  filtrarUsuarios() {
    this.users.forEach(user => {
      if (user.id_estado == 1) {
        user.estado = 'activo';
        user.color_estado = 'success';
      } else {
        user.estado = 'desactivado';
        user.color_estado = 'danger';
      }
    });
  }

  getUsers() {
    this.empleadosService.getEmpleados().subscribe(
      res => {
        this.users = res;
        //console.log(res)
        //console.log(res)
        this.filtrarUsuarios();
      },
      err => alert(err.error.message)
    );
  }

}
