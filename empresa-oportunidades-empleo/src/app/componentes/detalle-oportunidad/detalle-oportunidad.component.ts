import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Beneficio, Oportunidad, Requisito } from 'src/app/modelos/Oportunidad';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-detalle-oportunidad',
  templateUrl: './detalle-oportunidad.component.html',
  styleUrls: ['./detalle-oportunidad.component.css']
})
export class DetalleOportunidadComponent implements OnInit {

  id_oportunidad: string = '';
  oportunidad: Oportunidad | null = {}; // Allow null values
  beneficios: Beneficio[] = [];
  requisitos: Requisito[] = [];
  loading: boolean = true;

  constructor(public rutaActiva: ActivatedRoute, public apiService:ApiService, private location:Location) { }

  ngOnInit(): void {
    this.id_oportunidad = this.rutaActiva.snapshot.params.id;
    this.getOportunidad(this.id_oportunidad);
  }

  getOportunidad(id: string) {
    this.loading = true;
    this.apiService.getOportunidad(id).subscribe(
      (res) => {
        this.oportunidad = res;
        this.apiService.oportunidad = res;
        this.requisitos = res.requisitos || [];
        this.beneficios = res.beneficios || [];
        this.loading = false;
      },
      (err) => {
        this.oportunidad = null; // Set oportunidad to null on error
        this.loading = false;
      }
    );
  }

  atras() {
    this.location.back();
  }

  getFechaFormateada(): string {
    if (!this.oportunidad || !this.oportunidad.fecha_publicacion) return '';
    const fecha = new Date(this.oportunidad.fecha_publicacion);
    return fecha.toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric' });
  }

  timeAgo(fecha: Date | string | undefined): string {
    if (!fecha) return '';
    let then: Date;
    if (fecha instanceof Date) {
      then = fecha;
    } else {
      then = new Date(fecha);
    }
    const now = new Date();
    const seconds = Math.floor((now.getTime() - then.getTime()) / 1000);
    if (seconds < 60) return 'hace unos segundos';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `hace ${hours} hora${hours > 1 ? 's' : ''}`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `hace ${days} día${days > 1 ? 's' : ''}`;
    const months = Math.floor(days / 30);
    if (months < 12) return `hace ${months} mes${months > 1 ? 'es' : ''}`;
    const years = Math.floor(months / 12);
    return `hace ${years} año${years > 1 ? 's' : ''}`;
  }

}
