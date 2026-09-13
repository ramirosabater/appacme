import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Permisos } from 'src/app/Modelos/permiso';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-navegacion',
  templateUrl: './navegacion.component.html',
  styleUrls: ['./navegacion.component.css']
})
export class NavegacionComponent implements OnInit {

  permisos: Permisos[] = [];

  permisosUser: Permisos[] = []; //id_rol = 1
  permisosEnlacesExternos: Permisos[] = [];

  permisosJefe: Permisos[] = []; //id_rol = 2
  permisosRecursos: Permisos[] = []; //id_rol = 3
  permisosAdministradorNoticias: Permisos[] = []; //id_rol = 4
  permisosAdministradorFeriados: Permisos[] = []; //id_rol = 5
  permisosAdministradorUsuarios: Permisos[] = []; //id_rol = 6
  permisosSolicitante: Permisos[] = []; //id_rol = 7
  permisosTesoreria: Permisos[] = []; //id_rol = 8
  permisosAdministracion: Permisos[] = []; //id_rol = 9
  permisosPasante: Permisos[] = []; //id_rol = 10
  permisosOportunidades: Permisos[] = []; //id_rol = 11


  constructor(
    public loginService: LoginService,
    public usuariosService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getPermisos(this.loginService.data.user.id_usuario);
  }

  // Función para cerrar sesión, limpiar data y redirigir a login
  logout() {
    this.loginService.data = {};
    this.loginService.isLogued = false;
    // navegar a la ruta inicial
    alert("Sesión cerrada");
    this.router.navigate(['/']);
  }

  //get permisos del usuario
  getPermisos(id_usuario: number) {
    this.usuariosService.getPermisos(id_usuario).subscribe(
      res => {
        this.permisos = res;
        this.permisos.forEach(permiso => {
          if (permiso.id_rol == 1) {
            //comprobar que permiso.permiso empiece con 'http'
            if (permiso.ruta != undefined) {
              if (permiso.ruta.startsWith('http')) {
                this.permisosEnlacesExternos.push(permiso);
              }
              else {
                this.permisosUser.push(permiso);
              }
            }

          }
          if (permiso.id_rol == 2) {
            this.permisosJefe.push(permiso);
          }
          if (permiso.id_rol == 3) {
            this.permisosRecursos.push(permiso);
          }
          if (permiso.id_rol == 4) {
            this.permisosAdministradorNoticias.push(permiso);
          }
          if (permiso.id_rol == 5) {
            this.permisosAdministradorFeriados.push(permiso);
          }
          if (permiso.id_rol == 6) {
            this.permisosAdministradorUsuarios.push(permiso);

          }
          if (permiso.id_rol == 7){
            this.permisosSolicitante.push(permiso)
          }

          if (permiso.id_rol == 8){
            this.permisosTesoreria.push(permiso)
          }

          if (permiso.id_rol == 9){
            this.permisosAdministracion.push(permiso)
          }

          if (permiso.id_rol == 10){
            this.permisosPasante.push(permiso)
          }

          if (permiso.id_rol == 11){
            this.permisosOportunidades.push(permiso)
          }
        });

        if(this.permisosAdministradorUsuarios.length > 0){
          this.usuariosService.isAdminAdmin = true;
        } else {
          this.usuariosService.isAdminAdmin = false;
        }

      },
      err => alert(err.error.message)
    );
  }

}
