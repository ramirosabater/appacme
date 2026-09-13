import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Oportunidad, Ubicacion } from '../modelos/Oportunidad';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(public http: HttpClient) { }

  oportunidad: Oportunidad = {};

  getOportunidades() {
    return this.http.get<Oportunidad[]>(`${this.apiUrl}/api/oportunidades/activas`);
  }

  getOportunidad(id: string) {
    return this.http.get<Oportunidad>(`${this.apiUrl}/api/oportunidades/${id}`);
  }



  postPostulacion(id_empleo: any, nombre: any, apellido: any, email: any, telefono: any,
    tipo_documento: any, nro_documento: any, genero: any, id_provincia: any, localidad: any,
    fecha_postulacion: any, curriculum_vitae: any, estado: any, puestos_interes?: any, recaptchaToken?: any) {

    const fd = new FormData();
    fd.append('id_empleo', id_empleo);
    fd.append('nombre', nombre);
    fd.append('apellido', apellido);
    fd.append('email', email);
    fd.append('telefono', telefono);
    fd.append('tipo_documento', tipo_documento);
    fd.append('nro_documento', nro_documento);
    fd.append('genero', genero);
    fd.append('id_provincia', id_provincia);
    fd.append('localidad', localidad);
    fd.append('fecha_postulacion', fecha_postulacion);
    fd.append('file', curriculum_vitae);
    fd.append('estado', estado);
    fd.append('recaptchaToken', recaptchaToken || '');
    
    // Agregar puestos de interés como JSON string
    if (puestos_interes !== undefined) {
      fd.append('puestos_interes', JSON.stringify(puestos_interes));
    } else {
      fd.append('puestos_interes', JSON.stringify([]));
    }

    return this.http.post(`${this.apiUrl}/api/oportunidadesEmpleo/postulantes`, fd);
  }

  getUbicaciones() {
    return this.http.get<Ubicacion[]>(`${this.apiUrl}/api/oportunidades/ubicaciones`,
    )
  }

  getCategoriasTrabajo() {
    return this.http.get<{id_categoria_trabajo: number, descripcion_categoria: string}[]>(`${this.apiUrl}/api/oportunidadesEmpleo/categorias-trabajo`);
  }

}
