import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './componentes/login/login/login.component';


import { FormsModule } from "@angular/forms";
import { ListadousuariosComponent } from './componentes/usuarios/listadousuarios/listadousuarios.component';
import { NuevousuarioComponent } from './componentes/usuarios/nuevousuario/nuevousuario.component';
import { HttpClientModule } from "@angular/common/http";
import { NavegacionComponent } from './componentes/navegacion/navegacion.component';
import { ListadonoticiasComponent } from './componentes/noticias/listadonoticias/listadonoticias.component';
import { AdminnoticiasComponent } from './componentes/noticias/adminnoticias/adminnoticias.component';
import { MisvacacionesComponent } from './componentes/vacaciones/misvacaciones/misvacaciones.component';
import { AdminvacacionesComponent } from './componentes/vacaciones/adminvacaciones/adminvacaciones.component';
import { AdmlicenciasComponent } from './componentes/licencias/admlicencias/admlicencias.component';
import { MislicenciasComponent } from './componentes/licencias/mislicencias/mislicencias.component';
import { AdmcalendarioComponent } from './componentes/calendario/admcalendario/admcalendario.component';
import { VernoticiaComponent } from './componentes/noticias/vernoticia/vernoticia.component';
import { NuevanoticiaComponent } from './componentes/noticias/nuevanoticia/nuevanoticia.component';
import { NuevoferiadoComponent } from './componentes/calendario/nuevoferiado/nuevoferiado.component';
import { NuevalicenciaComponent } from './componentes/licencias/nuevalicencia/nuevalicencia.component';
import { VerLicenciaComponent } from './componentes/licencias/ver-licencia/ver-licencia.component';
import { AdmlicenciasrrhhComponent } from './componentes/licencias/admlicenciasrrhh/admlicenciasrrhh.component';
import { VervacacionComponent } from './componentes/vacaciones/vervacacion/vervacacion.component';
import { NuevavacacionComponent } from './componentes/vacaciones/nuevavacacion/nuevavacacion.component';
import { ChangePasswordComponent } from './componentes/login/change-password/change-password.component';
import { MiLegajoComponent } from './componentes/legajo/mi-legajo/mi-legajo.component';
import { FiltroVacacionesComponent } from './componentes/vacaciones/filtro-vacaciones/filtro-vacaciones.component';
import { BarraSuperiorComponent } from './componentes/barra-superior/barra-superior.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';

import {MatSnackBarModule} from '@angular/material/snack-bar';


import { NuevoDomicilioComponent } from './componentes/legajo/nuevo-domicilio/nuevo-domicilio.component';
import { BotonAtrasComponent } from './componentes/utils/boton-atras/boton-atras.component';
import { ListadoLegajosComponent } from './componentes/legajo/listado-legajos/listado-legajos.component';
import { NovedadesJefeComponent } from './componentes/novedades/novedades-jefe/novedades-jefe.component';
import { NovedadesRrhhComponent } from './componentes/novedades/novedades-rrhh/novedades-rrhh.component';
import { ListadoLiderComponent } from './componentes/herramientas-prendas/listado-lider/listado-lider.component';
import { NuevoPedidoComponent } from './componentes/herramientas-prendas/nuevo-pedido/nuevo-pedido.component';
import { DetallePedidoComponent } from './componentes/herramientas-prendas/detalle-pedido/detalle-pedido.component';
import { ListadoEmpleadoComponent } from './componentes/herramientas-prendas/listado-empleado/listado-empleado.component';
import { ListadoRrhhComponent } from './componentes/herramientas-prendas/listado-rrhh/listado-rrhh.component';
import { SolicitudesEmpleadoComponent } from './componentes/solicitud-dinero/solicitudes-empleado/solicitudes-empleado.component';
import { NuevaSolicitudComponent } from './componentes/solicitud-dinero/nueva-solicitud/nueva-solicitud.component';
import { DetalleSolicitudDineroComponent } from './componentes/solicitud-dinero/detalle-solicitud-dinero/detalle-solicitud-dinero.component';
import { NuevoTicketComponent } from './componentes/solicitud-dinero/nuevo-ticket/nuevo-ticket.component';
import { HistorialSolicitudDineroComponent } from './componentes/solicitud-dinero/historial-solicitud-dinero/historial-solicitud-dinero.component';
import { TicketsSolicitudComponent } from './componentes/solicitud-dinero/tickets-solicitud/tickets-solicitud.component';
import { SolicitudesDineroJefeComponent } from './componentes/solicitud-dinero/solicitudes-dinero-jefe/solicitudes-dinero-jefe.component';
import { SolicitudesDineroAdministracionComponent } from './componentes/solicitud-dinero/solicitudes-dinero-administracion/solicitudes-dinero-administracion.component';
import { SolicitudesDineroTesoreriaComponent } from './componentes/solicitud-dinero/solicitudes-dinero-tesoreria/solicitudes-dinero-tesoreria.component';
import { SolicitudesDineroRrhhComponent } from './componentes/solicitud-dinero/solicitudes-dinero-rrhh/solicitudes-dinero-rrhh.component';
import { LegajosPasanteComponent } from './componentes/legajo/legajos-pasante/legajos-pasante.component';
import { DescargaRendicionesComponent } from './componentes/solicitud-dinero/descarga-rendiciones/descarga-rendiciones.component';
import { OportunidadesComponent } from './componentes/oportunidades/oportunidades.component';
import { DetalleOportunidadComponent } from './componentes/oportunidades/detalle-oportunidad/detalle-oportunidad.component';
import { NuevaOportunidadComponent } from './componentes/oportunidades/nueva-oportunidad/nueva-oportunidad.component';
import { ListaPostulantesComponent } from './componentes/oportunidades/lista-postulantes/lista-postulantes.component';
import { ListaPostulantesGeneralesComponent } from './componentes/oportunidades/lista-postulantes-generales/lista-postulantes-generales.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    ListadousuariosComponent,
    NuevousuarioComponent,
    NavegacionComponent,
    ListadonoticiasComponent,
    AdminnoticiasComponent,
    MisvacacionesComponent,
    AdminvacacionesComponent,
    AdmlicenciasComponent,
    MislicenciasComponent,
    AdmcalendarioComponent,
    VernoticiaComponent,
    NuevanoticiaComponent,
    NuevoferiadoComponent,
    NuevalicenciaComponent,
    VerLicenciaComponent,
    AdmlicenciasrrhhComponent,
    VervacacionComponent,
    NuevavacacionComponent,
    ChangePasswordComponent,
    MiLegajoComponent,
    FiltroVacacionesComponent,
    BarraSuperiorComponent,
    NuevoDomicilioComponent,
    BotonAtrasComponent,
    ListadoLegajosComponent,
    NovedadesJefeComponent,
    NovedadesRrhhComponent,
    ListadoLiderComponent,
    NuevoPedidoComponent,
    DetallePedidoComponent,
    ListadoEmpleadoComponent,
    ListadoRrhhComponent,
    SolicitudesEmpleadoComponent,
    NuevaSolicitudComponent,
    DetalleSolicitudDineroComponent,
    NuevoTicketComponent,
    HistorialSolicitudDineroComponent,
    TicketsSolicitudComponent,
    SolicitudesDineroJefeComponent,
    SolicitudesDineroAdministracionComponent,
    SolicitudesDineroTesoreriaComponent,
    SolicitudesDineroRrhhComponent,
    LegajosPasanteComponent,
    DescargaRendicionesComponent,
    OportunidadesComponent,
    DetalleOportunidadComponent,
    NuevaOportunidadComponent,
    ListaPostulantesComponent,
    ListaPostulantesGeneralesComponent,

  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatIconModule,
    MatSnackBarModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
