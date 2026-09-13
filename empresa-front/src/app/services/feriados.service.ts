import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Feriado } from '../Modelos/feriado';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class FeriadosService {

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


 // URL_API = "http://localhost:3000/api/";
  URL_API = environment.ruta_api + "api/";


  constructor(public http: HttpClient, private loginService: LoginService) { }

  getFeriados() {
    return this.http.get<Feriado[]>(`${this.URL_API}feriados`, this.funcionToken(this.loginService.data.token));
  }

  createFeriado(feriado: Feriado) {
    return this.http.post(`${this.URL_API}feriados`, feriado, this.funcionToken(this.loginService.data.token));
  }

  getProximoFeriado() {
    return this.http.get<Feriado[]>(`${this.URL_API}feriados/proximo`, this.funcionToken(this.loginService.data.token));
  }


}
