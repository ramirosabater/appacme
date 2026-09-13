import { Component, OnInit } from '@angular/core';
import { Estado } from 'src/app/Modelos/estado';
import { HerramientasPrendas } from 'src/app/Modelos/herramientas-prendas';
import { HerramientasPrendasService } from 'src/app/services/herramientas-prendas.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-listado-lider',
  templateUrl: './listado-lider.component.html',
  styleUrls: ['./listado-lider.component.css']
})
export class ListadoLiderComponent implements OnInit {

  solicitudes: HerramientasPrendas[] = [];

  estados:Estado[] = [];

  constructor(public loginService: LoginService, public herramientasPrendasService: HerramientasPrendasService) { }

  ngOnInit(): void {
    this.scrollToTop();
    this.getListadoLider(this.loginService.data.user.id_usuario);

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

  getListadoLider(id_jefe: any) {
    this.herramientasPrendasService.getSolicitudesByJefe(id_jefe).subscribe(
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

        //console.log(this.solicitudes);

      },
      err => {
        //console.log(err)
      }
    )
  }

  scrollToTop() {
    window.scrollTo(0, 0);
  }

}
