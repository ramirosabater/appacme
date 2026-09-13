import { Component, OnInit } from '@angular/core';
import { Empresa } from 'src/app/Modelos/empresa';
import { Novedad } from 'src/app/Modelos/novedades';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { ExcelService } from 'src/app/services/excel.service';
import { LoginService } from 'src/app/services/login.service';
import { NovedadesService } from 'src/app/services/novedades.service';

@Component({
  selector: 'app-novedades-rrhh',
  templateUrl: './novedades-rrhh.component.html',
  styleUrls: ['./novedades-rrhh.component.css']
})
export class NovedadesRrhhComponent implements OnInit {

  novedades: Novedad[] = [];
  listadoNovedades: Novedad[] = [];
  empresas: Empresa[] = [];

  novedadesDescarga: Novedad[] = [];
  jsonparadescarga: Novedad[] = []

  constructor(public loginService: LoginService, public empleadosService: EmpleadosService, public novedadesService: NovedadesService, public empresasService: EmpresasService, private excelService: ExcelService) { }

  ngOnInit(): void {
    this.getNovedadesRecursosHumanos();
    this.getEmpresas();
  }

  getNovedadesRecursosHumanos() {
    this.novedadesService.getNovedadesRecursosHumanos().subscribe(
      res => {
        this.listadoNovedades = res;
        //console.log(res)
      },
      err => {
        alert('Error al cargar listado de Novedades')
      }
    )
  }

  exportToExcel(titulo: string, data: Novedad[]) {
    this.excelService.exportToExcel(data, titulo, true);
  }

  exportar(fecha_inicio: any, fecha_fin: any, empresa: any) {
    //console.log(fecha_inicio, fecha_fin, empresa.value);

    if (fecha_inicio.value == undefined || fecha_inicio.value == '' || fecha_inicio.value == null || fecha_fin.value == undefined || fecha_fin.value == undefined || fecha_fin.value == undefined || fecha_fin.value < fecha_inicio.value) {
      alert('Ingrese fechas validas');
      return
    }

    if (empresa.value == 0 || empresa.value == undefined) {
      alert('Debe seleccionar una empresa.')
      return
    }

     this.jsonparadescarga = [];
     this.novedadesDescarga = []

    var data = {
      fecha_inicio: fecha_inicio.value,
      fecha_fin: fecha_fin.value,
      id_empresa: empresa.value
    }

    this.novedadesService.getNovedadesToExcelRRHH(data).subscribe(
      res => {

        this.novedadesDescarga = res;
        //console.log(this.novedadesDescarga)

        if (this.novedadesDescarga != null) {

          this.novedadesDescarga.forEach(data => {

            var formattedNumber: any = '';

            if (data != undefined && data.cantidad != undefined){
               formattedNumber = data.cantidad.toString().replace('.', ',');
            }
             

            var datoSeteado: Novedad = {
              fecha_creacion: data.fecha_creacion,
              n_legajo: data.n_legajo,
              codigo: data.codigo,
              cantidad: formattedNumber,
              valor: '0,00'
            }

            this.jsonparadescarga.push(datoSeteado);
          });

          var nombre_archivo = 'AcmeDescargaNovedades';
          if (this.novedadesDescarga.length > 0) {
            this.exportToExcel(nombre_archivo, this.jsonparadescarga);
          }
        } else {
          alert('No hay novedades para descargar')
        }


      },
      err => {
        alert("Error al obtener datos para descarga")
      }
    )

  }

  getEmpresas() {
    this.empresasService.getEmpresas().subscribe(
      res => {
        this.empresas = res;
      },
      err => {
        alert("Error al obtener empresas");
      }
    )
  }

}
