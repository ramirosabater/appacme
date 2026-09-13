import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudDinero } from 'src/app/Modelos/solicitudesDinero';
import { tipoSolicitudDinero } from 'src/app/Modelos/tiposSolicitudesDinero';
import { LoginService } from 'src/app/services/login.service';
import { SolicitudDineroService } from 'src/app/services/solicitud_dinero.service';

@Component({
  selector: 'app-solicitudes-dinero-rrhh',
  templateUrl: './solicitudes-dinero-rrhh.component.html',
  styleUrls: ['./solicitudes-dinero-rrhh.component.css']
})
export class SolicitudesDineroRrhhComponent implements OnInit {

  solicitudes: SolicitudDinero[] = [];

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

  constructor(public loginService:LoginService, private router:Router, public solicitudesDineroService:SolicitudDineroService) { }

  ngOnInit(): void {
    this.getSolicitudes();
  }

  getSolicitudes(){
    this.solicitudesDineroService.getSolicitudesDineroRRHH().subscribe(
      res => {
        this.solicitudes = res;
        //console.log(res);
        this.solicitudes.forEach(solicitud => {
          if(solicitud.estado != undefined){
            this.estados.forEach(element => {
              if(element.valor == solicitud.estado){
                solicitud.estado_color = element.color
              }
            });
          }
        });
      },
      err => {
        //console.log(err);
      }
    )
  }

}
