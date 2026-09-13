import { Injectable } from '@angular/core';
import { User } from '../Modelos/user';
import { Rol } from '../Modelos/rol';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Permisos } from '../Modelos/permiso';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class UsersService {


  user: User = {
    nombre: "",
    password: ""
  }

  isLogued: boolean = false;
   //URL_API = "http://localhost:3000/api/";
  //URL_API = "http://ipdelaapi172.169.1.1:4000/api/";
  URL_API = environment.ruta_api + "api/";

  isAdminAdmin: boolean = false;

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

    //USERS
    getUser(user: User) {
      const isLogued = this.http.post<User[]>(`${this.URL_API}userLoginSU`, user);
      return isLogued;
  
    }

    getUserById(id: number) {
      return this.http.get<User[]>(`${this.URL_API}usuarios/${id}`, this.funcionToken(this.loginService.data.token));
    }

    getUsers() {
      return this.http.get<User[]>(`${this.URL_API}usuarios`, this.funcionToken(this.loginService.data.token));
    }

    altaUser(data:{}){
      return this.http.post(`${this.URL_API}usuarios/alta`, data, this.funcionToken(this.loginService.data.token));
    }

    editarUser(data:{}){
      return this.http.post(`${this.URL_API}usuarios/editarUser`, data, this.funcionToken(this.loginService.data.token));
    }

    bajaUser(data:{}){
      return this.http.post(`${this.URL_API}usuarios/bajaUser`, data, this.funcionToken(this.loginService.data.token));
    }

    resetPassword(data:{}){
      return this.http.post(`${this.URL_API}usuarios/resetPassword`, data, this.funcionToken(this.loginService.data.token));
    }

    //create user
    createUser(user: User) {
      return this.http.post<User>(`${this.URL_API}usuarios`, user, this.funcionToken(this.loginService.data.token));
    }

    //change password
    changePassword(data:{}){
      return this.http.post(`${this.URL_API}usuarios/changePassword`, data, this.funcionToken(this.loginService.data.token));
    }

    //ROLES
    getRoles() {
      return this.http.get<Rol[]>(`${this.URL_API}roles`, this.funcionToken(this.loginService.data.token));
    }

    addRolUsuario(data:{}){
      return this.http.post(`${this.URL_API}roles/add`, data, this.funcionToken(this.loginService.data.token));
    }

    getRolesByUser(id_usuario: number) {
      return this.http.get<Rol[]>(`${this.URL_API}roles/${id_usuario}`, this.funcionToken(this.loginService.data.token));
    }

    deleteRolUsuario(data:{}){
      return this.http.post(`${this.URL_API}roles/deleteRol`, data, this.funcionToken(this.loginService.data.token));
    }

    //PERMISOS
    getPermisos(id_usuario: number) {
      return this.http.get<Permisos[]>(`${this.URL_API}roles/permisos/${id_usuario}`, this.funcionToken(this.loginService.data.token));
    }

}
