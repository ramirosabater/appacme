import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // Import BrowserAnimationsModule
import { ToastrModule } from 'ngx-toastr'; // Import ToastrModule
import { FormsModule } from '@angular/forms'; // Import FormsModule

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './componentes/home/home.component';
import { DetalleOportunidadComponent } from './componentes/detalle-oportunidad/detalle-oportunidad.component';
import { PostularseComponent } from './componentes/postularse/postularse.component';
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DetalleOportunidadComponent,
    PostularseComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // Add this
    ToastrModule.forRoot({
      timeOut: 3000, // Toast duration in milliseconds
      positionClass: 'toast-top-right', // Position of the toast
      preventDuplicates: true, // Prevent duplicate toasts
      progressBar: true, // Show a progress bar
      progressAnimation: 'increasing', // Progress bar animation
    }), // Configure ToastrModule
    FormsModule // Add FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
