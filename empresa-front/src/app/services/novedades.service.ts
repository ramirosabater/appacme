import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
import { Novedad } from '../Modelos/novedades';


@Injectable({
  providedIn: 'root'
})
export class NovedadesService {

  URL_API = environment.ruta_api + "api/";

  constructor(public http: HttpClient, public loginService:LoginService) { }

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

  getNovedadesByEmpresa(id_empresa:any){
    return this.http.get<Novedad[]>(`${this.URL_API}novedades/${id_empresa}`, this.funcionToken(this.loginService.data.token))
  }

  createNovedad(data:{}){
    return this.http.post(`${this.URL_API}novedades`,data, this.funcionToken(this.loginService.data.token))
  }

  getNovedadesJefeDirecto(id_jefe:any){
    return this.http.get<Novedad[]>(`${this.URL_API}novedades/jefe/${id_jefe}`, this.funcionToken(this.loginService.data.token))
  }

  getNovedadesRecursosHumanos(){
    return this.http.get<Novedad[]>(`${this.URL_API}novedades/`, this.funcionToken(this.loginService.data.token))
  }
  
  bajaNovedad(data: {}){
    return this.http.post(`${this.URL_API}novedades/editar`,data, this.funcionToken(this.loginService.data.token))
  }

  getNovedadesToExcelRRHH(data:{}){
    return this.http.post<[]>(`${this.URL_API}novedades/descargar`,data,this.funcionToken(this.loginService.data.token))
  }

  getNovedadesToExcelJefe(data:{}){
    return this.http.post<[]>(`${this.URL_API}novedades/descargarjefe`,data,this.funcionToken(this.loginService.data.token))
  }

}
