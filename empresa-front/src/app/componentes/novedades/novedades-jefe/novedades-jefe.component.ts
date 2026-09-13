import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/Modelos/empleado';
import { Novedad } from 'src/app/Modelos/novedades';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { ExcelService } from 'src/app/services/excel.service';
import { LoginService } from 'src/app/services/login.service';
import { NovedadesService } from 'src/app/services/novedades.service';

@Component({
  selector: 'app-novedades-jefe',
  templateUrl: './novedades-jefe.component.html',
  styleUrls: ['./novedades-jefe.component.css']
})
export class NovedadesJefeComponent implements OnInit {

  empleados:Empleado[] = [];
  empleado:Empleado={};
  novedades:Novedad[]=[];
  listadoNovedades:Novedad[]=[];

  novedadesDescarga: Novedad[] = [];
  jsonparadescarga: Novedad[] = []

  constructor(public loginService:LoginService, public empleadosService:EmpleadosService, public novedadesService:NovedadesService, public excelService: ExcelService) { }

  ngOnInit(): void {
    this.getEmpleadosByJefe(this.loginService.data.user.id_usuario)
    this.getEmpleadoById(this.loginService.data.user.id_usuario)
    this.getNovedadesByJefe(this.loginService.data.user.id_usuario)
  }

  exportToExcel(titulo: string, data: Novedad[]) {
    this.excelService.exportToExcel(data, titulo, true);
  }

  exportar(fecha_inicio: any, fecha_fin: any) {
    //console.log(fecha_inicio, fecha_fin);

    if (fecha_inicio.value == undefined || fecha_inicio.value == '' || fecha_inicio.value == null || fecha_fin.value == undefined || fecha_fin.value == undefined || fecha_fin.value == undefined || fecha_fin.value < fecha_inicio.value) {
      alert('Ingrese fechas validas');
      return
    }

     this.jsonparadescarga = [];
     this.novedadesDescarga = []

    var data = {
      fecha_inicio: fecha_inicio.value,
      fecha_fin: fecha_fin.value,
      jefe_directo: this.loginService.data.user.id_usuario
    }

    this.novedadesService.getNovedadesToExcelJefe(data).subscribe(
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

          var nombre_archivo = 'AcmeDescargaNovedadesLider';
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

  eliminar(id_empleado_novedad: any){
    if(!confirm('Esta seguro de eliminar esta novedad? Esta accion no puede deshacerse.')){
      return
    }

    var data = {
      id_empleado_novedad: id_empleado_novedad
    }

    this.novedadesService.bajaNovedad(data).subscribe(
      res =>{
        alert('Se ha dado de baja la novedad');
        this.getNovedadesByJefe(this.loginService.data.user.id_usuario)
      },
      err => {
        alert('Ocurrio un error al dar de baja la novedad')
      }
    )
  }

  getEmpleadosByJefe(id_jefe:any){
    this.empleadosService.getEmpleadosByJefe(id_jefe).subscribe(
      res =>{
        this.empleados = res;
        //console.log(this.empleados)
      },
      err => {
        alert('Error al obtener empleados')
      }
    )
  }

  getEmpleadoById(id_empleado:any){
    this.empleadosService.getEmpleadosById(id_empleado).subscribe(
      res => {
        this.empleado=res[0];
        //console.log(res)
        if(this.empleado.id_empresa != undefined)
          this.getNovedadesByEmpresa(this.empleado.id_empresa)
      },
      err => {
        alert('Error al obtener empleado')
      }
    )
  }

  getNovedadesByEmpresa(id_empresa:any){
    this.novedadesService.getNovedadesByEmpresa(id_empresa).subscribe(
      res =>{
        //console.log(res);
        this.novedades = res;
      },
      err => {
        alert('Error al obtener novedades')
      }
    )
  }

  getNovedadesByJefe(id_jefe:any){
    this.novedadesService.getNovedadesJefeDirecto(id_jefe).subscribe(
      res => {
        //console.log(res);
        this.listadoNovedades = res;
      },
      err => {
        alert('Error al cargar el listado de novedades')
      }
    )
  }

  guardar(empleado:any, novedad:any, cantidad:any){
    
    if(empleado.value == undefined || empleado.value == '' || empleado.value == 0 || novedad.value == undefined || novedad.value == '' || novedad.value == 0 || cantidad.value == undefined || cantidad.value == '' || cantidad.value == 0){
      alert('Debe ingresar datos validos.');
      return
    }
    
    var data = {
      id_empleado: empleado.value,
      id_novedad: novedad.value,
      cantidad: cantidad.value
    }

    //console.log(data)

    this.novedadesService.createNovedad(data).subscribe(
      res => {
        alert('Novedad creada con exito');
        this.getNovedadesByJefe(this.loginService.data.user.id_usuario);
        empleado.value = 0;
        novedad.value = 0;
        cantidad.value = 0;
      },
      err => {
        alert('Error al crear novedad')
      }
    )
  }

}
