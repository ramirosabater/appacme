import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from 'src/app/Modelos/tickets';
import { LoginService } from 'src/app/services/login.service';
import { SolicitudDineroService } from 'src/app/services/solicitud_dinero.service';

@Component({
  selector: 'app-nuevo-ticket',
  templateUrl: './nuevo-ticket.component.html',
  styleUrls: ['./nuevo-ticket.component.css']
})
export class NuevoTicketComponent implements OnInit {

  loading:boolean=false
  ticket: Ticket = {
    fecha_ticket: '',
    proveedor: '',
    importe_sin_iva: '',
    nro_ticket: '',
    punto_venta: '',
    cuit: ''
  }
  file: any = null;
  id_solicitud: number = 0;

  constructor(public loginService:LoginService, public solicitudDineroService:SolicitudDineroService, private location:Location, private activatedRoute:ActivatedRoute) { }

  ngOnInit(): void {
    this.id_solicitud = this.activatedRoute.snapshot.params.id;
  }

  guardarTicket(form: NgForm){
    if (form.value.fecha_ticket == '' || form.value.proveedor == '' || form.value.importe_sin_iva == '' || form.value.nro_ticket == '' || form.value.punto_venta == '') {
      alert('Complete todos los campos');
      return;
    }

    if (this.file) {
      //validaciones del archivo
      if (this.file.size > 30000000) {
        alert('El archivo no puede ser mayor a 30 MB');
        return
      }

      if (this.file.type != "image/jpeg" && this.file.type != "image/png" && this.file.type != "image/gif" && this.file.type != "application/pdf") {
        alert('Solo se aceptan archivos con formato de imagen: p.ej. jpg, png, gif y pdf.');
        return
      }
    } else {
      alert('Debe adjuntar una foto del ticket');
      return
    }

    this.loading = true;

    var data = {
      fecha_ticket: form.value.fecha_ticket,
      proveedor: form.value.proveedor,
      importe_sin_iva:form.value.importe_sin_iva,
      punto_venta: form.value.punto_venta,
      nro_ticket: form.value.nro_ticket,
      cuit: form.value.cuit
    }
    //console.log(data);

    this.solicitudDineroService.subirTicket(data.nro_ticket, data.proveedor, data.importe_sin_iva, data.punto_venta, data.fecha_ticket, this.id_solicitud, data.cuit, this.file).subscribe(
      res=> {
        //console.log(res);
        alert('Ticket cargado con exito!');
        this.location.back();
      },
      err => {
        alert('Ocurrio un error al cargar el ticket')
        this.loading = false;
        //console.log(err)
      }
    )
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
    }
  }

}
