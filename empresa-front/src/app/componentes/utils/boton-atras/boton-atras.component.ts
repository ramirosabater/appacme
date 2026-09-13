import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-boton-atras',
  templateUrl: './boton-atras.component.html',
  styleUrls: ['./boton-atras.component.css']
})
export class BotonAtrasComponent implements OnInit {

  constructor(
    private location: Location
  ) { }

  ngOnInit(): void {
  }

  atras() {
    this.location.back();
  }

}
