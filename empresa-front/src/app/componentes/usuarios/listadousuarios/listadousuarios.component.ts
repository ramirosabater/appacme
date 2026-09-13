import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Modelos/user';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service'
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-listadousuarios',
  templateUrl: './listadousuarios.component.html',
  styleUrls: ['./listadousuarios.component.css']
})
export class ListadousuariosComponent implements OnInit {

  users: User[] = [];
  estado: string = ''; //Activo o Inactivo
  color: string = ''; //color del estado

  constructor(public router: Router, public usersService: UsersService, public loginService: LoginService) { }

  ngOnInit(): void {
    this.getUsers();
  }

  //filtrar los usuarios y agregar activo o inactivo
  filtrarUsuarios() {
    this.users.forEach(user => {
      if (user.id_estado == 1) {
        user.estado = 'activo';
        user.colorestado = 'success';
      } else {
        user.estado = 'desactivado';
        user.colorestado = 'danger';
      }
    });
  }

  newUser() {
    this.router.navigate(['/new-user/0/0']);
  }

  getUsers() {
    this.usersService.getUsers().subscribe(
      res => {
        this.users = res;
        this.filtrarUsuarios();
      },
      err => alert(err.error.message)
    );
  }


}
