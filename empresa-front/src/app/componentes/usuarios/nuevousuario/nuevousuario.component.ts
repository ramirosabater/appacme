import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/Modelos/user';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '../../../services/users.service';
import { ActivatedRoute } from '@angular/router';
import { Rol } from 'src/app/Modelos/rol';
import { LoginService } from 'src/app/services/login.service';
import { Empleado } from 'src/app/Modelos/empleado';
import { Sectores } from 'src/app/Modelos/sectores';
import { VacacionesService } from 'src/app/services/vacaciones.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { Posicion } from 'src/app/Modelos/posiciones';
import { Location } from '@angular/common';

import { MatSnackBar } from '@angular/material/snack-bar';
import { EmpresasService } from 'src/app/services/empresas.service';
import { Empresa } from 'src/app/Modelos/empresa';

@Component({
  selector: 'app-nuevousuario',
  templateUrl: './nuevousuario.component.html',
  styleUrls: ['./nuevousuario.component.css']
})
export class NuevousuarioComponent implements OnInit {

  user: User = {
    id_estado: 1,
    nombre: '',
    apellido: '',
    dni: '',
    email: '',
    telefono: ''
  };

  empleado: Empleado = {
    id_sector: 0,
    jefe_directo: 0,
    id_posicion: 0,
    n_legajo: 0,
    id_empresa: 0
  };

  sectores: Sectores[] = [];
  posiciones: Posicion[] = [];
  jefes: User[] = [];

  roles: Rol[] = [];

  roles_usuario: Rol[] = [];

  estado: string = ''; //Activo o Inactivo
  estado_color: string = ''; //success o danger
  etiqueta_estado: string = ''; //Desactivar o Activar
  titulo: string = 'Nuevo Usuario';
  disabled: string = '';

  id_usuario: number = 0;
  new: number = 0;

  empresas: Empresa[] = []

  constructor(public router: Router, public usersService: UsersService, private rutaActiva: ActivatedRoute, public loginService: LoginService, public vacacionesService: VacacionesService, public empleadoService: EmpleadosService, private location: Location,
    private _snackBar: MatSnackBar, public empresasService: EmpresasService) { }

  ngOnInit(): void {

    this.getSectores();
    this.getPosiciones();
    this.getUsuarios();
    this.getEmpresas();


    this.new = this.rutaActiva.snapshot.params.new;

    if (this.new != 0) {
      this.id_usuario = this.rutaActiva.snapshot.params.id;
      this.getUserById(this.id_usuario);
      this.titulo = 'Actualizar Usuario';
      this.disabled = 'disabled';
      this.getRoles();
      this.getRolesByUser(this.id_usuario);
      this.getEmpleadoById(this.id_usuario);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  getEmpresas(){
    this.empresasService.getEmpresas().subscribe(
      res => {
        this.empresas = res;
      },
      err => {
        alert('Error al obtener las empresas')
      }
    )
  }


  getPosiciones() {
    this.empleadoService.getPosiciones().subscribe(
      res => {
        this.posiciones = res;
        //console.log(this.posiciones);
      },
      err => {
        alert('Error al obtener las posiciones');
      }
    )
  }

  getEmpleadoById(id_empleado: number) {
    //console.log(id_empleado);
    this.empleadoService.getEmpleadosById(id_empleado).subscribe(
      res => {
        this.empleado = res[0];
        //console.log(res);
      },
      err => {
        alert('Error al obtener el empleado');
      }
    )
  }


  getUsuarios() {
    this.usersService.getUsers().subscribe(
      res => {
        this.jefes = res;
      },
      err => {
        alert('Error al obtener los jefes');
      }
    )
  }

  getSectores() {
    this.empleadoService.getSectores().subscribe(
      res => {
        this.sectores = res;
        //console.log(this.sectores);
      },
      err => {
        alert('Error al obtener los sectores');
      }
    )
  }

  eliminarRol(id_rol: number) {
    if (!confirm('¿Desea eliminar el rol?')) {
      return
    }

    var data = {
      id_usuario: this.id_usuario,
      id_rol: id_rol
    }

    this.usersService.deleteRolUsuario(data).subscribe(
      res => {
        this.openSnackBar('Se quito el rol correctamente', 'cerrar');
        this.getRolesByUser(this.id_usuario);
      },
      err => {
        alert('Error al eliminar el rol');
      }
    )
  }


  getRolesByUser(id_usuario: number) {
    this.usersService.getRolesByUser(id_usuario).subscribe(
      res => {
        this.roles_usuario = res;
      },
      err => {
        alert('Error al obtener los roles del usuario');
      }
    )
  }


  guardarRol(rol: any) {
    if (rol.value == 0) {
      alert('Debe seleccionar un rol');
      return;
    }

    var data = {
      id_usuario: this.id_usuario,
      id_rol: rol.value
    }

    this.usersService.addRolUsuario(data).subscribe(
      res => {
        this.openSnackBar('Se ha asignado el rol correctamente', 'cerrar');
        this.getRolesByUser(this.id_usuario);
      },
      err => {
        alert('Error al asignar el rol');
      }
    )
  }

  getRoles() {
    this.usersService.getRoles().subscribe(
      res => {
        this.roles = res;
      },
      err => {
        alert('Error al obtener los roles');
      }
    )
  }

  resetPassword() {
    if (!confirm('¿Desea resetear la contraseña?')) {
      return
    }
    var data = {
      dni: this.user.dni
    }
    this.usersService.resetPassword(data).subscribe(
      res => {
        this.openSnackBar('Contraseña reseteada con exito', 'cerrar');
      },
      err => {

        alert('Error al resetear la contraseña');
      }
    )
  }

  manejarEtiquetasEstado(id_estado: any) {
    if (id_estado == 1) {
      this.estado = 'Activo';
      this.estado_color = 'success';
      this.etiqueta_estado = 'Desactivar';
    } else {
      this.estado = 'Inactivo';
      this.estado_color = 'danger';
      this.etiqueta_estado = 'Activar';
    }
  }


  changeEstado() {
    var data = {
      dni: this.user.dni
    }

    if (this.user.id_estado == 1) {
      //preguntar si esta seguro de desactivar
      if (!confirm('¿Desea desactivar el usuario?')) {
        return
      }
      this.usersService.bajaUser(data).subscribe(
        res => {
          this.openSnackBar('Se desactivo el usuario', 'cerrar');
          this.getUserById(this.id_usuario);
          this.manejarEtiquetasEstado(this.user.id_estado);
        },
        err => alert(err.error.message)
      )
    }

    if (this.user.id_estado == 2) {
      this.usersService.altaUser(data).subscribe(
        res => {
          this.openSnackBar('Se activo el usuario', 'cerrar');
          this.getUserById(this.id_usuario);
          this.manejarEtiquetasEstado(this.user.id_estado);
        },
        err => alert(err.error.message)
      )
    }

  }


  getUserById(id: number) {

    this.usersService.getUserById(id).subscribe(
      res => {
        this.user = res[0];
        this.manejarEtiquetasEstado(this.user.id_estado);
        //console.log(this.user);
      },
      err => alert(err.error.message)
    )
  }

  cancelar() {
    if (confirm('¿Desea cancelar la accion? Los cambios no se guardaran')) {
      this.router.navigate(['/users']);
    }
  }

  guardar(form: NgForm) {
    if (form.value.nombre == '') {
      alert('Debe ingresar un nombre');
      return
    }

    if (form.value.apellido == '') {
      alert('Debe ingresar un apellido');
      return
    }

    if (form.value.dni == '') {
      alert('Debe ingresar un dni');
      return
    }

    if (form.value.telefono == '') {
      alert('Debe ingresar un telefono');
      return
    }

    if (form.value.email == '') {
      alert('Debe ingresar un email');
      return
    }

    if (this.empleado.id_sector == 0) {
      alert('Debe seleccionar un sector');
      return
    }

    if (this.empleado.jefe_directo == 0) {
      alert('Debe seleccionar un jefe directo');
      return
    }

    if (this.empleado.id_posicion == 0) {
      alert('Debe seleccionar una posicion');
      return
    }

    if (this.empleado.n_legajo == 0) {
      alert('Debe ingresar un legajo');
      return
    }

    if(this.empleado.id_empresa == 0){
      alert('Debe ingresar una empresa');
      return
    }

    //validar que el numero de legajo no exista, que sea numerico y que tenga 5 digitos
    if (this.empleado.n_legajo != undefined) {
      if (isNaN(this.empleado.n_legajo)) {
        alert('El numero de legajo debe ser numerico');
        return
      }

      if (this.empleado.n_legajo.toString().length != 5) {
        alert('El numero de legajo debe tener 5 digitos');
        return
      }
    }


    var data = {
      id_usuario: this.id_usuario,
      nombre: form.value.nombre,
      apellido: form.value.apellido,
      dni: form.value.dni,
      telefono: form.value.telefono,
      email: form.value.email,
      id_sector: this.empleado.id_sector,
      jefe_directo: this.empleado.jefe_directo,
      dias_vacaciones: 0,
      id_estado: 1,
      id_posicion: this.empleado.id_posicion,
      n_legajo: this.empleado.n_legajo,
      id_empresa: this.empleado.id_empresa
    }

    //console.log(data);

    if (this.new == 0) {

      this.usersService.createUser(data).subscribe(
        res => {
          this.openSnackBar('Usuario creado con exito', 'cerrar');
          this.location.back();
        },
        err => alert('Error: ' + err.error.message)
      )

    } else {

      var dataUpdate = {
        id_empleado: this.empleado.id_empleado,
        id_sector: this.empleado.id_sector,
        jefe_directo: this.empleado.jefe_directo,
        id_posicion: this.empleado.id_posicion,
        id_empresa: this.empleado.id_empresa
      }

      if (this.user.id_estado == 2) {
        alert('No se puede editar un usuario inactivo');
        return
      }
      this.usersService.editarUser(this.user).subscribe(
        res => {
          this.empleadoService.updateEmpleado(dataUpdate).subscribe(
            res => {
              this.openSnackBar('Usuario actualizado con exito', 'cerrar');
              this.location.back();
            },
            err => alert('Error: ' + err.error.message)
      )},
        err => alert('Error: ' + err.error.message)
      )
    }

  }

}
