import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { UsersService } from 'src/app/services/users.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent implements OnInit {

  constructor(
    public loginService: LoginService,
    public usuariosService: UsersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    
  }

  changePassword(actual: any, nueva: any, confirmar: any) {

    if (actual.value == "" || actual.value == null || actual.value == undefined || nueva.value == "" || nueva.value == null || nueva.value == undefined || confirmar.value == "" || confirmar.value == null || confirmar.value == undefined) {
      alert("Debe completar todos los campos");
      return;
    }
    if (nueva.value != confirmar.value) {
      alert("Las contraseñas no coinciden");
      return;
    }

    var data = {
      pass: actual.value,
      newPass: nueva.value,
      id_usuario: this.loginService.data.user.id_usuario
    }

    this.usuariosService.changePassword(data).subscribe(
      res => {
        alert("Contraseña cambiada con éxito");
        this.router.navigate(['/']);
      },
      err => {
        alert("Error al cambiar la contraseña");
        this.router.navigate(['/']);
      }
    );
  }

}
