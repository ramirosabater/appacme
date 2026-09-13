import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
import { Empresa } from '../Modelos/empresa';

@Injectable({
  providedIn: 'root'
})
export class EmpresasService {

  constructor(public http: HttpClient, public loginService:LoginService) { }

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

  getEmpresas(){
    return this.http.get<Empresa[]>(`${this.URL_API}empresas`, this.funcionToken(this.loginService.data.token));

  }

}
