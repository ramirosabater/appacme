import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './componentes/home/home.component';
import { DetalleOportunidadComponent } from './componentes/detalle-oportunidad/detalle-oportunidad.component';
import { PostularseComponent } from './componentes/postularse/postularse.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'detalle-oferta/:id',
    component: DetalleOportunidadComponent
  },
  {
    path: 'postularse/:id',
    component: PostularseComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
