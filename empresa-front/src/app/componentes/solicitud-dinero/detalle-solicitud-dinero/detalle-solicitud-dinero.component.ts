import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Empleado } from 'src/app/Modelos/empleado';
import { SolicitudDinero } from 'src/app/Modelos/solicitudesDinero';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { LoginService } from 'src/app/services/login.service';
import { SolicitudDineroService } from 'src/app/services/solicitud_dinero.service';

@Component({
  selector: 'app-detalle-solicitud-dinero',
  templateUrl: './detalle-solicitud-dinero.component.html',
  styleUrls: ['./detalle-solicitud-dinero.component.css']
})
export class DetalleSolicitudDineroComponent implements OnInit {

  id_solicitud: number = 0;
  id_tipo: number = 0;
  solicitud: SolicitudDinero = {};
  tipo_string: string = '';
  empleado: Empleado = {}

  user: number = 0;
  rechazar: number = 0;
  loading: boolean = false;
  banderaEliminar: boolean = false;

  aprobadoJefe: boolean = false;
  aprobadoAdministracion = false;
  presentoRendicion: boolean = false;

  visualizaAcciones: boolean = false;
  prepararRendicion: boolean = false;
  visualizarRendicion: boolean = false;

  visualizarRechazar: boolean = true;

  estados = [{
    valor: 'pendiente',
    color: 'warning'
  },
  {
    valor: 'finalizado',
    color: 'success'
  },
  {
    valor: 'rechazado',
    color: 'danger'
  },
  {
    valor: '0',
    color: 'primary'
  }
  ];

  constructor(public loginService: LoginService, private router: Router, public solicitudDineroService: SolicitudDineroService, private activatedRoute: ActivatedRoute, public empleadoService: EmpleadosService) { }

  ngOnInit(): void {
    this.visualizaAcciones = false;
    this.id_solicitud = this.activatedRoute.snapshot.params.id;
    this.id_tipo = this.activatedRoute.snapshot.params.id_tipo;
    this.user = parseFloat(this.activatedRoute.snapshot.params.user);
    //console.log(this.user)
    this.getSolicitud(this.id_solicitud);

    if(this.user == 2 && this.id_tipo == 3){
      this.visualizarRechazar = false;
    }
  }

  getEmpleadoById(id_empleado: any) {
    this.empleadoService.getEmpleadosById(id_empleado).subscribe(
      res => {
        //console.log(res);
        this.empleado = res[0];
      },
      err => {
        alert('Error al obtener nombre de empleado')
      }
    )
  }

  getSolicitud(id_solicitud: any) {
    this.solicitudDineroService.getSolicitudById(id_solicitud).subscribe(
      res => {
        this.solicitud = res[0];
        //console.log(this.solicitud);

        if (this.solicitud.estado != undefined) {
          this.estados.forEach(element => {
            if (element.valor == this.solicitud.estado) {
              this.solicitud.estado_color = element.color
            }
          });
        }


        if (this.solicitud.id_empleado)
          this.getEmpleadoById(this.solicitud.id_empleado);

        //console.log();

        this.visualizaAcciones = false;
        this.prepararRendicion = false;
        this.visualizarRendicion = false;

        if (this.solicitud.tipo_estado) {

          if (this.solicitud.tipo_estado?.length == 0 && this.user == 4) {
            this.visualizaAcciones = true;
          }

          if (this.solicitud.tipo_estado?.length > 0) {
            if (this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Aprobado pedido jefe directo' && this.user == 5) {
              this.visualizaAcciones = true;
            }
          }

          if (this.solicitud.tipo_estado?.length > 0) {
            if (this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Aprobado pedido administración' || this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Rendición final rechazada' || this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Denegado rendición administración'|| this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Denegado rendición jefe directo'|| this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Denegado rendición administración' ) {
              if(this.user == 1){
                this.prepararRendicion = true;
              }
              
            }

          }

          if (this.solicitud.tipo_estado?.length > 0) {
            if (this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Presentacion de rendición final realizada' && this.user == 4) {
              this.visualizarRendicion = true;
              this.visualizaAcciones = true;
            }
          }

          if (this.solicitud.tipo_estado?.length > 0) {
            if (this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Aprobado rendición jefe directo' && this.user == 5) {
              this.visualizarRendicion = true;
              this.visualizaAcciones = true;
            }
          }

          if (this.solicitud.tipo_estado?.length > 0) {
            if (this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Aprobado rendición administración' && this.user == 5) {
              this.visualizarRendicion = true;
            }
          }


          //viaje vendedores

          if (this.solicitud.tipo_estado?.length > 0) {
            if (this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Aprobado pedido jefe directo' && this.user == 2) {
              this.visualizaAcciones = true;
            }
          }

          if (this.solicitud.tipo_estado?.length > 0) {
            if (this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Aprobado pedido tesorería' && this.user == 1) {
              this.prepararRendicion = true;
            }

          }

          if (this.solicitud.tipo_estado?.length > 0) {
            if (this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Aprobado rendición jefe directo' && this.user == 2) {
              this.visualizarRendicion = true;
              this.visualizaAcciones = true;
            }
          }

          //deslocalizados
          if (this.solicitud.tipo_estado?.length == 0 && this.user == 3) {
            this.visualizaAcciones = true;
          }

          if (this.solicitud.tipo_estado?.length > 0) {
            if (this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Aprobado pedido recursos humanos' && this.user == 2) {
              this.visualizaAcciones = true;
            }

          }

          //tarjeta de credito

          if(this.solicitud.tipo_estado?.length == 0)
          if(this.solicitud.id_tipo_solicitud == 4 && this.user == 1){
            this.prepararRendicion = true;
          }

          if(this.solicitud.tipo_estado?.length > 0)
          if(this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Denegado rendición tesorería' && this.user == 1){
            this.prepararRendicion = true;
          }

          if(this.solicitud.tipo_estado?.length > 0)
          if(this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Presentacion de rendición final realizada' && this.user == 1){
            this.visualizarRendicion = true;
          }

          if(this.solicitud.tipo_estado?.length > 0)
          if(this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Presentacion de rendición final realizada' && this.user == 2){
            this.visualizarRendicion = true;
            this.visualizaAcciones = true;
          }

          if(this.solicitud.tipo_estado?.length > 0)
          if(this.solicitud.tipo_estado[this.solicitud.tipo_estado.length - 1].descripcion_tipo_estado == 'Aprobado rendición tesorería' && this.user == 2){
            this.visualizarRendicion = true;
          }
        }



      },
      err => {
        //console.log(err);
      }
    )
  }

  historial() {
    this.router.navigate(['historial-solicitud-dinero'])
  }

  aprobarSolicitud() {
    if (this.user == 4 && !this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 1) {
      this.aprobarSolicitudJefe();
    }

    if (this.user == 4 && !this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 2) {
      this.aprobarSolicitudJefeViajeVendedores();
    }

    if (this.user == 5 && !this.visualizarRendicion) {
      this.aprobarSolicitudAdministracion();
    }

    if (this.user == 2 && !this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 2) {
      this.aprobarSolicitudTesoreria();
    }

    if (this.user == 4 && this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 1) {
      this.aprobarRendicionJefe();
    }

    if (this.user == 4 && this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 2) {
      this.aprobarRendicionJefeViajeVendedores();
    }

    if (this.user == 5 && this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 1) {
      this.aprobarRendicionAdministracion();
    }

    if (this.user == 2 && this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 2) {
      this.aprobarRendicionTesoreria();
    }

    if (this.user == 3 && !this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 3) {
      this.aprobarSolicitudRRHH();
    }

    if (this.user == 2 && this.solicitud.id_tipo_solicitud == 3) {
      this.aprobarSolicitudDeslocalizadosTesoreria();
    }

    if (this.user == 2 && this.solicitud.id_tipo_solicitud == 4) {
      this.aprobarRendicionTarjeta();
    }
  }

  rechazarSolicitud(motivo: any) {
    //console.log("rechazando solicitud ", motivo.value);
    if (this.user == 4 && !this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 1) {
      this.rechazarSolicitudJefe(motivo);
    }

    if (this.user == 5 && !this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 1) {
      this.rechazarSolicitudAdministracion(motivo);
    }

    if (this.user == 4 && this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 1) {
      this.rechazarRendicionJefe(motivo);
    }

    if (this.user == 5 && this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 1) {
      this.rechazarRendicionAministracion(motivo);
    }

    if (this.user == 4 && !this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 2) {
      this.rechazarSolicitudJefeViajeVendedores(motivo);
    }

    if (this.user == 2 && !this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 2) {
      this.rechazarSolicitudTesoreriaViajeVendedores(motivo);
    }

    if (this.user == 4 && this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 2) {
      this.rechazarRendicionJefeViajeVendedores(motivo);
    }

    if (this.user == 3 && !this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 3) {
      this.rechazarSolicitudRRHH(motivo);
    }

    if (this.user == 2 && this.visualizarRendicion && this.solicitud.id_tipo_solicitud == 2) {
      this.rechazarRendicionTesoreria(motivo);
    }

    if (this.user == 2 && this.solicitud.id_tipo_solicitud == 4) {
      this.recharzarRendicionTarjeta();
    }

   }

  aprobarSolicitudJefe() {
    //console.log("aprobando jefe");
    if (!confirm('Desea aprobar esta solicitud?')) {
      return
    }
    this.loading = true;
    this.solicitudDineroService.aprobarCajaChicaJefe(this.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.visualizaAcciones = false;
        this.getSolicitud(this.id_solicitud);
        alert('Solicitud aprobada con exito!');
        this.loading = false;
      },
      err => {
        //console.log(err);
        this.loading = false;
      }
    )
  }

  rechazarSolicitudJefe(motivo: any) {
    //console.log("rechazando solicitud jefe ", motivo.value);
    if (!confirm('Desea rechazar esta solicitud?')) {
      return
    }
    var data = {
      motivo: motivo.value
    }
    this.loading = true;
    this.solicitudDineroService.rechazarCajaChicaJefe(this.id_solicitud, data).subscribe(
      res => {
        alert('Solicitud denegada!');
        this.getSolicitud(this.id_solicitud);
        this.loading = false;
      },
      err =>{
        alert('Error al rechazar solicitud jefe');
        this.loading = false;
      }
    )
  }

  aprobarSolicitudAdministracion() {
    //console.log("aprobando administracion");
    if (!confirm('Desea aprobar esta solicitud?')) {
      return
    }
    this.loading = true;
    this.solicitudDineroService.aprobarCajaChicaAdministracion(this.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.visualizaAcciones = false;
        this.getSolicitud(this.id_solicitud);
        alert('Solicitud aprobada con exito!');
        this.loading = false;
      },
      err => {
        //console.log(err);
        this.loading = false;
      }
    )
  }

  rechazarSolicitudAdministracion(motivo: any) {
    //console.log("rechazando solicitud administracion ", motivo.value)
    if (!confirm('Desea rechazar esta solicitud?')) {
      return
    }
    var data = {
      motivo: motivo.value
    }
    this.loading = true;
    this.solicitudDineroService.rechazarCajaChicaAdministracion(this.id_solicitud, data).subscribe(
      res => {
        alert('Solicitud denegada!');
        this.getSolicitud(this.id_solicitud);
        this.loading = false;
      },
      err =>{
        alert('Error al rechazar solicitud administracion');
        this.loading = false;
      }
    )
  }

  aprobarRendicionJefe() {

    if (!confirm('Desea aprobar la rendicion de esta solicitud?')) {
      return
    }
    this.loading = true;
    this.solicitudDineroService.aprobarCajaChicaRendicionJefe(this.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.visualizaAcciones = false;
        this.getSolicitud(this.id_solicitud);
        alert('Revision aprobada con exito!');
        this.loading = false;
      },
      err => {
        //console.log(err);
        this.loading = false;
      }
    )
  }

  rechazarRendicionJefe(motivo: any) {
    if (!confirm('Desea rechazar la rendicion de esta solicitud?')) {
      return
    }
    //console.log("rechazando rendicion jefe ", motivo.value);
    var data = {
      motivo: motivo.value
    }

    this.loading = true;
    this.solicitudDineroService.rechazarCajaChicaRendicionJefe(this.id_solicitud, data).subscribe(
      res => {
        alert('Rendicion rechazada!');
        this.getSolicitud(this.id_solicitud);
        this.loading = false;
      },
      err =>{
        alert('Error al rechazar rendicion jefe');
        this.loading = false;
      }
    )
  }

  aprobarRendicionAdministracion() {
    if (!confirm('Desea aprobar la rendicion de esta solicitud?')) {
      return
    }
    this.loading = true;
    this.solicitudDineroService.aprobarCajaChicaRendicionAdministracion(this.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.visualizaAcciones = false;
        this.getSolicitud(this.id_solicitud);
        alert('Revision aprobada con exito! Se cierra circuito.');
        this.loading = false;
      },
      err => {
        //console.log(err);
        this.loading = false;
      }
    )
  }

  rechazarRendicionAministracion(motivo: any) {
    if (!confirm('Desea rechazar la rendicion de esta solicitud?')) {
      return
    }
    //console.log("rechazando rendicion administracion ", motivo.value);
    var data = {
      motivo: motivo.value
    }

    this.loading = true;
    this.solicitudDineroService.rechazarCajaChicaRendicionAdministracion(this.id_solicitud, data).subscribe(
      res => {
        alert('Rendicion rechazada!');
        this.getSolicitud(this.id_solicitud);
        this.loading = false;
      },
      err =>{
        alert('Error al rechazar rendicion administracion');
        this.loading = false;
      }
    )
  }

  aprobarSolicitudJefeViajeVendedores() {
    //console.log("aprobando jefe");
    if (!confirm('Desea aprobar esta solicitud?')) {
      return
    }

    this.loading = true;
    this.solicitudDineroService.aprobarViajeVendedoresJefe(this.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.visualizaAcciones = false;
        this.getSolicitud(this.id_solicitud);
        alert('Solicitud aprobada con exito!');
        this.loading = false;
      },
      err => {
        //console.log(err);
        this.loading = false;
      }
    )
  }

  rechazarSolicitudJefeViajeVendedores(motivo: any) {
    if (!confirm('Desea rechazar esta solicitud?')) {
      return
    }
    //console.log("rechazando solicitud jefe ", motivo.value);
    var data = {
      motivo: motivo.value
    }

    this.loading = true;
    this.solicitudDineroService.rechazarViajeVendedoresJefe(this.id_solicitud, data).subscribe(
      res => {
        alert('Solicitud denegada!');
        this.getSolicitud(this.id_solicitud);
        this.loading = false;
      },
      err =>{
        alert('Error al rechazar solicitud jefe');
        this.loading = false;
      }
    )
  }

  aprobarSolicitudTesoreria() {
    //console.log("aprobando tesoreria");
    if (!confirm('Desea aprobar esta solicitud?')) {
      return
    }

    this.loading = true;
    this.solicitudDineroService.aprobarViajeVendedoresTesoreria(this.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.visualizaAcciones = false;
        this.getSolicitud(this.id_solicitud);
        alert('Solicitud aprobada con exito!');
        this.loading = false;
      },
      err => {
        //console.log(err);
        this.loading = false;
      }
    )
  }

  rechazarSolicitudTesoreriaViajeVendedores(motivo: any) {
    if (!confirm('Desea rechazar esta solicitud?')) {
      return
    }
    //console.log("rechazando solicitud tesoreria ", motivo.value);
    var data = {
      motivo: motivo.value
    }

    this.loading = true;
    this.solicitudDineroService.rechazarViajeVendedoresTesoreria(this.id_solicitud, data).subscribe(
      res => {
        alert('Solicitud denegada!');
        this.getSolicitud(this.id_solicitud);
        this.loading = false;
      },
      err =>{
        alert('Error al rechazar solicitud tesoreria');
        this.loading = false;
      }
    )
  }

  aprobarRendicionJefeViajeVendedores() {
    if (!confirm('Desea aprobar la rendicion de esta solicitud?')) {
      return
    }
    this.loading = true;
    this.solicitudDineroService.aprobarViajeVendedoresRendicionJefe(this.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.visualizaAcciones = false;
        this.getSolicitud(this.id_solicitud);
        alert('Revision aprobada con exito!');
        this.loading = false;
      },
      err => {
        //console.log(err);
        this.loading = false;
      }
    )
  }

  rechazarRendicionJefeViajeVendedores(motivo: any) {
    if (!confirm('Desea rechazar la rendicion de esta solicitud?')) {
      return
    }
    //console.log("rechazando rendicion jefe ", motivo.value);
    var data = {
      motivo: motivo.value
    }

    this.loading = true;
    this.solicitudDineroService.rechazarViajeVendedoresRendicionJefe(this.id_solicitud, data).subscribe(
      res => {
        alert('Rendicion rechazada!');
        this.getSolicitud(this.id_solicitud);
        this.loading = false;
      },
      err =>{
        alert('Error al rechazar rendicion jefe');
        this.loading = false;
      }
    )
  }

  aprobarRendicionTesoreria() {
    if (!confirm('Desea aprobar la rendicion de esta solicitud?')) {
      return
    }
    this.loading = true;
    this.solicitudDineroService.aprobarViajeVendedoresRendicionTesoreria(this.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.visualizaAcciones = false;
        this.getSolicitud(this.id_solicitud);
        alert('Revision aprobada con exito! Se cierra circuito.');
        this.loading = false;
      },
      err => {
        //console.log(err);
        this.loading = false;
      }
    )
  }

  rechazarRendicionTesoreria(motivo: any) {
    if (!confirm('Desea rechazar la rendicion de esta solicitud?')) {
      return
    }

    var data = {}

    this.loading = true;
    this.solicitudDineroService.rechazarCajaChicaRendicionAdministracion(this.id_solicitud, data).subscribe(
      res => {
        alert('Rendicion rechazada!');
        this.getSolicitud(this.id_solicitud);
        this.loading = false;
      },
      err =>{
        alert('Error al rechazar rendicion tesoreria');
        this.loading = false;
      }
    )
  }

  aprobarSolicitudRRHH() {
    //console.log("aprobando rrhh");
    if (!confirm('Desea aprobar esta solicitud?')) {
      return
    }

    this.loading = true;
    this.solicitudDineroService.aprobarDeslocalizadosRRHH(this.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.visualizaAcciones = false;
        this.getSolicitud(this.id_solicitud);
        alert('Solicitud aprobada con exito!');
        this.loading = false;
      },
      err => {
        //console.log(err);
        this.loading = false;
      }
    )
  }

  rechazarSolicitudRRHH(motivo: any) {
    if (!confirm('Desea rechazar esta solicitud?')) {
      return
    }
    //console.log("rechazando solicitud rrhh ", motivo.value);
    var data = {
      motivo: motivo.value
    }

    this.loading = true;
    this.solicitudDineroService.rechazarRRHH(this.id_solicitud, data).subscribe(
      res => {
        alert('Solicitud denegada!');
        this.getSolicitud(this.id_solicitud);
        this.loading = false;
      },
      err =>{
        alert('Error al rechazar solicitud rrhh');
        this.loading = false;
      }
    )
  }

  aprobarSolicitudDeslocalizadosTesoreria() {
    if (!confirm('Desea aprobar esta solicitud?')) {
      return
    }
    this.loading = true;
    this.solicitudDineroService.aprobarDeslocalizadosTesoreria(this.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.visualizaAcciones = false;
        this.getSolicitud(this.id_solicitud);
        alert('Revision aprobada con exito! Se cierra circuito.');
        this.loading = false;
      },
      err => {
        //console.log(err);
        this.loading = false;
      }
    )
  }

  aprobarRendicionTarjeta() {
    if (!confirm('Desea aprobar la rendicion de esta solicitud?')) {
      return
    }
    this.loading = true;
    this.solicitudDineroService.aprobarTarjetaTesoreria(this.id_solicitud).subscribe(
      res => {
        //console.log(res);
        this.visualizaAcciones = false;
        this.getSolicitud(this.id_solicitud);
        alert('Revision aprobada con exito! Se cierra circuito.');
        this.loading = false;
      },
      err => {
        //console.log(err);
        this.loading = false;
      }
    )
  }

  recharzarRendicionTarjeta() {
    if (!confirm('Desea rechazar la rendicion de esta solicitud?')) {
      return
    }
    var data = {}

    this.loading = true;
    this.solicitudDineroService.rechazarTarjetaTesoreria(this.id_solicitud).subscribe(
      res => {
        //console.log(res);
        alert('Rendicion rechazada!');
        this.getSolicitud(this.id_solicitud);
        this.loading = false;
        
      },
      err =>{
        alert('Error al rechazar rendicion tarjeta');
        this.loading = false;
      }
    )
  }

  

  btnRechazar() {
    this.rechazar = 1;
  }

  btnCancelarRechazar() {
    if (!confirm("¿Está seguro de cancelar la operacion?")) {
      return;
    }
    this.rechazar = 0;
  }

}
