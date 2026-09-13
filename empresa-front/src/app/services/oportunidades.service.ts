import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
import { Area, Carga_horaria, CategoriaTrabajo, Modalidad, Oportunidad, Ubicacion } from '../Modelos/oportunidad';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OportunidadesService {

  URL_API = environment.ruta_api + "api/";

  funcionToken(token: any) {
    var headers;
    if (token != undefined) {
      headers = new HttpHeaders({
        "authorization": token
      });
      //console.log("token: " + token);
    }

    const httpOptions = {
      headers: headers
    }

    return httpOptions;
  }

  constructor(public http: HttpClient, public loginService: LoginService) { }

  getOportunidades() {
    return this.http.get<Oportunidad[]>(`${this.URL_API}oportunidades`,
      this.funcionToken(this.loginService.data.token))
  }

  getOportunidadesById(id_empleo: {}) {
    return this.http.get<any>(`${this.URL_API}oportunidades/${id_empleo}`,
      this.funcionToken(this.loginService.data.token))
  }

  addRequisito(data: {}) {
    return this.http.post(`${this.URL_API}oportunidades/requisitos`, data,
      this.funcionToken(this.loginService.data.token));
  }

  addBeneficio(data: {}) {
    return this.http.post(`${this.URL_API}oportunidades/beneficios`, data,
      this.funcionToken(this.loginService.data.token));
  }



  eliminarRequisito(id_requisito: any) {
    return this.http.delete(`${this.URL_API}oportunidades/requisitos/${id_requisito}`,
      this.funcionToken(this.loginService.data.token));
  }

  eliminarBeneficio(id_requisito: any) {
    return this.http.delete(`${this.URL_API}oportunidades/beneficios/${id_requisito}`,
      this.funcionToken(this.loginService.data.token));
  }

  nuevaOportunidad(data: {}) {
    return this.http.post(`${this.URL_API}oportunidades`, data,
      this.funcionToken(this.loginService.data.token));
  }

  getPostulantesByIdEmpleo(id_empleo: {}) {
    return this.http.get<any>(`${this.URL_API}oportunidades/postulantes/${id_empleo}`,
      this.funcionToken(this.loginService.data.token))
  }

  getPostulantesGenerales() {
    return this.http.get<any>(`${this.URL_API}oportunidades/all-postulantes`,
      this.funcionToken(this.loginService.data.token))
  }

  updateOportunidad(id_oportunidad: any, data: {}) {
    return this.http.put(`${this.URL_API}oportunidades/${id_oportunidad}`, data,
      this.funcionToken(this.loginService.data.token));
  }


  getUbicaciones() {
    return this.http.get<Ubicacion[]>(`${this.URL_API}oportunidades/ubicaciones`,
      this.funcionToken(this.loginService.data.token))
  }

  getAreas() {
    return this.http.get<Area[]>(`${this.URL_API}oportunidades/areas`,
      this.funcionToken(this.loginService.data.token))
  }

  getModalidades() {
    return this.http.get<Modalidad[]>(`${this.URL_API}oportunidades/modalidad`,
      this.funcionToken(this.loginService.data.token))
  }

  getCargaHoraria() {
    return this.http.get<Carga_horaria[]>(`${this.URL_API}oportunidades/carga`,
      this.funcionToken(this.loginService.data.token))
  }


  //Scanear banco de cvs generales
  getBancoCvs(idCategoriaTrabajo?: string): Observable<string> {
    let url = `${this.URL_API}oportunidades/banco`;
    
    // Si hay categoría seleccionada, agregarla como query parameter
    if (idCategoriaTrabajo && idCategoriaTrabajo !== '') {
      url += `?id_categoria_trabajo=${idCategoriaTrabajo}`;
    }
    
    return this.http.get(url, {
      headers: this.funcionToken(this.loginService.data.token).headers,
      responseType: 'text' as 'text'
    });
  }

  desargarCvsById(id_oportunidad: any) {
    return this.http.get(`${this.URL_API}oportunidades/scan-pdfs/${id_oportunidad}`, {
      headers: this.funcionToken(this.loginService.data.token).headers,
      responseType: 'text' as 'text'
    });

  }


  getCategoriasTrabajo() {
    return this.http.get<CategoriaTrabajo[]>(`${this.URL_API}oportunidades/categorias-trabajo`,
      this.funcionToken(this.loginService.data.token))

  }

  getPostulantesPorCategoria(categoriaId: string): Observable<any[]> {
    return this.http.post<any[]>(`${this.URL_API}oportunidades/postulantes-categoria/${categoriaId}`,
      {},
      this.funcionToken(this.loginService.data.token));
  }


}
