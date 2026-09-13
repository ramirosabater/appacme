import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Adjunto } from 'src/app/Modelos/adjuntos';
import { Domicilio } from 'src/app/Modelos/domicilios';
import { Empleado } from 'src/app/Modelos/empleado';
import { User } from 'src/app/Modelos/user';
import { AdjuntosService } from 'src/app/services/adjuntos.service';
import { DomiciliosService } from 'src/app/services/domicilios.service';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-mi-legajo',
  templateUrl: './mi-legajo.component.html',
  styleUrls: ['./mi-legajo.component.css']
})
export class MiLegajoComponent implements OnInit {

  user: User = {};
  empleado: Empleado = {};
  jefe: User = {};
  domicilios: Domicilio[] = [];
  adjuntos: Adjunto[] = [];
  dniFrente: Adjunto = { id_adjunto: 0 };
  dniDorso: Adjunto = { id_adjunto: 0 };

  ruta: string = environment.ruta_api;

  fileFrente: any = null;
  fileDorso: any = null;

  isMyLegajo: number = 0;
  idVistaUsuario = 0;

  vistaLegajo: number = 0;

  constructor(
    public userServ: UsersService,
    public loginService: LoginService,
    public empleadosService: EmpleadosService,
    public domiciliosService: DomiciliosService,
    public adjuntosService: AdjuntosService,
    private rutaActiva: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    this.isMyLegajo = this.rutaActiva.snapshot.params.id;
    this.vistaLegajo = this.isMyLegajo;
    this.idVistaUsuario = this.rutaActiva.snapshot.params.usuario;

    if(this.isMyLegajo == 0){
      this.getUser(this.loginService.data.user.id_usuario)
      this.getEmpleado(this.loginService.data.user.id_usuario);
    } else {
      this.getUser(this.idVistaUsuario);
      this.getEmpleado(this.idVistaUsuario);
    }

    if(this.isMyLegajo == 3){
      this.isMyLegajo = 0;
    }

  }

  onFileChangeFrente(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.fileFrente = <File>event.target.files[0];
    }
  }

  onFileChangeDorso(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.fileDorso = <File>event.target.files[0];
      //console.log(this.fileDorso);
    }
  }

  getAdjuntos() {
    if (this.empleado.id_empleado != undefined) {
      this.adjuntosService.getAdjuntosByIdEmpleado(this.empleado.id_empleado).subscribe(
        res => {
          this.adjuntos = res;
          this.adjuntos.forEach(adjunto => {
            if (adjunto.id_tipo_adjunto == 1) {
              this.dniFrente = adjunto;
            } else if (adjunto.id_tipo_adjunto == 2) {
              this.dniDorso = adjunto;
            }
          });
        },
        err => {
          alert(err.error.message);

        }
      )
    } else {
      alert('No se pudo obtener el id del empleado');
    }

  }

  bajaDomicilio(id: any) {
    var data = {
      id_direccion: id
    }

    if (!confirm('¿Está seguro que desea eliminar este domicilio?')) {
      return;
    }

    this.domiciliosService.bajaDomicilio(data).subscribe(
      res => {
        alert('Domicilio eliminado con éxito');
        if (this.user.id_usuario != undefined) {
          this.getDomiciliosById(this.user.id_usuario);
        }

      },
      err => {
        alert(err.error.message);
        //console.log(err);
      }
    )
  }

  getDomiciliosById(id: number) {
    this.domiciliosService.getDomiciliosByIdUsuario(id).subscribe(
      res => {
        this.domicilios = res;
        //console.log(this.domicilios);
      },
      err => {
        alert(err.error.message)
        //console.log(err)
      }
    )
  }


  getUser(id_usuario: any) {
    this.userServ.getUserById(id_usuario).subscribe(
      res => {
        this.user = res[0];
        //console.log(this.user)
        if (this.user.id_usuario != undefined)
          this.getDomiciliosById(this.user.id_usuario);

        if(this.user.id_estado != undefined)
          if(this.user.id_estado == 2){
            this.isMyLegajo = 1;
          }
      },
      err => alert(err.error.message)
    )
  }

  getJefe(id_jefe: any) {
    this.userServ.getUserById(id_jefe).subscribe(
      res => {
        this.jefe = res[0];
        //console.log(this.jefe);
      },
      err => alert(err.error.message)
    )
  }

  getEmpleado(id_usuario: any) {
    this.empleadosService.getEmpleadosById(id_usuario).subscribe(
      res => {
        this.empleado = res[0];
        //console.log(res);
        //console.log(this.empleado);
        this.getAdjuntos();
        this.getJefe(this.empleado.jefe_directo);
      },
      err => alert(err.error.message)
    )
  }

  createAdjuntoDNI(id_tipo_adjunto: any) {
    if (id_tipo_adjunto == 1) {

      if (this.fileFrente == null) {
        alert('Debe seleccionar una imagen');
        return;
      } else {
        if (this.fileFrente.size > 20000000) {
          alert('El archivo no puede ser mayor a 20 MB');
          return
        }

        if (this.fileFrente.type != "image/jpeg" && this.fileFrente.type != "image/png" && this.fileFrente.type != "image/jpg") {
          alert('Solo se aceptan archivos con formato de imagen: p.ej. jpg, png, jpeg');
          return
        }
        this.adjuntosService.createAdjunto(this.empleado.id_empleado, 1, 'Frente dni', this.fileFrente).subscribe(
          res => {
            alert('Frente dni cargado con éxito');
            this.getAdjuntos();
          },
          err => {
            alert(err.error.message);
            //console.log(err);
          }
        )

      }
    } else if (id_tipo_adjunto == 2) {
      if (this.fileDorso == null) {
        alert('Debe seleccionar una imagen');
        return;
      } else {
        if (this.fileDorso.size > 10000000) {
          alert('El archivo no puede ser mayor a 10 MB');
          return
        }
  
        if (this.fileDorso.type != "image/jpeg" && this.fileDorso.type != "image/png" && this.fileDorso.type != "image/jpg") {
          alert('Solo se aceptan archivos con formato de imagen: p.ej. jpg, png, jpeg');
          return
        }
        this.adjuntosService.createAdjunto(this.empleado.id_empleado, 2, 'Dorso dni', this.fileDorso).subscribe(
          res => {
            alert('Dorso dni cargado con éxito');
            this.getAdjuntos();
          },
          err => {
            alert(err.error.message);
            //console.log(err);
          }
        )
      }
    }

  }

  bajaAdjunto(id: any) {

    if (!confirm('¿Está seguro que desea eliminar este adjunto?')) {
      return;
    }

    this.adjuntosService.deleteAdjunto(id).subscribe(
      res => {
        alert('Adjunto eliminado con éxito');
        this.dniDorso = { id_adjunto: 0 };
        this.dniFrente = { id_adjunto: 0 };
        this.getAdjuntos();
      },
      err => {
        alert(err.error.message);
        //console.log(err);
      }
    )
  }


}
