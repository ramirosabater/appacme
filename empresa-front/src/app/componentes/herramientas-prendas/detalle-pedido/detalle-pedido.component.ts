import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HerramientasPrendas } from 'src/app/Modelos/herramientas-prendas';
import { User } from 'src/app/Modelos/user';
import { HerramientasPrendasService } from 'src/app/services/herramientas-prendas.service';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-detalle-pedido',
  templateUrl: './detalle-pedido.component.html',
  styleUrls: ['./detalle-pedido.component.css']
})
export class DetallePedidoComponent implements OnInit {

  bandera: number = 2;
  solicitud: HerramientasPrendas = {};
  user: number = 0;
  rechazar: number = 0;
  loading: boolean = false;
  empleado: User = {};
  jefe_directo: User = {};
  cantidad_elementos:number=0;


  constructor(public loginService: LoginService,
    private activatedRoute: ActivatedRoute, public herramientasPrendasService: HerramientasPrendasService, public userService: UsersService) { }

  ngOnInit(): void {
    this.bandera = this.activatedRoute.snapshot.params.id;
    this.user = this.activatedRoute.snapshot.params.user
    this.getSolicitudById(this.bandera)
  }

  getSolicitudById(id_solicitud: any) {
    this.herramientasPrendasService.getSolicitudById(id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.solicitud = res[0];
        if (this.solicitud.id_empleado != undefined)
          this.getUserById(this.solicitud.id_empleado, true)
        if (this.solicitud.id_jefe_directo != undefined)
          this.getUserById(this.solicitud.id_jefe_directo, false)

        if(this.solicitud.datos != null){
          this.solicitud.datos.forEach(datos => {
            if(datos.cantidad != undefined)
            this.cantidad_elementos += datos.cantidad
          });
        }
      },
      err => {
        //console.log(err)
      }
    )
  }

  aprobarRRHH() {

    if (!confirm('Desea aprobar esta solicitud?')) {
      return
    }

    this.loading = true;
    this.herramientasPrendasService.aprobarRRHH(this.solicitud.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.solicitud.estado = 1;
      },
      err => {
        //console.log(err);
        alert('Ocurrio un error al aprobar la solicitud rrhh')
      }
    )
  }

  btnRechazarRRHH() {
    this.rechazar = 1;

  }

  rechazarRRHH(motivoRRHH: any) {

    if (!confirm('Esta seguro que desea rechazar esta solicitud?')) {
      return
    }

    this.loading = true;

    var data = {
      descargo_recursos: motivoRRHH.value,
      id_solicitud: this.solicitud.id_solicitud
    }

    this.herramientasPrendasService.denegar(data).subscribe(
      res => {
        alert('Se ha rechazado la solicitud.');
        //console.log(res);
        this.solicitud.estado = 2;
        this.solicitud.descargo_recursos = motivoRRHH.value
      },
      err => {
        alert('Ocurrio un error al rechazar la solicitud');
        //console.log(err)
      }
    )
  }

  btnCancelarRechazarRRHH() {
    if (!confirm("¿Está seguro de cancelar la operacion?")) {
      return;
    }
    this.rechazar = 0;
  }

  aprobarEmpleado() {

    if (!confirm('Desea dar por recibida esta solicitud?')) {
      return
    }

    this.loading = true;
    this.herramientasPrendasService.aprobarEmpleado(this.solicitud.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.solicitud.estado_respuesta_empleado = 1;
      },
      err => {
        //console.log(err);
        alert('Ocurrio un error al dar por recibida la solicitud')
      }
    )
  }

  rechazarEmpleado(motivoRRHH: any) {

    if (!confirm('Esta seguro que desea rechazar esta solicitud?')) {
      return
    }

    this.loading = true;

    var data = {
      respuesta_empleado: motivoRRHH.value,
      id_solicitud: this.solicitud.id_solicitud
    }

    this.herramientasPrendasService.rechazar(data).subscribe(
      res => {
        alert('Se ha rechazado la solicitud.');
        //console.log(res);
        this.solicitud.estado_respuesta_empleado = 2;
        this.solicitud.respuesta_empleado = motivoRRHH.value
      },
      err => {
        alert('Ocurrio un error al rechazar la solicitud');
        //console.log(err)
      }
    )
  }

  getUserById(id_usuario: any, tipo: boolean) {
    this, this.userService.getUserById(id_usuario).subscribe(
      res => {
        if (tipo) {
          this.empleado = res[0]
        }
        if (!tipo) {
          this.jefe_directo = res[0]
        }
      },
      err => {
        alert('Ocurrio un error al obtener a los empleados')
      }
    )
  }


}
