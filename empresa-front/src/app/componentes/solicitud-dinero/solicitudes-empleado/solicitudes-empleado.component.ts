import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SolicitudDinero } from 'src/app/Modelos/solicitudesDinero';
import { tipoSolicitudDinero } from 'src/app/Modelos/tiposSolicitudesDinero';
import { LoginService } from 'src/app/services/login.service';
import { SolicitudDineroService } from 'src/app/services/solicitud_dinero.service';

@Component({
  selector: 'app-solicitudes-empleado',
  templateUrl: './solicitudes-empleado.component.html',
  styleUrls: ['./solicitudes-empleado.component.css']
})
export class SolicitudesEmpleadoComponent implements OnInit {

  solicitudes: SolicitudDinero[] = [];
  tiposSolicitudes: tipoSolicitudDinero[] = [];

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
    this.getTiposSolicitudes();
    this.getSolicitudesEmpleado(this.loginService.data.user.id_usuario);
  }

  getSolicitudesEmpleado(id_empleado:any){
    this.solicitudesDineroService.getSolicitudesDineroByEmpleado(id_empleado).subscribe(
      res => {
        this.solicitudes = res;

        this.solicitudes.forEach(solicitud => {
          if(solicitud.estado != undefined){
            this.estados.forEach(element => {
              if(element.valor == solicitud.estado){
                solicitud.estado_color = element.color
              }
            });
          }
        });
        //console.log(res)
      },
      err => {
        //console.log(err);
      }
    )
  }

  getTiposSolicitudes(){
    this.solicitudesDineroService.getCategoriasSolicitud().subscribe(
      res => {
        this.tiposSolicitudes = res;
      },
      err => {
        //console.log(err);
      }
    )
  }

  nuevaSolicitud(tipo:any){
    //console.log(tipo.value);
    if(tipo.value == 0){
      alert('Debe seleccionar un tipo de solicitud');
      return
    }
    
    this.router.navigate(['nueva-solicitud-dinero',tipo.value])
  }

}
