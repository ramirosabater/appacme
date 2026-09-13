import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/Modelos/empleado';
import { Rendicion } from 'src/app/Modelos/rendicion';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { ExcelService } from 'src/app/services/excel.service';
import { LoginService } from 'src/app/services/login.service';
import { SolicitudDineroService } from 'src/app/services/solicitud_dinero.service';

@Component({
  selector: 'app-descarga-rendiciones',
  templateUrl: './descarga-rendiciones.component.html',
  styleUrls: ['./descarga-rendiciones.component.css']
})
export class DescargaRendicionesComponent implements OnInit {

  rendiciones: Rendicion[] = [];
  empleados: Empleado[] = [];


  constructor(public loginService: LoginService, public excelService: ExcelService, public solicitudDineroService: SolicitudDineroService, public empleadosService: EmpleadosService) {
    //crea 10 rendiciones de prueba
  }

  ngOnInit(): void {
    this.getEmpleados();
  }

  exportar() {
    const fechaActual = new Date();
    const fechaFormateada = `${fechaActual.getFullYear()}-${(fechaActual.getMonth() + 1).toString().padStart(2, '0')}-${fechaActual.getDate().toString().padStart(2, '0')}`;

    const nombreArchivo = `Rendiciones_${fechaFormateada}`;
    this.exportToExcel(nombreArchivo, this.rendiciones);
  }

  exportToExcel(titulo: string, data: Rendicion[]) {
    this.excelService.exportToExcel(data, titulo, true);
  }

  filtrar(fecha_inicio: any, fecha_fin: any, empleado: any) {

    if (fecha_inicio.value == undefined || fecha_inicio.value == '' || fecha_inicio.value == null || fecha_fin.value == undefined || fecha_fin.value == undefined || fecha_fin.value == undefined || fecha_fin.value < fecha_inicio.value) {
      alert('Ingrese fechas validas');
      return
    }

    console.log(fecha_fin.value, fecha_inicio.value, empleado.value);

    var data = {
      fecha_inicio: fecha_inicio.value,
      fecha_fin: fecha_fin.value,
      id_empleado: empleado.value
    }

    console.log(data);

    this.solicitudDineroService.getTicketsUsuario(data).subscribe(
      res => {
        console.log(res);
        this.rendiciones = res;
        if (this.rendiciones == null) {
          this.rendiciones = [];
          alert('No se encontraron rendiciones');

        }
      },
      error => {
        console.log(error);
      }
    )
  }

  getEmpleados() {
    this.empleadosService.getEmpleados().subscribe(
      res => {
        this.empleados = res;
        console.log(this.empleados);
      },
      err => alert(err.error.message)
    );
  }

}
