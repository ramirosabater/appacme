import { Component, OnInit } from '@angular/core';
import { Noticia } from 'src/app/Modelos/noticia';
import { LoginService } from 'src/app/services/login.service';
import { NoticiasService } from 'src/app/services/noticias.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-listadonoticias',
  templateUrl: './listadonoticias.component.html',
  styleUrls: ['./listadonoticias.component.css']
})
export class ListadonoticiasComponent implements OnInit {

  noticias: Noticia[] = [];
  url: string = environment.ruta_api;

  constructor(public noticiasService:NoticiasService, public loginService: LoginService) { }

  ngOnInit(): void {
    this.getNoticiasActivas();
  }

  getNoticiasActivas(){
    this.noticiasService.getNoticiasActivas().subscribe(
      res => {
        this.noticias = res;
      },
      err => alert(err.error.message)
    )
  }

}
