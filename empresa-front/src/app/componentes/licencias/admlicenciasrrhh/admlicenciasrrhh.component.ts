import { Component, OnInit } from '@angular/core';
import { Licencia } from 'src/app/Modelos/licencia';
import { LicenciasService } from 'src/app/services/licencias.service';
import { LoginService } from 'src/app/services/login.service';

import { MatSnackBar } from '@angular/material/snack-bar';
import { ExcelService } from 'src/app/services/excel.service';
import { EmpresasService } from 'src/app/services/empresas.service';
import { Empresa } from 'src/app/Modelos/empresa';
import { DescargaLicencias } from 'src/app/Modelos/descargaLicencias';

@Component({
  selector: 'app-admlicenciasrrhh',
  templateUrl: './admlicenciasrrhh.component.html',
  styleUrls: ['./admlicenciasrrhh.component.css']
})
export class AdmlicenciasrrhhComponent implements OnInit {

  licencias: Licencia[] = [];

  estados = [{
    valor: 'pendiente',
    color: 'warning'
  },
  {
    valor: 'aprobado',
    color: 'success'
  },
  {
    valor: 'rechazado',
    color: 'danger'
  }
  ];

  jsonData = [
    { name: 'John', age: 30, city: 'New York' },
    { name: 'Jane', age: 25, city: 'Los Angeles' },
    { name: 'Bob', age: 35, city: 'Chicago' }
  ];

  descargaLicencias: DescargaLicencias[] = [];

  constructor(public licenciasService: LicenciasService, public loginService: LoginService,
    private _snackBar: MatSnackBar, private excelService: ExcelService, private empresasService: EmpresasService) { }

  ngOnInit(): void {
    this.getLicenciasRecursos();
    this.getEmpresas();
  }

  jsonDataExcel = [
    { fecha: '05/07/2023', cantidad: '0.0', empleado: '0.00' },
    { fecha: '15/07/2023', cantidad: '0.0', empleado: '0.00' },
    { fecha: '10/07/2023', cantidad: '0.0', empleado: '0.00' }
  ];

  jsonDatosParaExportar: DescargaLicencias[] = [];

  empresas: Empresa[] = [];

  exportToExcel(titulo: string, data: DescargaLicencias[]) {
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

    var data = {
      fecha_inicio: fecha_inicio.value,
      fecha_fin: fecha_fin.value,
      id_empresa: empresa.value
    }

    this.licenciasService.getLicenciasToExcel(data).subscribe(
      res => {

        this.jsonDatosParaExportar = res;
        //console.log(this.jsonDatosParaExportar)

        if (this.jsonDatosParaExportar != null) {
          
          this.jsonDatosParaExportar.forEach(data => {

            var formattedNumber: any = 0;

            if (data != undefined && data.cantidad_dias != undefined)
              formattedNumber = data.cantidad_dias.toFixed(2).replace('.', ',');

            var datoSeteado: DescargaLicencias = {
              fecha_creacion: data.fecha_creacion,
              n_legajo: data.n_legajo,
              codigo_licencia: data.codigo_licencia,
              cantidad_dias: formattedNumber,
              valor: '0,00'
            }

            this.descargaLicencias.push(datoSeteado);
            //console.log(this.descargaLicencias)

          });

          var nombre_archivo = 'AcmeDescargaLicencias';

          if (this.descargaLicencias.length > 0) {
            this.exportToExcel(nombre_archivo, this.descargaLicencias)
          }
        } else {
          alert('No hay licencias para descargar')
        }


      },
      err => {
        alert("Error al obtener datos para descarga")
      }
    )

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
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

  getLicenciasRecursos() {
    this.licenciasService.getLicenciasByRecursosHumanos().subscribe(
      res => {
        this.licencias = res;
        this.licencias.forEach(licencia => {
          if (licencia.estado != undefined) {
            licencia.estado_string = this.estados[licencia.estado].valor;
            licencia.estado_color = this.estados[licencia.estado].color;
          }
        });
      },
      err => alert(err.error.message)
    );
  }



}
