import { Component, OnInit, HostListener } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { LoginService } from 'src/app/services/login.service';
import { Router } from '@angular/router';


@Component({
  selector: 'barra-superior',
  templateUrl: './barra-superior.component.html',
  styleUrls: ['./barra-superior.component.css']
})
export class BarraSuperiorComponent implements OnInit {

  isSmallScreen = false;
  showLogout = false;
  menuOpen = false;
 

  constructor(
    public loginService: LoginService,
    private router: Router
    ) { }



  ngOnInit(): void {
    this.loginService.data.showNav = true;
    this.checkScreenWidth();
  }

  toggleNav() {
    this.loginService.data.showNav = !this.loginService.data.showNav;

  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
    this.loginService.data.showNav = this.isSmallScreen ? this.menuOpen : true;
  }
  

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenWidth();
  }

/*   checkScreenWidth() {
    this.isSmallScreen = window.innerWidth <= 950;
    if (this.isSmallScreen) {
      this.loginService.data.showNav = false;
    } else {
      this.loginService.data.showNav = true;
    }
  } */
  

  checkScreenWidth() {
    this.isSmallScreen = window.innerWidth <= 950;
    // Comprueba si el menú está abierto antes de ocultarlo en pantallas pequeñas
    if (this.isSmallScreen && !this.menuOpen) {
      this.loginService.data.showNav = false;
    } else {
      this.loginService.data.showNav = true;
    }
  }
  

  // Función para cerrar sesión, limpiar data y redirigir a login
  logout() {
    this.loginService.data = {};
    this.loginService.isLogued = false;
    // navegar a la ruta inicial
    alert("Sesión cerrada");
    this.router.navigate(['/']);
    this.showLogout = false;
  }

  toggleLogout() {
    this.showLogout = !this.showLogout;
  }

}
