import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { TipoLicencia } from '../Modelos/tipo_licencia';
import { Licencia } from '../Modelos/licencia';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class LicenciasService {

  //URL_API = "http://localhost:3000/api/";
  URL_API = environment.ruta_api + "api/";

  constructor(
    public http: HttpClient, public loginService: LoginService
  ) { }

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

  getTipoLicencias() {
    return this.http.get<TipoLicencia[]>(`${this.URL_API}licencias/tipo`, this.funcionToken(this.loginService.data.token));
  }

  createLicencia(data:{}){
    return this.http.post<Licencia[]>(`${this.URL_API}licencias`, data, this.funcionToken(this.loginService.data.token));
  }


  adjuntarArchivoLicencia(id_licencia: any, adjunto: any) {
    const fd = new FormData();
    fd.append('file', adjunto);
    fd.append('id_licencia', id_licencia);
    return this.http.post(`${this.URL_API}licencias/adjunto`, fd, this.funcionToken(this.loginService.data.token));
  }

  getLicenciasByEmpleado(id_empleado: any) {
    return this.http.get<Licencia[]>(`${this.URL_API}licencias/empleado/${id_empleado}`, this.funcionToken(this.loginService.data.token));
  }

  getLicenciaById(id_licencia: any) {
    return this.http.get<Licencia[]>(`${this.URL_API}licencias/${id_licencia}`, this.funcionToken(this.loginService.data.token));
  }

  getLicenciasByIdJefe(jefe_directo: any) {
    return this.http.get<Licencia[]>(`${this.URL_API}licencias/jefe/${jefe_directo}`, this.funcionToken(this.loginService.data.token));
  }

  revisarLicenciaJefe(data:{}){
    return this.http.post(`${this.URL_API}licencias/revisionjefe`, data, this.funcionToken(this.loginService.data.token));
  }

  rechazarLicenciaJefe(data:{}){
    return this.http.post(`${this.URL_API}licencias/rechazarjefe`, data, this.funcionToken(this.loginService.data.token));
  }

  getLicenciasByRecursosHumanos() {
    return this.http.get<Licencia[]>(`${this.URL_API}licencias/recursos`, this.funcionToken(this.loginService.data.token));
  }

  revisarLicenciaRecursos(data:{}){
    return this.http.post(`${this.URL_API}licencias/revisionrecursos`, data, this.funcionToken(this.loginService.data.token));
  }

  rechazarLicenciaRecursos(data:{}){
    return this.http.post(`${this.URL_API}licencias/rechazarrecursos`, data, this.funcionToken(this.loginService.data.token));
  }

  getTiposLicenciaByEmpresa(empresa:number){
    return this.http.get<TipoLicencia[]>(`${this.URL_API}licencias/tl/${empresa}`, this.funcionToken(this.loginService.data.token))
  }

  getLicenciasToExcel(data:{}){
    return this.http.post<[]>(`${this.URL_API}licencias/descargas`,data,this.funcionToken(this.loginService.data.token))
  }

}
