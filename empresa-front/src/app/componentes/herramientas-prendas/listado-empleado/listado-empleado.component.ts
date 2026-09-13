import { Component, OnInit } from '@angular/core';
import { Estado } from 'src/app/Modelos/estado';
import { HerramientasPrendas } from 'src/app/Modelos/herramientas-prendas';
import { HerramientasPrendasService } from 'src/app/services/herramientas-prendas.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-listado-empleado',
  templateUrl: './listado-empleado.component.html',
  styleUrls: ['./listado-empleado.component.css']
})
export class ListadoEmpleadoComponent implements OnInit {

  solicitudes: HerramientasPrendas[] = []
  estados:Estado[] = [];
  constructor(public loginService: LoginService, public herramientasPrendasService: HerramientasPrendasService) { }

  ngOnInit(): void {
    this.getListadoEmpleado(this.loginService.data.user.id_usuario)

    var none:Estado = {valor: "none", color:"none"};
    this.estados.push(none)
    var aprobado:Estado = {valor: "Aprobado", color:"third"};
    this.estados.push(aprobado)
    var denegado:Estado = {valor: "Denegado", color:"danger"};
    this.estados.push(denegado)
    var pendiente:Estado = {valor: "Pendiente", color:"warning"};
    this.estados.push(pendiente)
    var recibido:Estado = {valor: "Recibido", color:"success"};
    this.estados.push(recibido)
    var rechazado:Estado = {valor: "Rechazado", color:"danger"};
    this.estados.push(rechazado)
  }

  getListadoEmpleado(id_empleado: any) {
    this.herramientasPrendasService.getSolicitudesByEmpleado(id_empleado).subscribe(
      res => {
        if (res != null)
          this.solicitudes = res;
          this.solicitudes.forEach(solicitud => {
            if (solicitud.estado != undefined) {
                solicitud.estado_string = this.estados[solicitud.estado];
                if(solicitud.estado_respuesta_empleado == 1){
                  solicitud.estado_string = this.estados[4]
                }
                if(solicitud.estado_respuesta_empleado == 2){
                  solicitud.estado_string = this.estados[5]
                }
            }
          })
        //console.log(this.solicitudes)
      },
      err => {
        //console.log(err)
      }
    )
  }

}
