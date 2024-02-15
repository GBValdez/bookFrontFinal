import { NgClass } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SideMenuComponent } from '@components/side-menu/side-menu.component';
import { sideMenuInterface } from '@components/side-menu/side-menu.interface';
import { AuthService } from '@services/auth.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NgxSpinnerModule, SideMenuComponent, NgClass],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  constructor(private authSvc: AuthService) {}
  ngOnInit(): void {
    if (this.authSvc.hasAuth()) this.authSvc.nextAuth(this.authSvc.getAuth());
    else this.authSvc.nextAuth(null);
    this.authSvc.authObs.subscribe((res) => {
      this.buttonMenu = [...this.buttonMenuBasic];
      if (res) {
        if (Array.isArray(res.roles) && res.roles.length > 0)
          if (res.roles.some((x) => x == 'ADMINISTRATOR')) {
            this.buttonMenu = [
              ...this.buttonMenu,
              {
                text: 'Usuarios',
                click: '/user/home',
                icon: 'people',
                show: true,
              },
              {
                text: 'Catálogos',
                child: [
                  {
                    text: 'Roles',
                    click: '/catalogue/rol',
                    icon: 'supervisor_account',
                    show: true,
                  },
                  {
                    text: 'Idiomas',
                    click: '/catalogue/language',
                    icon: 'translate',
                    show: true,
                  },
                  {
                    text: 'Paises',
                    click: '/catalogue/country',
                    icon: 'flag',
                    show: true,
                  },
                  {
                    text: 'Categorías',
                    click: '/catalogue/category',
                    icon: 'category',
                    show: true,
                  },
                ],
                icon: 'view_list',
                show: true,
              },
            ];
          }

        this.buttonMenu = [
          ...this.buttonMenu,
          {
            text: 'Cerrar Sesión',
            click: this.logout,
            icon: 'logout',
            show: true,
          },
        ];
      } else {
        this.buttonMenu = [
          ...this.buttonMenu,
          {
            text: 'Iniciar sesión',
            click: '/home',
            icon: 'login',
            show: true,
          },
        ];
      }
    });
  }

  isCollapsed: boolean = true;
  buttonMenu: sideMenuInterface[] = [];

  buttonMenuBasic: sideMenuInterface[] = [
    { text: 'Autores', click: '/authors', icon: 'person', show: true },
    { text: 'Libros', click: '/books', icon: 'book', show: true },
  ];
  private logout = async () => {
    const result = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Quieres cerrar sesión?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Cerrar Sesión',
      cancelButtonText: 'Cancelar',
    });
    if (result.isConfirmed) this.authSvc.logout();
  };
}
