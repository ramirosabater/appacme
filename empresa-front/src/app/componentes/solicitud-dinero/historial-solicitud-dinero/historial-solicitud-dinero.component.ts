import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-historial-solicitud-dinero',
  templateUrl: './historial-solicitud-dinero.component.html',
  styleUrls: ['./historial-solicitud-dinero.component.css']
})
export class HistorialSolicitudDineroComponent implements OnInit {

  constructor(public loginService:LoginService) { }

  ngOnInit(): void {
  }

}
