import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Adjunto } from '../Modelos/adjuntos';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AdjuntosService {

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

  getAdjuntosByIdEmpleado(id_empleado: number) {
    return this.http.get<Adjunto[]>(`${this.URL_API}adjuntos/${id_empleado}`, this.funcionToken(this.loginService.data.token));
  }

  createAdjunto(id_empleado:any, id_tipo_adjunto: any, nombre_adjunto: any, file: any) {
    const fd = new FormData();
    fd.append('id_empleado', id_empleado);
    fd.append('id_tipo_adjunto', id_tipo_adjunto);
    fd.append('nombre_adjunto', nombre_adjunto);
    fd.append('file', file);
    return this.http.post(`${this.URL_API}adjuntos`, fd, this.funcionToken(this.loginService.data.token));
  }

  deleteAdjunto(id_adjunto: number) {
    return this.http.delete(`${this.URL_API}adjuntos/${id_adjunto}`, this.funcionToken(this.loginService.data.token));
  }

}
