import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Data } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  URL_API = environment.ruta_api + "api/";
  //URL_API = "http://190.105.238.248:3000/api/";
  
  data: Data = {};
  isLogued: boolean = false;

  login(user: {}) {
    return this.http.post<Data>(`${this.URL_API}login`, user);
  }

}

