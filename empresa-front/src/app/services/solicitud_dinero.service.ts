import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from 'src/environments/environment';
import { LoginService } from './login.service';
import { SolicitudDinero } from '../Modelos/solicitudesDinero';
import { tipoSolicitudDinero } from '../Modelos/tiposSolicitudesDinero';
import { Ticket } from '../Modelos/tickets';
import { Configuracion } from '../Modelos/configuraciones';
import { Categoria } from '../Modelos/categoria';
import { categoriaSolitudDinero } from '../Modelos/categoriasSolicitudesDinero';


@Injectable({
  providedIn: 'root'
})
export class SolicitudDineroService {

  URL_API = environment.ruta_api + "api/solicitud-dinero/";

  constructor(public http: HttpClient, public loginService:LoginService) { }

  funcionToken(token: any) {
    var headers;
    if (token != undefined) {
      headers = new HttpHeaders({
        "authorization": token
      });
    }

    const httpOptions = {
      headers: headers
    }

    return httpOptions;
  }

  

  getSolicitudesDineroByEmpleado(id_empleado:any){
    return this.http.get<SolicitudDinero[]>(`${this.URL_API}${id_empleado}`, this.funcionToken(this.loginService.data.token))
  }

  getSolicitudesDineroByJefeDirecto(id_jefe_directo:any){
    return this.http.get<SolicitudDinero[]>(`${this.URL_API}solicitudes-jefe/${id_jefe_directo}`, this.funcionToken(this.loginService.data.token))
  }

  getSolicitudesDineroAdministracion(){
    return this.http.put<SolicitudDinero[]>(`${this.URL_API}solicitudes-administracion/`,{}, this.funcionToken(this.loginService.data.token))
  }

  getSolicitudesDineroByTesoreria(){
    return this.http.put<SolicitudDinero[]>(`${this.URL_API}solicitudes-tesoreria/`,{}, this.funcionToken(this.loginService.data.token))
  }

  getSolicitudesDineroRRHH(){
    return this.http.put<SolicitudDinero[]>(`${this.URL_API}solicitudes-rrhh/`, {},this.funcionToken(this.loginService.data.token))
  }

  getSolicitudById(id_solicitud:any){
    return this.http.get<SolicitudDinero[]>(`${this.URL_API}solicitud/${id_solicitud}`, this.funcionToken(this.loginService.data.token))
  }

  getTicketsByIdSolicitud(id_solicitud:any){
    return this.http.get<Ticket[]>(`${this.URL_API}tickets/${id_solicitud}`, this.funcionToken(this.loginService.data.token))
  }

  subirTicket(nro_ticket: any, proveedor:any, importe_sin_iva:any, punto_venta:any, fecha_ticket:any, id_solicitud:any, cuit: any, file:File){
    const fd = new FormData();
    fd.append('nro_ticket', nro_ticket);
    fd.append('proveedor', proveedor);
    fd.append('importe_sin_iva', importe_sin_iva);
    fd.append('punto_venta', punto_venta);
    fd.append('fecha_ticket', fecha_ticket);
    fd.append('cuit', cuit);
    fd.append('file', file);
    return this.http.post(`${this.URL_API}tickets/${id_solicitud}`, fd, this.funcionToken(this.loginService.data.token));
  }

  getCategoriasSolicitud(){
    return this.http.post<tipoSolicitudDinero[]>(`${this.URL_API}categorias-solicitudes`, {}, this.funcionToken(this.loginService.data.token))
  }

  getCategoriasPedidos(){
    return this.http.post<categoriaSolitudDinero[]>(`${this.URL_API}categorias-pedidos`,{}, this.funcionToken(this.loginService.data.token))
  }

  createSolicitudCajaChica(data:{}, id_empleado: any){
    return this.http.post(`${this.URL_API}caja-chica/${id_empleado}`, data, this.funcionToken(this.loginService.data.token));
  }

  getConfiguraciones(){
    return this.http.post<Configuracion[]>(`${this.URL_API}configuraciones`, {}, this.funcionToken(this.loginService.data.token))
  }

  createSolicitudViaticos(data:{}, id_empleado: any){
    return this.http.post(`${this.URL_API}viaticos-deslocalizados/${id_empleado}`, data, this.funcionToken(this.loginService.data.token));
  }

  createSolicitudViajes(data:{}, id_empleado: any){
    return this.http.post(`${this.URL_API}viajes-vendedores/${id_empleado}`, data, this.funcionToken(this.loginService.data.token));
  }


  //caja chica

  aprobarCajaChicaJefe(id_solicitud_dinero: any){
    return this.http.post(`${this.URL_API}caja-chica/aprobar-jefe/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  rechazarCajaChicaJefe(id_solicitud: any, data: {}){
    return this.http.post(`${this.URL_API}caja-chica/denegar-jefe/${id_solicitud}`, data, this.funcionToken(this.loginService.data.token))
  }

  aprobarCajaChicaAdministracion(id_solicitud_dinero: any){
    return this.http.post(`${this.URL_API}caja-chica/aprobar-administracion/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  rechazarCajaChicaAdministracion(id_jefe_directo: any, data: {}){
    return this.http.post(`${this.URL_API}caja-chica/denegar-administracion/${id_jefe_directo}`, data, this.funcionToken(this.loginService.data.token))
  }

  aprobarCajaChicaRendicionJefe(id_solicitud_dinero: any){
    return this.http.put(`${this.URL_API}caja-chica/aprobar-rendicion-jd/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  rechazarCajaChicaRendicionJefe(id_solicitud: any, data: {}){
    return this.http.put(`${this.URL_API}caja-chica/denegar-rendicion-jd/${id_solicitud}`, data, this.funcionToken(this.loginService.data.token))
  }

  aprobarCajaChicaRendicionAdministracion(id_solicitud_dinero: any){
    return this.http.put(`${this.URL_API}caja-chica/aprobar-rendicion-administracion/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  rechazarCajaChicaRendicionAdministracion(id_solicitud: any, data: {}){
    return this.http.put(`${this.URL_API}caja-chica/rechazar-rendicion-administracion/${id_solicitud}`, data, this.funcionToken(this.loginService.data.token))
  }

  //presentar rendicion
  presentarRendicion(id_solicitud_dinero: any){
    return this.http.post(`${this.URL_API}presentar-rendicion/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }


  //viaje vendedores
  aprobarViajeVendedoresJefe(id_solicitud_dinero: any){
    return this.http.post(`${this.URL_API}viajes-vendedores/aprobar-jefe/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  rechazarViajeVendedoresJefe(id_solicitud_dinero: any, data: {}){
    return this.http.post(`${this.URL_API}viajes-vendedores/rechazar-jefe/${id_solicitud_dinero}`, data, this.funcionToken(this.loginService.data.token))
  }

  aprobarViajeVendedoresTesoreria(id_solicitud_dinero: any){
    return this.http.post(`${this.URL_API}viajes-vendedores/aprobar-tesoreria/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  rechazarViajeVendedoresTesoreria(id_jefe_directo: any, data: {}){
    return this.http.post(`${this.URL_API}viajes-vendedores/rechazar-tesoreria/${id_jefe_directo}`, data, this.funcionToken(this.loginService.data.token))
  }

  aprobarViajeVendedoresRendicionJefe(id_solicitud_dinero: any){
    return this.http.post(`${this.URL_API}viajes-vendedores/aprobar-rendicion-jefe/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  rechazarViajeVendedoresRendicionJefe(id_solicitud_dinero: any, data: {}){
    return this.http.post(`${this.URL_API}viajes-vendedores/rechazar-rendicion-jefe/${id_solicitud_dinero}`, data, this.funcionToken(this.loginService.data.token))
  }

  aprobarViajeVendedoresRendicionTesoreria(id_solicitud_dinero: any){
    return this.http.post(`${this.URL_API}viajes-vendedores/aprobar-rendicion-tesoreria/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  rechazarViajeVendedoresRendicionTesoreria(id_solicitud_dinero: any, data: {}){
    return this.http.post(`${this.URL_API}viajes-vendedores/rechazar-rendicion-tesoreria/${id_solicitud_dinero}`, data, this.funcionToken(this.loginService.data.token))
  }

  //deslocalizados
  aprobarDeslocalizadosRRHH(id_solicitud_dinero: any){
    return this.http.post(`${this.URL_API}viaticos-deslocalizados/aprobar-rrhh/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  aprobarDeslocalizadosTesoreria(id_solicitud_dinero: any){
    return this.http.put(`${this.URL_API}viaticos-deslocalizados/aprobar-rendicion-tesoreria/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  rechazarRRHH(id_solicitud_dinero: any, data: {}){
    return this.http.post(`${this.URL_API}viaticos-deslocalizados/rechazar-rrhh/${id_solicitud_dinero}`, data, this.funcionToken(this.loginService.data.token))
  }


  //eliminar ticket
  eliminarTicket(id_ticket: any){
    return this.http.put(`${this.URL_API}eliminar-ticket/${id_ticket}`,{}, this.funcionToken(this.loginService.data.token))
  }

  //tarjetas

  //crear solicitudes para tarjeta
  createSolicitudTarjeta(data:{}, id_empleado: any){
    return this.http.post(`${this.URL_API}tarjeta-credito/${id_empleado}`, data, this.funcionToken(this.loginService.data.token));
  }

  //aprobar tarjeta tesoreria
  aprobarTarjetaTesoreria(id_solicitud_dinero: any){
    return this.http.post(`${this.URL_API}tarjeta-credito/aprobar-rendicion-tesoreria/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  //rechazar tarjeta tesoreria
  rechazarTarjetaTesoreria(id_solicitud_dinero: any){
    return this.http.post(`${this.URL_API}tarjeta-credito/rechazar-rendicion-tesoreria/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  //enviar rendicion tarjeta
  enviarRendicionTarjeta(id_solicitud_dinero: any){
    return this.http.post(`${this.URL_API}presentar-rendicion-tarjeta/${id_solicitud_dinero}`, {}, this.funcionToken(this.loginService.data.token))
  }

  //consulta para descarga de tickets
  getTicketsUsuario(data: {}){
    return this.http.post<Ticket[]>(`${this.URL_API}descargar-tickets-usuario/`,data,  this.funcionToken(this.loginService.data.token))
  }

  getTickets(data: {}){
    return this.http.post<Ticket[]>(`${this.URL_API}descargar-tickets/`,data,  this.funcionToken(this.loginService.data.token))
  }


}