import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Categoria } from 'src/app/Modelos/categoria';
import { Noticia } from 'src/app/Modelos/noticia';
import { NoticiasService } from 'src/app/services/noticias.service';
import { NgForm } from '@angular/forms';
import { Location } from '@angular/common';
import { NoticiaImagen } from 'src/app/Modelos/noticia_img';
import { LoginService } from 'src/app/services/login.service';
import { environment } from 'src/environments/environment';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-nuevanoticia',
  templateUrl: './nuevanoticia.component.html',
  styleUrls: ['./nuevanoticia.component.css']
})
export class NuevanoticiaComponent implements OnInit {

  noticia: Noticia = {
    id_noticia: 0,
    titulo: '',
    subtitulo: '',
    cuerpo_noticia: '',
    fecha_vencimiento: '',
    fecha_publicacion: '',
    url: '',
    id_categoria: 0,
    id_estado: 1
  }

  noticiaImagenes: NoticiaImagen[] = [];

  file: any;


  categorias: Categoria[] = [];

  isNew: number = 0;
  id_noticia: number = 0;

  filetype: number = 0;

  titulo: string = 'Nueva Noticia';
  boton: string = 'Dasactivar';

  ruta: string = environment.ruta_api;

  loading = false;

  imagenesAdicionales: boolean = false;

  isVencida: boolean = false;

  constructor(public noticiasService: NoticiasService, private rutaActiva: ActivatedRoute, private location: Location, public loginService: LoginService,
    private _snackBar: MatSnackBar) { }

  ngOnInit(): void {
    this.isNew = this.rutaActiva.snapshot.params.new;
    this.id_noticia = this.rutaActiva.snapshot.params.id;
    this.getCategorias();

    if (this.isNew == 1) {
      this.titulo = 'Editar Noticia';
      this.noticia.id_noticia = this.id_noticia;
      this.getNoticiaById(this.id_noticia);
      //this.getImagenesNoticia(this.id_noticia);
    }


  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  verificarFechaVencida(fechaString: string): boolean {
    // Convertir el string en formato de fecha
    const partesFecha = fechaString.split('-');
    const dia = Number(partesFecha[2]);
    const mes = Number(partesFecha[1]) - 1; // Restar 1 al mes porque los meses en JavaScript son base 0
    const anio = Number(partesFecha[0]);
    const fecha = new Date(anio, mes, dia);

    // Obtener la fecha actual
    const fechaActual = new Date();

    // Comparar las fechas
    if (fecha < fechaActual) {
      // La fecha está vencida
      return true;
    } else {
      // La fecha no está vencida
      return false;
    }
  }


  cambiarEstadoNoticia() {

    var data = {
      id_noticia: this.noticia.id_noticia
    }

    if (this.noticia.id_estado == 1) {
      if (!confirm('¿Está seguro de desactivar la noticia?')) {
        return;
      }
      this.noticiasService.bajaNoticia(data).subscribe(
        res => {
          this.openSnackBar('Se desactivo la noticia', 'cerrar');
          this.getNoticiaById(this.id_noticia);
        },
        err => {
          alert('Error al desactivar la noticia');
        }
      );
    } else {
      this.noticiasService.altaNoticia(data).subscribe(
        res => {
          this.openSnackBar('Se activo la licencia', 'cerrar');
          this.getNoticiaById(this.id_noticia);
        },
        err => {
          alert('Error al activar la noticia');
        }
      );
    }

  }


  guardarImagenPrincipal() {

    this.noticiasService.addImagenPrincipalNoticia(this.id_noticia, this.file).subscribe(
      res => {
        alert('Imagen guardada con éxito');
        this.getNoticiaById(this.id_noticia);
      },
      err => {
        alert('Error al guardar la imagen');
      }
    );
  }

  deleteImagenPrincipal(id_noticia: any) {

    if (!confirm('¿Está seguro de eliminar la imagen?')) {
      return;
    }

    var data = {
      id_noticia: id_noticia
    }

    this.noticiasService.deleteImagenPrincipalNoticia(data).subscribe(
      res => {
        alert('Imagen eliminada con éxito');
        this.getNoticiaById(this.id_noticia);
      },
      err => {
        alert('Error al eliminar la imagen');
      }
    );
  }


  guardarImagenNoticia() {

    this.filetype = 1;

    if (this.file.size > 30000000) {
      alert('El archivo no puede ser mayor a 30 MB');
      return
    }

    if (this.file.type != "image/jpeg" && this.file.type != "image/png" && this.file.type != "image/gif") {
      alert('Solo se aceptan archivos con formato de imagen: p.ej. jpg, png, gif, etc.');
      return
    }

    this.noticiasService.addImagenNoticia(this.noticia.id_noticia, this.file).subscribe(
      res => {
        alert('Imagen guardada con éxito');
        this.getImagenesNoticia(this.id_noticia);
      },
      err => {
        alert('Error al guardar la imagen');
      }
    );
  }

  eliminarImagenNoticia(id_img_not: any) {

    if (!confirm('¿Está seguro de eliminar la imagen?')) {
      return;
    }

    this.noticiasService.deleteImagenNoticia(id_img_not).subscribe(
      res => {
        alert('Imagen eliminada con éxito');
        this.getImagenesNoticia(this.id_noticia);
      },
      err => {
        alert('Error al eliminar la imagen');
      }
    );
  }


  getImagenesNoticia(id_noticia: number) {
    this.noticiasService.getImagenesNoticia(id_noticia).subscribe(
      res => {
        this.noticiaImagenes = res;
      },
      err => alert(err.error.message)
    );
  }

  onFileChange(event: any): void {
    if (event.target.files && event.target.files[0]) {
      this.file = <File>event.target.files[0];
    }
  }

  getNoticiaById(id_noticia: number) {
    this.noticiasService.getNoticiaById(id_noticia).subscribe(
      res => {
        this.noticia = res[0];
        //console.log(this.noticia);
        if (this.noticia.id_estado == 1) {
          this.boton = 'Desactivar';
        } else {
          this.boton = 'Activar';
        }
        if(this.noticia.fecha_vencimiento != undefined){
          this.isVencida = this.verificarFechaVencida(this.noticia.fecha_vencimiento);
        }
      },
      err => console.error(err)
    );

  }


  getCategorias() {
    this.noticiasService.getCategorias().subscribe(
      res => {
        this.categorias = res;
      },
      err => alert(err.error.message)
    );
  }

  guardarNoticia(form: NgForm) {
    //validar todos los campos

    if (this.noticia.titulo == '' || this.noticia.subtitulo == '' || this.noticia.cuerpo_noticia == '' || this.noticia.fecha_vencimiento == '' || this.noticia.id_categoria == 0) {
      alert('Debe completar todos los campos');
      return;
    }

    this.loading = true;

    if (this.isNew == 0) {
      if (this.file.size > 30000000) {
        alert('El archivo no puede ser mayor a 30 MB');
        return
      }

      if (this.file.type != "image/jpeg" && this.file.type != "image/png" && this.file.type != "image/gif") {
        alert('Solo se aceptan archivos con formato de imagen: p.ej. jpg, png, gif, etc.');
        return
      }
      this.noticiasService.createNoticia(this.noticia.titulo, this.noticia.subtitulo, this.noticia.cuerpo_noticia, this.noticia.fecha_vencimiento, this.noticia.fecha_publicacion, this.noticia.id_categoria, this.noticia.id_estado, this.file).subscribe(
        res => {
          this.openSnackBar('Noticia creada con exito', 'cerrar');
          this.location.back();
        },
        err => {
          alert('Error al crear la noticia');
          this.loading = false;
          console.error(err);
        }
      );
    } else {

      var data = {
        titulo: this.noticia.titulo,
        subtitulo: this.noticia.subtitulo,
        cuerpo_noticia: this.noticia.cuerpo_noticia,
        fecha_vencimiento: this.noticia.fecha_vencimiento,
        id_categoria: this.noticia.id_categoria,
        id_noticia: this.noticia.id_noticia
      }

      this.noticiasService.editNoticia(data).subscribe(
        res => {
          this.openSnackBar('Noticia editada con exito', 'cerrar');
          this.location.back();
        },
        err => {
          alert('Error al editar la noticia');
        }
      );
    }

  }

  cancelar() {
    if (confirm('¿Está seguro de cancelar?')) {
      this.location.back();
    }
  }

  //funcion que devuelve la fecha actual en formato dd/mm/yyyy
  getFechaActual() {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();

    var fechaActual = dia + '/' + mes + '/' + anio;

    return fechaActual;
  }

}
