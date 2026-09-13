import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Ticket } from 'src/app/Modelos/tickets';
import { LoginService } from 'src/app/services/login.service';
import { SolicitudDineroService } from 'src/app/services/solicitud_dinero.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-tickets-solicitud',
  templateUrl: './tickets-solicitud.component.html',
  styleUrls: ['./tickets-solicitud.component.css']
})
export class TicketsSolicitudComponent implements OnInit {

  usuario:number = 0;
  id_solicitud:number= 0;
  tickets:Ticket[] = [];
  url: string = environment.ruta_api;
  loading: boolean = false;
  id_tipo_solicitud: number = 0;

  constructor(public loginService:LoginService, private router:Router, private activatedRoute:ActivatedRoute, public solicitudDineroService: SolicitudDineroService, private location:Location) { }

  ngOnInit(): void {
    this.id_solicitud = this.activatedRoute.snapshot.params.id;
    this.usuario = this.activatedRoute.snapshot.params.user;
    this.id_tipo_solicitud = this.activatedRoute.snapshot.params.tipo_solicitud;

    //(this.id_solicitud, this.usuario);
    this.getTicketsBySolicitud(this.id_solicitud);
  }

  presentarRendicion(){
    if(!confirm('Desea presentar la rendicion de esta solicitud')){
      return
    }

    //console.log(this.id_tipo_solicitud);

    if(this.id_tipo_solicitud != 4){
      this.loading = true;
      this.solicitudDineroService.presentarRendicion(this.id_solicitud).subscribe(
        res => {
          //console.log(res);
          alert('Rendicion enviada correctamente');
          this.location.back();
        },
        err => {
          alert('Ocurrio un error al enviar rendicion');
          this.loading = false;
        }
      )
    }
    else{
      this.loading = true;
      this.solicitudDineroService.enviarRendicionTarjeta(this.id_solicitud).subscribe(
        res => {
          //console.log(res);
          alert('Rendicion enviada correctamente');
          this.location.back();
        },
        err => {
          alert('Ocurrio un error al enviar rendicion');
          this.loading = false;
        }
      )
    }


  }

  cargarTicket(){
    this.router.navigate(['nuevo-ticket', this.id_solicitud])
  }

  getTicketsBySolicitud(id_solicitud:any){
    this.solicitudDineroService.getTicketsByIdSolicitud(id_solicitud).subscribe(
      res =>{
        //console.log(res);
        this.tickets = res;
      },
      err => {
        //console.log(err)
      }
    )
  }

  eliminarTicket(id_ticket: any){
    //console.log(id_ticket)
    if(confirm('Esta seguro de eliminar este ticket?')){
      this.solicitudDineroService.eliminarTicket(id_ticket).subscribe(
        res => {
          this.getTicketsBySolicitud(this.id_solicitud);
          alert('El ticket se elimino correctamente');
        },
        err => {
          alert('Error al eliminar ticket');
          //console.log(err)
        }
      )
    }
  }

}
