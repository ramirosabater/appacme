import { Component, OnInit } from '@angular/core';
import { Licencia } from 'src/app/Modelos/licencia';
import { LicenciasService } from 'src/app/services/licencias.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-mislicencias',
  templateUrl: './mislicencias.component.html',
  styleUrls: ['./mislicencias.component.css']
})
export class MislicenciasComponent implements OnInit {

  licencias: Licencia[] = [];

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
  }
  ];

  estado: string = '';

  constructor(
    public licenciasService: LicenciasService , public loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.getLicenciasByEmpleado(this.loginService.data.user.id_usuario);
  }

  getLicenciasByEmpleado(id_empleado: any) {
    this.licenciasService.getLicenciasByEmpleado(id_empleado)
      .subscribe(
        res => {
          this.licencias = res;
          //settear los estados
          this.licencias.forEach(licencia => {
            if (licencia.estado != undefined && licencia.revision_jefe != undefined && licencia.revision_recursos != undefined) {
              licencia.estado_string = this.estados[licencia.estado].valor;
              licencia.estado_color = this.estados[licencia.estado].color
              licencia.revision_jefe_string = this.estados[licencia.revision_jefe].valor;
              licencia.revision_recursos_string = this.estados[licencia.revision_recursos].valor;
              licencia.revision_jefe_color = this.estados[licencia.revision_jefe].color;
              licencia.revision_recursos_color = this.estados[licencia.revision_recursos].color;
            }
          });
        },
        err => alert(err.error.message)
      );
  }

}
