import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/Modelos/empleado';
import { Vacaciones } from 'src/app/Modelos/vacaciones';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { LoginService } from 'src/app/services/login.service';
import { VacacionesService } from 'src/app/services/vacaciones.service';

@Component({
  selector: 'app-misvacaciones',
  templateUrl: './misvacaciones.component.html',
  styleUrls: ['./misvacaciones.component.css']
})
export class MisvacacionesComponent implements OnInit {

  empleado: Empleado = {
  }
  vacaciones: Vacaciones[] = [];

  estados = [{
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

  //id_empleado = 51;
  dias_restantes = 0;



  constructor(public empleadosService:EmpleadosService, public vacacionesService: VacacionesService, public loginService: LoginService) { }

  ngOnInit(): void {
    this.getEmpleadoById(this.loginService.data.user.id_usuario);
    this.getVacacionesByIdEmpleado(this.loginService.data.user.id_usuario);
  }


  getVacacionesByIdEmpleado(id: number){
    this.vacacionesService.getVacacionesByIdEmpleado(id).subscribe(
      res => {
        this.vacaciones = res;
        this.vacaciones.forEach(vacacion => {
          if(vacacion.estado != undefined){
            vacacion.estado_string = this.estados[vacacion.estado].valor;
            vacacion.estado_color = this.estados[vacacion.estado].color;
          }
        });
      },
      err => alert(err.error.message)
    )
  }

  getEmpleadoById(id: number){
    this.empleadosService.getEmpleadosById(id).subscribe(
      res => {
        this.empleado = res[0];
        if(this.empleado.dias_restantes != undefined){
          this.dias_restantes = this.empleado.dias_restantes;
        }
      },
      err => alert(err.error.message)
    )
  }

}
