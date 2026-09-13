import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/Modelos/user';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user: User = {
    dni: "",
    password: "",
  }

  constructor(
    public router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
  }

  login(form: NgForm) {

    if (this.user.nombre == "" || this.user.password == "") {
      alert("Debe completar todos los campos");
      return;
    }
    else {
      this.loginService.login(this.user).subscribe(
        res => {
          this.loginService.data = res;
          this.loginService.isLogued = true;
          if (this.loginService.data.user.reset_password == 0) {
            this.router.navigate(['/cambiar-contraseña']);
          } else
            this.router.navigate(['/noticias']);
          //localStorage.setItem('token', res.token);

        },
        err => {
          alert("Usuario o contraseña incorrectos");
        }
      );


    }

  }

}
