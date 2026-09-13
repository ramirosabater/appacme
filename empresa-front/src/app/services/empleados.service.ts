import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Empleado } from '../Modelos/empleado';
import { environment } from 'src/environments/environment';
import { Sectores } from '../Modelos/sectores';
import { Posicion } from '../Modelos/posiciones';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {

  URL_API = environment.ruta_api + "api/";
  //URL_API = "http://190.105.238.248:3000/api/";

  constructor(public http: HttpClient, public loginService: LoginService) { }

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

  getEmpleadosById(id: number) {
    return this.http.get<Empleado[]>(`${this.URL_API}empleados/${id}`, this.funcionToken(this.loginService.data.token));
  }

  //sectores
  getSectores() {
    return this.http.get<Sectores[]>(`${this.URL_API}empleados/sectores/listado`, this.funcionToken(this.loginService.data.token));
  }

  //posiciones
  getPosiciones() {
    return this.http.get<Posicion[]>(`${this.URL_API}empleados/posiciones/listado`, this.funcionToken(this.loginService.data.token));
  }

  updateEmpleado(data: {}) {
    return this.http.post(`${this.URL_API}empleados/actualizar`, data, this.funcionToken(this.loginService.data.token));
  }

  getEmpleados(){
    return this.http.get<Empleado[]>(`${this.URL_API}empleados`,this.funcionToken(this.loginService.data.token))
  }

  getEmpleadosByJefe(id_jefe:any){
    return this.http.get<Empleado[]>(`${this.URL_API}empleados/jefedirecto/${id_jefe}`, this.funcionToken(this.loginService.data.token))
  }


}
