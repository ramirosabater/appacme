import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { categoriaSolitudDinero } from 'src/app/Modelos/categoriasSolicitudesDinero';
import { Configuracion } from 'src/app/Modelos/configuraciones';
import { ItemSolicitudDinero } from 'src/app/Modelos/itemSolicitudDinero';
import { LoginService } from 'src/app/services/login.service';
import { SolicitudDineroService } from 'src/app/services/solicitud_dinero.service';

@Component({
  selector: 'app-nueva-solicitud',
  templateUrl: './nueva-solicitud.component.html',
  styleUrls: ['./nueva-solicitud.component.css']
})
export class NuevaSolicitudComponent implements OnInit {

  tipoSolicitud: number = 0;
  tipoSolicitudString: string = '';
  configuraciones: Configuracion[] = [];
  cajaChica: Configuracion = {};
  viaticos: Configuracion = {};
  monto: number = 0;
  motivo: string = '';
  dias: number = 0;
  categoriasPedido:categoriaSolitudDinero[] = [];
  items:ItemSolicitudDinero[]=[];

  loading: boolean = false;
  subTipo: number = 0;


  constructor(public loginService: LoginService, private activatedRoute: ActivatedRoute, public solicitudDineroService: SolicitudDineroService, private location: Location) { }

  ngOnInit(): void {
    this.tipoSolicitud = this.activatedRoute.snapshot.params.id;
    this.setearTipo(this.tipoSolicitud);
    this.getCategoriasPedido();
    this.getConfiguraciones();
  }

  getConfiguraciones() {
    this.solicitudDineroService.getConfiguraciones().subscribe(
      res => {
        //console.log(res);
        this.configuraciones = res;
        this.configuraciones.forEach(conf => {
          if (conf.id_configuracion == 1) {
            this.cajaChica = conf;
          }
          if (conf.id_configuracion == 2) {
            this.viaticos = conf;
          }
        });
      },
      err => {
        //console.log(err)
      }
    )
  }

  getCategoriasPedido() {
    this.solicitudDineroService.getCategoriasPedidos().subscribe(
      res => {
        this.categoriasPedido = res;
        //console.log(res);
      },
      err => {
        //console.log(err);
      }
    )
  }

  setearTipo(id: number) {
    if (id == 1) {
      this.tipoSolicitudString = "Caja Chica";
    }
    if (id == 2) {
      this.tipoSolicitudString = "Viaje vendedores";
    }
    if (id == 3) {
      this.tipoSolicitudString = "Viaticos deslocalizados";
    }
    if (id == 4) {
      this.tipoSolicitudString = "Rendición de Tarjetas";
    }
  }

  onMontoChange(monto: any) {
    //console.log(monto);
    this.monto =  parseFloat(monto);
  }
  onMotivoChange(motivo: any) {
    //console.log(motivo);
    this.motivo = motivo;
  }

  onDiasChange(dias: any) {
    //console.log(dias);
    if (this.viaticos.valor)
      this.monto = dias * parseFloat(this.viaticos.valor)
    this.dias = dias;
  }

  onSubTipoChange(subTipo: any) {
    //console.log(subTipo);
    this.subTipo = subTipo;
  }

  createSolicitud() {
    if (this.tipoSolicitud == 1) {
      this.createSolicitudCajaChica()
    }

    if(this.tipoSolicitud == 2){
      this.createSolicitudViajeVendedores()
    }

    if(this.tipoSolicitud == 3 ){
      this.createSolicitudViaticos()
    }

    if(this.tipoSolicitud == 4){
      this.createSolicitudTarjeta()
    }
  }

  createSolicitudCajaChica() {
    var data = {
      monto: this.monto,
      motivo_solicitud: this.motivo,
      sub_tipo: this.subTipo
    }

    //console.log(data);
    
    var montoTope: number = 0;

    if(this.cajaChica.valor)
    montoTope = parseFloat(this.cajaChica.valor);

    if (this.subTipo == 0) {
      if (this.monto > montoTope) {
        alert('El monto solicitado no puede superar el monto maximo permitido');
        return
      }
    }
    

    var id_empleado = this.loginService.data.user.id_usuario;

    if (this.monto == 0 || this.motivo == '') {
      alert('Debe completar todos los campos');
      return
    }

    this.loading = true;

    this.solicitudDineroService.createSolicitudCajaChica(data, id_empleado).subscribe(
      res => {
        alert('Solicitud creada con exito.');
        this.location.back();
      },
      err => {
        alert('Error al crear la solicitud')
        this.loading = false;
      }
    )

  }

  createSolicitudViaticos() {
    var data = {
      cantidad_dias: this.dias,
      motivo_solicitud: this.motivo
    }

    var id_empleado = this.loginService.data.user.id_usuario;

    if (this.dias == 0 || this.motivo == '') {
      alert('Debe completar todos los campos');
      return
    }

    this.loading = true;

    this.solicitudDineroService.createSolicitudViaticos(data, id_empleado).subscribe(
      res => {
        alert('Solicitud creada con exito.');
        this.location.back();
      },
      err => {
        alert('Error al crear la solicitud');
        this.loading = false;
      }
    )

  }

  agregarItem(categoria: any, monto:any, observaciones:any){
    //console.log(categoria, monto, observaciones);
    if(categoria.value == 0 || monto.value == 0 || observaciones.value == ''){
      alert('Debe completar todos los datos para agregar un item');
      return
    }

    var montoNumber = parseFloat(monto.value);
    var descripcion_categoria: string | undefined;
    this.categoriasPedido.forEach(cat => {
      if(cat.id_categoria_pedido == parseFloat(categoria.value)){
          descripcion_categoria = cat.descripcion_categoria
      }
    });
    var item: ItemSolicitudDinero = {
      id_categoria_pedido:categoria.value, 
      importe:montoNumber,
      observaciones:observaciones.value,
      descripcion_categoria: descripcion_categoria
    }

    this.items.push(item);

    this.monto = this.monto + montoNumber;
    categoria.value = 0;
    monto.value = 0;
    observaciones.value = '';
  }

  quitarItem(index:any){
    var descuento = this.items[index].importe;
    this.items.splice(index,1);
    this.monto =  this.monto - descuento;
  }

  createSolicitudViajeVendedores() {
    var data = {
      motivo_solicitud: this.motivo, 
      datos: this.items
    }

    var id_empleado = this.loginService.data.user.id_usuario;

    if (this.motivo == '') {
      alert('Debe completar el campo motivo de la solicitud');
      return
    }

    if(this.items.length == 0){
      alert('Debe agregar elementos a la lista');
      return
    }

    //console.log(data)
    this.loading = true;
    this.solicitudDineroService.createSolicitudViajes(data, id_empleado).subscribe(
      res => {
        alert('Solicitud creada con exito.');
        this.location.back();
      },
      err => {
        alert('Error al crear la solicitud')
        this.loading = false;
      }
    )

  }

  //crear solicitud de tarjeta
  createSolicitudTarjeta(){
    var data = {
      motivo_solicitud: this.motivo,
      monto: this.monto
    }

    var id_empleado = this.loginService.data.user.id_usuario;

    if (this.motivo == '' && this.monto == 0) {
      alert('Debe completar todos los campos');
      return
    }

    this.loading = true;

    this.solicitudDineroService.createSolicitudTarjeta(data, id_empleado).subscribe(
      res => {
        alert('Solicitud creada con exito.');
        this.location.back();
      },
      err => {
        alert('Error al crear la solicitud')
        this.loading = false;
      }
    )
  }

  //funcion que devuelve la fecha actual en formato dd/mm/yyyy
  getFechaActual(){
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    return day + '/' + month + '/' + year;
  }

}
