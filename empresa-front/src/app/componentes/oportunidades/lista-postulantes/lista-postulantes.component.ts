import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CategoriaTrabajo, Oportunidad } from 'src/app/Modelos/oportunidad';
import { Postulante } from 'src/app/Modelos/postulante';
import { LoginService } from 'src/app/services/login.service';
import { OportunidadesService } from 'src/app/services/oportunidades.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-postulantes',
  templateUrl: './lista-postulantes.component.html',
  styleUrls: ['./lista-postulantes.component.css']
})
export class ListaPostulantesComponent implements OnInit {

  postulante: Postulante = {
    id_postulante: 0,
    id_provincia: 0,
    id_empleo: 0,
    nombre: '',
    apellido: '',
    email: '',
    tipo_documento: '',
    nro_documento: '',
    telefono: '',
    genero: '',
    localidad: '',
    fecha_postulacion: '',
    curriculum_vitae: '',
    estado: ''
  };

  titulo = '';

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
    estado_color: '',
    carga_horaria: '',
    modalidad: '',
    ubicacion: '',
    area: '',
    requisitos: [],
    beneficios: []
  };

  postulantes: Postulante[] = [];

  id_empleo = 0;

  url: string = environment.ruta_api;

  constructor(private oportunidadesService: OportunidadesService, public loginService: LoginService,
    private rutaActiva: ActivatedRoute) { }

  ngOnInit(): void {
    this.id_empleo = this.rutaActiva.snapshot.params.id_empleo;
    this.getPostulantesByIdEmpleo(this.id_empleo);
    this.getOportunidadById(this.id_empleo);
  }

  getPostulantesByIdEmpleo(id_empleo: any) {
    this.oportunidadesService.getPostulantesByIdEmpleo(id_empleo).subscribe(
      res => {
        this.postulantes = res;
        console.log('Postulantes by id_empleo:', res);

      },
      err => alert(err.error.message)
    );
  }

  getOportunidadById(id_empleo: any) {
    this.oportunidadesService.getOportunidadesById(id_empleo).subscribe(
      res => {
        this.oportunidad = res;
        //console.log('OportunidadById:', res);

      },
      err => alert(err.error.message)
    );
  }

  descargarTodosLosCVs() {
    this.oportunidadesService.desargarCvsById(this.id_empleo).subscribe({
      next: (data: string) => {
        // Crear un blob con el contenido de texto
        const blob = new Blob([data], { type: 'text/plain' });

        const fecha = new Date();
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, '0');
        const dd = String(fecha.getDate()).padStart(2, '0');
        const nombreArchivo = `Cvs de oportunidad ${this.id_empleo}_${yyyy}-${mm}-${dd}.txt`;

        // Crear un enlace temporal
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;

        // Nombre del archivo
        a.download = nombreArchivo;

        // Simular clic
        a.click();

        // Liberar URL de memoria
        window.URL.revokeObjectURL(url);
      },
      error: (err) => console.error('Error al descargar cvs', err)
    });
  }


}
