import { Component, OnInit } from '@angular/core';
import { Noticia } from 'src/app/Modelos/noticia';
import { LoginService } from 'src/app/services/login.service';
import { NoticiasService } from 'src/app/services/noticias.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-adminnoticias',
  templateUrl: './adminnoticias.component.html',
  styleUrls: ['./adminnoticias.component.css']
})
export class AdminnoticiasComponent implements OnInit {

  url: string = environment.ruta_api;

  noticias: Noticia[] = [];
  estados = [
    {
      valor: 'desactivada',
      color: 'danger'
    },
    {
      valor: 'activa',
      color: 'success'
    },
    {
      valor: 'vencida',
      color: 'warning'
    }
  ];

  constructor(public noticiasSerice: NoticiasService, public loginService: LoginService) { }

  ngOnInit(): void {
    this.getNoticias();
  }

  verificarFechaVencida(fechaString: string): boolean {
    // Convertir el string en formato de fecha
    const partesFecha = fechaString.split('/');
    const dia = Number(partesFecha[0]);
    const mes = Number(partesFecha[1]) - 1; // Restar 1 al mes porque los meses en JavaScript son base 0
    const anio = Number(partesFecha[2]);
    const fecha = new Date(anio, mes, dia);

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Comparar las fechas
    if (fecha < fechaActual) {
      // La fecha está vencida
      return true;
    } else {
      // La fecha no está vencida
      return false;
    }
  }

  getNoticias() {
    this.noticiasSerice.getNoticias().subscribe(
      res => {
        this.noticias = res;
        //console.log(this.noticias);
        this.noticias.forEach(noticia => {
          if (noticia.id_estado != undefined) {
            noticia.estado_string = this.estados[noticia.id_estado].valor;
            noticia.estado_color = this.estados[noticia.id_estado].color;
            //convertir la fecha de vencimiento en formato fecha y compararla con la fecha actual, si es menor a la fecha actual, cambiar el estado a vencida
            if(noticia.fecha_vencimiento != undefined){
              if(this.verificarFechaVencida(noticia.fecha_vencimiento)){
                noticia.id_estado = 2;
                noticia.estado_string = 'vencida';
                noticia.estado_color = 'warning';
              }
            }
          }
        });
      },
      err => alert(err.error.message)
    )
  }

}
