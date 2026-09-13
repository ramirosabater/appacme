import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Elemento } from 'src/app/Modelos/elemento';
import { Empleado } from 'src/app/Modelos/empleado';
import { EmpleadosService } from 'src/app/services/empleados.service';
import { HerramientasPrendasService } from 'src/app/services/herramientas-prendas.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-nuevo-pedido',
  templateUrl: './nuevo-pedido.component.html',
  styleUrls: ['./nuevo-pedido.component.css']
})
export class NuevoPedidoComponent implements OnInit {

  empleados: Empleado[] = [];
  elementos: Elemento[] = [];
  items: any[] = [];

  itemsSeleccionados: Elemento[] = [];

  cantidadElementos: number = 0;

  loading:boolean=false;

  constructor(public loginService: LoginService, public empleadosService: EmpleadosService, public herramientasPrendasService: HerramientasPrendasService, private location: Location) { }

  ngOnInit(): void {
    this.getListadoHerramientasPrendas();
    this.getEmpleadosByJefe(this.loginService.data.user.id_usuario)
  }

  getEmpleadosByJefe(id_jefe: any) {
    this.empleadosService.getEmpleadosByJefe(id_jefe).subscribe(
      res => {
        this.empleados = res;
        //console.log(this.empleados)
      },
      err => {
        alert('Error al obtener empleados')
      }
    )
  }

  getListadoHerramientasPrendas() {
    this.herramientasPrendasService.getListadoHerramientasPrendas().subscribe(
      res => {
        this.elementos = res;
      },
      err => {
        //console.log(err)
      }
    )
  }

  guardar(empleado: any) {
    this.loading = true;
    //console.log(empleado.value);
    if (empleado.value == 0) {
      alert('Debe seleccionar un empleado');
      return
    }

    if (this.itemsSeleccionados.length == 0) {
      alert('Debe agregar al menos un item a la lista')
      return
    }

    var data = {
      id_jefe_directo: this.loginService.data.user.id_usuario,
      id_empleado: empleado.value,
      datos: this.itemsSeleccionados
    }

    this.herramientasPrendasService.realizarSolicitud(data).subscribe(
      res => {
        alert('Solicitud creada con exito');
        this.location.back();
      },
      err => {
        alert('Error al realizar la solicitud');
        this.loading=false;
      }
    )
  }

  agregarElemento(elemento: any, talle: any, cantidad: any) {

    var bandera = false;
    if (elemento.value == 0) {
      alert('Debe seleccionar un elemento');
      return
    }

    if (cantidad.value == '' || cantidad.value == 0 || cantidad.value == undefined) {
      alert('Debe seleccionar una cantidad');
      return
    }

    if (this.itemsSeleccionados.length != 0) {
      this.itemsSeleccionados.forEach(item => {
        if (item.id_elemento == elemento.value) {
          alert('Ese elemento ya fue seleccionado');
          bandera = true
        }
      });
    }

    if (bandera) {
      return
    }

    if (this.elementos.length != 0) {
      this.elementos.forEach(item => {
        if (item.id_elemento == elemento.value) {
          var nuevoElemento: Elemento = {};
          nuevoElemento.id_elemento = elemento.value;
          nuevoElemento.desc_elemento = item.desc_elemento;
          nuevoElemento.talle = talle.value;
          nuevoElemento.cantidad = cantidad.value;

          this.cantidadElementos += parseInt(cantidad.value);

          this.itemsSeleccionados.push(nuevoElemento)
          elemento.value = 0;
          cantidad.value = 0;
          talle.value = ''
        }
      });
    }
  }

  eliminarElemento(id_elemento: any) {
    if (confirm('Desea quitar este elemento?')) {
      const indice = this.itemsSeleccionados.findIndex(elemento => elemento.id_elemento === id_elemento);

      if (indice !== -1) {
        var cant = this.itemsSeleccionados[indice].cantidad;
        if (cant)
          this.cantidadElementos -= cant;
        this.itemsSeleccionados.splice(indice, 1);
      }
    }


  }

  getFechaActual() {
    var fecha = new Date();
    var dia = fecha.getDate();
    var mes = fecha.getMonth() + 1;
    var anio = fecha.getFullYear();

    var fechaActual = dia + '/' + mes + '/' + anio;

    return fechaActual;
  }

  cancelar() {
    if (confirm('Desea cancelar la solicitud del pedido? Esta accion no puede deshacerse.')) {
      this.location.back();
    }
  }


}
