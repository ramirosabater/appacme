import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { AdmcalendarioComponent } from './componentes/calendario/admcalendario/admcalendario.component';
import { NuevoferiadoComponent } from './componentes/calendario/nuevoferiado/nuevoferiado.component';
import { MiLegajoComponent } from './componentes/legajo/mi-legajo/mi-legajo.component';
import { AdmlicenciasComponent } from './componentes/licencias/admlicencias/admlicencias.component';
import { AdmlicenciasrrhhComponent } from './componentes/licencias/admlicenciasrrhh/admlicenciasrrhh.component';
import { MislicenciasComponent } from './componentes/licencias/mislicencias/mislicencias.component';
import { NuevalicenciaComponent } from './componentes/licencias/nuevalicencia/nuevalicencia.component';
import { VerLicenciaComponent } from './componentes/licencias/ver-licencia/ver-licencia.component';
import { ChangePasswordComponent } from './componentes/login/change-password/change-password.component';
import { LoginComponent } from './componentes/login/login/login.component';
import { AdminnoticiasComponent } from './componentes/noticias/adminnoticias/adminnoticias.component';
import { ListadonoticiasComponent } from './componentes/noticias/listadonoticias/listadonoticias.component';
import { NuevanoticiaComponent } from './componentes/noticias/nuevanoticia/nuevanoticia.component';
import { VernoticiaComponent } from './componentes/noticias/vernoticia/vernoticia.component';
import { ListadousuariosComponent } from './componentes/usuarios/listadousuarios/listadousuarios.component';
import { NuevousuarioComponent } from './componentes/usuarios/nuevousuario/nuevousuario.component';
import { AdminvacacionesComponent } from './componentes/vacaciones/adminvacaciones/adminvacaciones.component';
import { FiltroVacacionesComponent } from './componentes/vacaciones/filtro-vacaciones/filtro-vacaciones.component';
import { MisvacacionesComponent } from './componentes/vacaciones/misvacaciones/misvacaciones.component';
import { NuevavacacionComponent } from './componentes/vacaciones/nuevavacacion/nuevavacacion.component';
import { VervacacionComponent } from './componentes/vacaciones/vervacacion/vervacacion.component';
import { NuevoDomicilioComponent } from './componentes/legajo/nuevo-domicilio/nuevo-domicilio.component';
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
import { SolicitudesDineroAdministracionComponent } from './componentes/solicitud-dinero/solicitudes-dinero-administracion/solicitudes-dinero-administracion.component';
import { SolicitudesDineroTesoreriaComponent } from './componentes/solicitud-dinero/solicitudes-dinero-tesoreria/solicitudes-dinero-tesoreria.component';
import { SolicitudesDineroJefeComponent } from './componentes/solicitud-dinero/solicitudes-dinero-jefe/solicitudes-dinero-jefe.component';
import { SolicitudesDineroRrhhComponent } from './componentes/solicitud-dinero/solicitudes-dinero-rrhh/solicitudes-dinero-rrhh.component';
import { LegajosPasanteComponent } from './componentes/legajo/legajos-pasante/legajos-pasante.component';
import { DescargaRendicionesComponent } from './componentes/solicitud-dinero/descarga-rendiciones/descarga-rendiciones.component';
import { OportunidadesComponent } from './componentes/oportunidades/oportunidades.component';
import { DetalleOportunidadComponent } from './componentes/oportunidades/detalle-oportunidad/detalle-oportunidad/detalle-oportunidad.component';
import { NuevaOportunidadComponent } from './componentes/oportunidades/nueva-oportunidad/nueva-oportunidad.component';
import { ListaPostulantesComponent } from './componentes/oportunidades/lista-postulantes/lista-postulantes.component';
import { ListaPostulantesGeneralesComponent } from './componentes/oportunidades/lista-postulantes-generales/lista-postulantes-generales.component';


const routes: Routes = [
  {
    path: '',
    component: LoginComponent
  },
  {
    path: 'cambiar-contraseña',
    component: ChangePasswordComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'noticias',
    component: ListadonoticiasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new-noticia/:id/:new',
    component: NuevanoticiaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-noticia/:id/:new',
    component: NuevanoticiaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ver-noticia/:id',
    component: VernoticiaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'users',
    component: ListadousuariosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new-user/:id/:new',
    component: NuevousuarioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'edit-user/:id/:new',
    component: NuevousuarioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mi-legajo/:id/:usuario',
    component: MiLegajoComponent,
    canActivate: [AuthGuard]
    /* canActivate: [AuthGuard] */
  },
  {
    path: 'legajo/:id/:usuario',
    component: MiLegajoComponent,
    canActivate: [AuthGuard]
    /* canActivate: [AuthGuard] */
  },
  {
    path: 'listado-legajos',
    component: ListadoLegajosComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nuevo-domicilio/:id',
    component: NuevoDomicilioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'adm-vacaciones',
    component: AdminvacacionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ver-vacacion/:id/:user',
    component: VervacacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'solicitar-vacaciones',
    component: NuevavacacionComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'vacaciones-todas',
    component: FiltroVacacionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'adm-licencias',
    component: AdmlicenciasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'adm-licencias-rrhh',
    component: AdmlicenciasrrhhComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'adm-noticias',
    component: AdminnoticiasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'calendario',
    component: AdmcalendarioComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nuevo-feriado',
    component: NuevoferiadoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mis-vacaciones',
    component: MisvacacionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mis-licencias',
    component: MislicenciasComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nueva-licencia',
    component: NuevalicenciaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'ver-licencia/:id/:user',
    component: VerLicenciaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'novedades',
    component: NovedadesJefeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'novedades-rrhh',
    component: NovedadesRrhhComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'herramientas-prendas-lider',
    component: ListadoLiderComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nuevo-pedido',
    component: NuevoPedidoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle-pedido/:id/:user',
    component: DetallePedidoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'herramientas-prendas-empleado',
    component: ListadoEmpleadoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'herramientas-prendas-rrhh',
    component: ListadoRrhhComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'solicitud-dinero-empleado',
    component: SolicitudesEmpleadoComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nueva-solicitud-dinero/:id',
    component: NuevaSolicitudComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle-solicitud-dinero/:id/:id_tipo/:user',
    component: DetalleSolicitudDineroComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nuevo-ticket/:id',
    component: NuevoTicketComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'historial-solicitud-dinero',
    component: HistorialSolicitudDineroComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'tickets-solicitud/:user/:id/:tipo_solicitud',
    component: TicketsSolicitudComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'solicitud-dinero-administracion',
    component: SolicitudesDineroAdministracionComponent,
    canActivate: [AuthGuard]
  }
  ,
  {
    path: 'solicitud-dinero-tesoreria',
    component: SolicitudesDineroTesoreriaComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'solicitud-dinero-jefe',
    component: SolicitudesDineroJefeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'solicitud-dinero-rrhh',
    component: SolicitudesDineroRrhhComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'administrar-legajos',
    component: LegajosPasanteComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'descarga-rendiciones',
    component: DescargaRendicionesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lista-oportunidades',
    component: OportunidadesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'detalle-oportunidad/:id_empleo',
    component: DetalleOportunidadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'nueva-oportunidad',
    component: NuevaOportunidadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'editar-oportunidad/:id_empleo',
    component: NuevaOportunidadComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lista-postulantes/:id_empleo',
    component: ListaPostulantesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'lista-postulantes-generales',
    component: ListaPostulantesGeneralesComponent,
    canActivate: [AuthGuard]
  },

  


];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    scrollPositionRestoration: 'top'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
