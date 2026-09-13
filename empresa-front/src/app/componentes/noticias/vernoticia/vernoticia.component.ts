import { Component, OnInit } from '@angular/core';
import { Noticia } from 'src/app/Modelos/noticia';
import { NoticiasService } from 'src/app/services/noticias.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NoticiaImagen } from 'src/app/Modelos/noticia_img';
import { environment } from 'src/environments/environment';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-vernoticia',
  templateUrl: './vernoticia.component.html',
  styleUrls: ['./vernoticia.component.css']
})
export class VernoticiaComponent implements OnInit {

  noticia: Noticia = {}
  id_noticia: number = 0;
  noticiaImagenes: NoticiaImagen[] = [];
  ruta: string = environment.ruta_api;

  constructor(public noticiasService: NoticiasService, private rutaActiva: ActivatedRoute,public loginService: LoginService) { }

  ngOnInit(): void {
    this.id_noticia = this.rutaActiva.snapshot.params.id;
    this.getNoticiaById(this.id_noticia);
  }

  getImagenesNoticia(id_noticia: number) {
    this.noticiasService.getImagenesNoticia(id_noticia).subscribe(
      res => {
        this.noticiaImagenes = res;
      },
      err => console.error(err)
    );
  }
  
  getNoticiaById(id: number){
    this.noticiasService.getNoticiaById(id).subscribe(
      res => {
        this.noticia = res[0];
        //if(this.noticia.id_noticia != undefined)
        //this.getImagenesNoticia(this.noticia.id_noticia);
      },
      err => alert(err.error.message)
    )
  }

}
