import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Domicilio } from '../Modelos/domicilios';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class DomiciliosService {

  URL_API = environment.ruta_api + "api/";

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

  getDomiciliosByIdUsuario(id_usuario: number) {
    return this.http.get<Domicilio[]>(`${this.URL_API}direcciones/${id_usuario}`, this.funcionToken(this.loginService.data.token));
  }

  createDomicilio(calle:any, numero:any, localidad:any, provincia:any, tipo_direccion:any,observaciones:any, file:any, user: any) {
    const fd = new FormData();
    fd.append('calle', calle);
    fd.append('numero', numero);
    fd.append('localidad', localidad);
    fd.append('provincia', provincia);
    fd.append('tipo_direccion', tipo_direccion);
    fd.append('observaciones', observaciones);
    fd.append('file', file);
    fd.append('id_usuario', user);
    return this.http.post(`${this.URL_API}direcciones`, fd, this.funcionToken(this.loginService.data.token));
  }

  bajaDomicilio(data: any) {
    return this.http.post(`${this.URL_API}direcciones/baja`, data, this.funcionToken(this.loginService.data.token));
  }
}
