import { Component, OnInit } from '@angular/core';
import { CategoriaTrabajo, Oportunidad } from 'src/app/Modelos/oportunidad';
import { Postulante } from 'src/app/Modelos/postulante';
import { LoginService } from 'src/app/services/login.service';
import { OportunidadesService } from 'src/app/services/oportunidades.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-lista-postulantes-generales',
  templateUrl: './lista-postulantes-generales.component.html',
  styleUrls: ['./lista-postulantes-generales.component.css']
})
export class ListaPostulantesGeneralesComponent implements OnInit {

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
    estado: '',
    categorias: [],
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
    beneficios: [],
    categoria: []
  };

  postulantes: Postulante[] = [];


  categoriaTrabajo: CategoriaTrabajo = {
    id_categoria_trabajo: 0,
    descripcion_categoria: ''
  }

  categorias: CategoriaTrabajo[] = [];

  id_empleo = 0;

  url: string = environment.ruta_api;

  categoriaSeleccionada: string = '';

  constructor(private oportunidadesService: OportunidadesService, public loginService: LoginService,
  ) { }

  ngOnInit(): void {
    this.getCategoriasTrabajo();
    this.getPostulantesGenerales();
  }



  getPostulantesGenerales() {
    this.oportunidadesService.getPostulantesGenerales().subscribe(
      res => {
        this.postulantes = res;
        console.log('Postulantes generales', res)

      },
      err => alert(err.error.message)
    );
  }

  descargarCvsGenerales() {
    // Pasar la categoría seleccionada (si existe) al servicio
    const categoriaId = this.categoriaSeleccionada && this.categoriaSeleccionada !== '' 
      ? this.categoriaSeleccionada 
      : undefined;
    
    this.oportunidadesService.getBancoCvs(categoriaId).subscribe({
      next: (data: string) => {
        // Crear un blob con el contenido de texto
        const blob = new Blob([data], { type: 'text/plain' });

        const fecha = new Date();
        const yyyy = fecha.getFullYear();
        const mm = String(fecha.getMonth() + 1).padStart(2, '0');
        const dd = String(fecha.getDate()).padStart(2, '0');
        
        // Nombre del archivo con categoría si está filtrado
        let nombreArchivo = `BancoCvs_${yyyy}-${mm}-${dd}.txt`;
        if (categoriaId) {
          const categoriaNombre = this.categorias.find(c => c.id_categoria_trabajo.toString() === categoriaId)?.descripcion_categoria || 'filtrado';
          nombreArchivo = `BancoCvs_${categoriaNombre.replace(/\s+/g, '_')}_${yyyy}-${mm}-${dd}.txt`;
        }

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
      error: (err) => {
        console.error('Error al descargar cvs', err);
        alert('Error al descargar los CVs. Por favor, intente nuevamente.');
      }
    });
  }

  getCategoriasTrabajo() {
    this.oportunidadesService.getCategoriasTrabajo().subscribe(
      res => {
        this.categorias = res;
      },
      err => alert(err.error.message)
    );
  }

  filtrarPostulantes() {
    if (!this.categoriaSeleccionada || this.categoriaSeleccionada === '') {
      // Si no hay categoría seleccionada, mostrar todos los postulantes
      this.getPostulantesGenerales();
    } else {
      // Filtrar por categoría
      this.oportunidadesService.getPostulantesPorCategoria(this.categoriaSeleccionada).subscribe({
        next: (data: any[]) => {
          this.postulantes = data;
        },
        error: (err) => {
          console.error('Error al filtrar postulantes:', err);
          alert('Error al filtrar postulantes por categoría');
        }
      });
    }
  }

  limpiarFiltro() {
    this.categoriaSeleccionada = '';
    this.getPostulantesGenerales();
  }

}
