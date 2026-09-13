import { Component, OnInit } from '@angular/core';
import { Oportunidad } from 'src/app/Modelos/oportunidad';
import { LoginService } from 'src/app/services/login.service';
import { OportunidadesService } from 'src/app/services/oportunidades.service';


@Component({
  selector: 'app-oportunidades',
  templateUrl: './oportunidades.component.html',
  styleUrls: ['./oportunidades.component.css']
})
export class OportunidadesComponent implements OnInit {

  oportunidades: Oportunidad[] = [];
  oportunidad: Oportunidad = {
    id_empleo: 0,
    fecha_creacion: '',
    fecha_publicacion: '',
    fecha_fin_publicacion: '',
    titulo: '',
    descripcion: '',
    id_carga_horaria: 0,
    id_modalidad: 0,
    id_ubicacion: 0,
    id_area: 0,
    estado: '',
    estado_color:'',
    carga_horaria: '',
    modalidad: '',
    ubicacion: '',
    area: '',
    requisitos: [],
    beneficios: []
  };

  
  estados = [{
    valor: 'borrador',
    color: 'warning'
  },
  {
    valor: 'activo',
    color: 'success'
  },
  {
    valor: 'finalizado',
    color: 'danger'
  }
  ];

 


  constructor(private oportunidadesService: OportunidadesService, public loginService: LoginService) { }

  ngOnInit(): void {
    this.getOportunidades();
   
  }

  getOportunidades() {
    this.oportunidadesService.getOportunidades().subscribe(
      res => {
        this.oportunidades = res;
      },
      err => {
        alert('Error al cargar listado de Novedades')
      }
    )
  }


  getColorEstado(estado: string): string {
    const estadoEncontrado = this.estados.find(e => e.valor === estado.toLowerCase());
    return estadoEncontrado ? estadoEncontrado.color : 'secondary'; 
  }


}
