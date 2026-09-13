import { Component, OnInit } from '@angular/core';
import { Oportunidad } from 'src/app/modelos/Oportunidad';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  oportunidades: Oportunidad[] = [];
  oportunidadesFiltradas: Oportunidad[] = [];
  currentPage: number = 1;
  itemsPerPage: number = 5;
  searchTerm: string = ''; 
  selectedUbicacion: string = '';
  selectedArea: string = ''; 
  Math = Math; 
  loading: boolean = false;
  ubicaciones: string[] = [];
  areas: string[] = [];

  constructor(public api: ApiService) { }

  ngOnInit(): void {
    this.getOportunidades();
  }

  getOportunidades() {
    this.loading = true; // Start loading
    this.api.getOportunidades().subscribe(
      (data) => {
        this.oportunidades = data;
        this.llenarCombos();
        this.applyFilters();
        this.loading = false; // Stop loading
      },
      (error) => {
        console.error(error);
        this.loading = false; // Stop loading
      }
    );
  }

  llenarCombos() {
    // Extraer ubicaciones únicas
    this.ubicaciones = Array.from(new Set(this.oportunidades.map(o => o.ubicacion).filter((u): u is string => typeof u === 'string')));
    // Extraer áreas únicas
    this.areas = Array.from(new Set(this.oportunidades.map(o => o.area).filter((a): a is string => typeof a === 'string')));
  }

  applyFilters() {
    this.oportunidadesFiltradas = this.oportunidades.filter(oportunidad => {
      const matchesSearch = this.searchTerm
        ? oportunidad.titulo?.toLowerCase().includes(this.searchTerm.toLowerCase())
        : true;
      const matchesUbicacion = this.selectedUbicacion
        ? oportunidad.ubicacion === this.selectedUbicacion
        : true;
      const matchesArea = this.selectedArea
        ? oportunidad.area === this.selectedArea
        : true;
      return matchesSearch && matchesUbicacion && matchesArea;
    });
    this.currentPage = 1;
  }

  get paginatedOportunidades(): Oportunidad[] {
    const startIndex = 0;
    const endIndex = this.currentPage * this.itemsPerPage;
    return this.oportunidadesFiltradas.slice(startIndex, endIndex);
  }

  nextPage() {
    if (this.currentPage * this.itemsPerPage < this.oportunidadesFiltradas.length) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedUbicacion = '';
    this.selectedArea = '';
    this.applyFilters();
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
