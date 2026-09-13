import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
import { HerramientasPrendas } from '../Modelos/herramientas-prendas';
import { Elemento } from '../Modelos/elemento';

@Injectable({
  providedIn: 'root'
})
export class HerramientasPrendasService {

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

  URL_API = environment.ruta_api + "api/solicitudes/";

  constructor(public http: HttpClient, private loginService: LoginService) { }

  getSolicitudesByJefe(id_jefe:any){
    return this.http.get<HerramientasPrendas[]>(`${this.URL_API}jefe/${id_jefe}`, this.funcionToken(this.loginService.data.token))
  }

  getListadoHerramientasPrendas(){
    return this.http.get<Elemento[]>(`${this.URL_API}listado`, this.funcionToken(this.loginService.data.token))
  }

  realizarSolicitud(data:{}){
    return this.http.post(`${this.URL_API}`, data, this.funcionToken(this.loginService.data.token))
  }

  getSolicitudById(id_solicitud:any){
    return this.http.get<HerramientasPrendas[]>(`${this.URL_API}solicitudid/${id_solicitud}`, this.funcionToken(this.loginService.data.token))
  }

  getSolicitudesByEmpleado(id_empleado:any){
    return this.http.get<HerramientasPrendas[]>(`${this.URL_API}empleado/${id_empleado}`, this.funcionToken(this.loginService.data.token))
  }

  getSolicitudesByRRHH(){
    return this.http.get<HerramientasPrendas[]>(`${this.URL_API}`, this.funcionToken(this.loginService.data.token))
  }

  aprobarRRHH(id_solicitud: any){
    return this.http.put(`${this.URL_API}aprobar/${id_solicitud}`, {}, this.funcionToken(this.loginService.data.token))
  }

  denegar(data: {}){
    return this.http.put(`${this.URL_API}denegar`, data, this.funcionToken(this.loginService.data.token))
  }

  aprobarEmpleado(id_solicitud: any){
    return this.http.put(`${this.URL_API}recepcion/${id_solicitud}`, {}, this.funcionToken(this.loginService.data.token))
  }

  rechazar(data: {}){
    return this.http.put(`${this.URL_API}rechazo`, data, this.funcionToken(this.loginService.data.token))
  }

}
