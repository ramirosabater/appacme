import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Noticia } from '../Modelos/noticia';
import { Categoria } from '../Modelos/categoria';
import { NoticiaImagen } from '../Modelos/noticia_img';
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class NoticiasService {

  //URL_API = "http://localhost:3000/api/";
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

  //USERS
  /*   getUser(user: User) {
      const isLogued = this.http.post<User[]>(`${this.URL_API}userLoginSU`, user);
      return isLogued;
    } */

  getCategorias() {
    return this.http.get<Categoria[]>(`${this.URL_API}news/categories`, this.funcionToken(this.loginService.data.token));
  }

  getNoticiaById(id: number) {
    return this.http.get<Noticia[]>(`${this.URL_API}news/newsByid/${id}`, this.funcionToken(this.loginService.data.token));
  }

  getNoticias() {
    return this.http.get<Noticia[]>(`${this.URL_API}news`, this.funcionToken(this.loginService.data.token));
  }

  getNoticiasActivas() {
    return this.http.get<Noticia[]>(`${this.URL_API}news/active`, this.funcionToken(this.loginService.data.token));
  }


  /*   createFile(id_qr: any, titulo: any, descripcion: any, file: File) {
      const fd = new FormData();
      fd.append('video', file);
      fd.append('id_qr', id_qr);
      fd.append('titulo', titulo);
      fd.append('descripcion', descripcion);
      return this.http.post(`${this.URL_API}videos`, fd, this.funcionToken());
    } */

  createNoticia(titulo: any, subtitulo: any, cuerpo_noticia: any, fecha_vencimiento: any, fecha_publicacion: any, id_categoria: any, id_estado: any, file: File) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('titulo', titulo);
    fd.append('subtitulo', subtitulo);
    fd.append('cuerpo_noticia', cuerpo_noticia);
    fd.append('fecha_vencimiento', fecha_vencimiento);
    fd.append('fecha_publicacion', fecha_publicacion);
    fd.append('id_categoria', id_categoria);
    fd.append('id_estado', id_estado);
    return this.http.post(`${this.URL_API}news`, fd, this.funcionToken(this.loginService.data.token));
  }

  //editar noticia: titulo, subtitulo, cuerpo_noticia, id_categoria, fecha_vencimiento, id_noticia --> data{}
  editNoticia(data: {}) {
    return this.http.post(`${this.URL_API}news/edit`, data, this.funcionToken(this.loginService.data.token));
  }

  //get imagenes noticia
  getImagenesNoticia(id_noticia: number) {
    return this.http.get<NoticiaImagen[]>(`${this.URL_API}news/imgnews/${id_noticia}`, this.funcionToken(this.loginService.data.token));
  }

  //agregar imagen noticia
  addImagenNoticia(id_noticia: any, file: File) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('id_noticia', id_noticia);
    return this.http.post(`${this.URL_API}news/imgnews`, fd, this.funcionToken(this.loginService.data.token));
  }

  //eliminar imagen noticia
  deleteImagenNoticia(id_img_not: any) {
    return this.http.delete(`${this.URL_API}news/imgnews/${id_img_not}`, this.funcionToken(this.loginService.data.token));
  }

  //eliminar imagen principal noticia
  deleteImagenPrincipalNoticia(data: {}) {
    return this.http.post(`${this.URL_API}news/deleteimgnews`,data, this.funcionToken(this.loginService.data.token));
  }

  //agregar imagen principal noticia
  addImagenPrincipalNoticia(id_noticia: any, file: File) {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('id_noticia', id_noticia);
    return this.http.post(`${this.URL_API}news/imgnews`, fd, this.funcionToken(this.loginService.data.token));
  }

  //alta noticia
  altaNoticia(data: {}) {
    return this.http.post(`${this.URL_API}news/alta`, data, this.funcionToken(this.loginService.data.token));
  }

  //baja noticia
  bajaNoticia(data: {}) {
    return this.http.post(`${this.URL_API}news/baja`, data, this.funcionToken(this.loginService.data.token));
  }


}
