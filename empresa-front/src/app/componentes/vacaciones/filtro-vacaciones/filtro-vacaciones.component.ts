import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Sectores } from 'src/app/Modelos/sectores';
import { Vacaciones } from 'src/app/Modelos/vacaciones';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { LoginService } from 'src/app/services/login.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';

@Component({
  selector: 'app-filtro-vacaciones',
  templateUrl: './filtro-vacaciones.component.html',
  styleUrls: ['./filtro-vacaciones.component.css']
})
export class FiltroVacacionesComponent implements OnInit {

  vacaciones: Vacaciones[] = [];
  sectores: Sectores[] = [];
  estados: any[] = [
    { estado: '0', descripcion: 'Pendiente' },
    { estado: '1', descripcion: 'Aprobado' },
    { estado: '2', descripcion: 'Rechazado' },
    { estado: '3', descripcion: 'Eliminado' },

  ];

  estadosVer = [{
    valor: 'pendiente',
    color: 'warning'
  },
  {
    valor: 'aprobada',
    color: 'success'
  },
  {
    valor: 'rechazada',
    color: 'danger'
  },
  {
    valor: 'eliminada',
    color: 'primary'
  }
  ];

  id_sector: number = 0;

  banderaListadoSolicitudes: boolean = false;

  @ViewChild('apellido', { static: false }) apellido!: ElementRef;
  @ViewChild('sector', { static: false }) sector!: ElementRef;
  @ViewChild('estado', { static: false }) estado!: ElementRef;

  constructor(
    public loginService: LoginService,
    public vacacionesService: VacacionesService,
    public empleadoService: EmpleadosService
  ) { }

  ngOnInit(): void {
    this.getSectores();
    this.getVacacionesBySector({ "sector": 0 })
  }

  filtrarVacaciones(apellido: any, sector: any, estado: any) {
    //console.log(estado.value)
    var apellidoMay: string = '';
    if (apellido != '')
      if (apellido.value != '' || apellido.value != undefined) {
        apellidoMay = apellido.value.toUpperCase();
        //console.log(apellidoMay)
      }
    if (this.banderaListadoSolicitudes) {
      var data = {
        apellido: apellidoMay,
        sector: sector.value,
        estado: estado.value
      }
      //console.log(data)
      this.vacacionesService.filtrarVacaciones(data).subscribe(
        res => {
          this.vacaciones = res;
          //console.log(res);
          this.vacaciones.forEach(vacacion => {
            if (vacacion.estado != undefined) {
              vacacion.estado_string = this.estadosVer[vacacion.estado].valor;
              vacacion.estado_color = this.estadosVer[vacacion.estado].color;
            }
          });
        },
        err => alert(err.error.message)
      )
    } else {
      var dataList = {
        apellido: apellido.value,
        sector: sector.value,
      }
      this.getVacacionesBySector(dataList)
    }


  }

  getSectores() {
    this.empleadoService.getSectores().subscribe(
      res => {
        this.sectores = res;
      },
      err => alert(err.error.message)
    )
  }

  limpiarFiltros() {
    // Restablecer los valores de los filtros
    if (this.apellido) {
      this.apellido.nativeElement.value = '';
    }
    if (this.sector) {
      this.sector.nativeElement.value = '0';
    }
    if (this.estado) {
      this.estado.nativeElement.value = '';
    }

    if (!this.banderaListadoSolicitudes) {
      this.getVacacionesBySector({ "sector": 0 })
    }

    // Realizar la búsqueda nuevamente sin filtros
    // this.filtrarVacaciones('','0','');
  }

  getVacacionesBySector(data: {}) {
    this.vacacionesService.vacacionesBySector(data).subscribe(
      res => {
        //console.log(res);
        this.vacaciones = res;
      },
      err => {
        alert("Ocurrio un error al realizar el filtrado")
      }
    )
  }

  cambiarFiltro(tipo: number) {
    if (tipo == 0) {
      this.banderaListadoSolicitudes = false;
      this.limpiarFiltros();
    } else {
      this.banderaListadoSolicitudes = true;
      this.vacaciones = [];
      this.limpiarFiltros();
    }

  }

}
