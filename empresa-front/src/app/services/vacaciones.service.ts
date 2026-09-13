import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Vacaciones } from '../Modelos/vacaciones';
import { Sectores } from '../Modelos/sectores';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class VacacionesService {

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

  //URL_API = "http://localhost:3000/api/";
  URL_API = environment.ruta_api + "api/";

  getVacacionesByIdEmpleado(id: number) {
    return this.http.get<Vacaciones[]>(`${this.URL_API}vacaciones/empleado/${id}`, this.funcionToken(this.loginService.data.token));
  }

  //get vacaciones by jefe_directo
  getVacacionesByJefeDirecto(id: number) {
    return this.http.get<Vacaciones[]>(`${this.URL_API}vacaciones/jefe/${id}`, this.funcionToken(this.loginService.data.token));
  }

  //get vacaciones by id_vacaciones
  getVacacionesByIdVacaciones(id: number) {
    return this.http.get<Vacaciones[]>(`${this.URL_API}vacaciones/${id}`, this.funcionToken(this.loginService.data.token));
  }

  //create vacaciones
  createVacaciones(data: {}) {
    return this.http.post(`${this.URL_API}vacaciones`, data, this.funcionToken(this.loginService.data.token));
  }

  //revisar vacaciones
  revisarVacaciones(data: {}) {
    return this.http.post(`${this.URL_API}vacaciones/revisionJefe`, data, this.funcionToken(this.loginService.data.token));
  }

  //vacaciones filtros
  filtrarVacaciones(data: {}) {
    return this.http.post<Vacaciones[]>(`${this.URL_API}vacaciones/filtro`, data, this.funcionToken(this.loginService.data.token));
  }

  //vacacionesBySector
  vacacionesBySector(data: {}){
    return this.http.post<Vacaciones[]>(`${this.URL_API}vacaciones/bysector`, data)
  }

  //eliminar vacaciones
  eliminarVacaciones(data:{}){
    return this.http.post(`${this.URL_API}vacaciones/eliminar`, data, this.funcionToken(this.loginService.data.token))
  }

}
