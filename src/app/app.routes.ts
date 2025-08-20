import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardDeportComponent } from './components/dashboard-deport/dashboard-deport.component';
import { RegistroComponent } from './components/registro/registro.component';
import { RegistroFastComponent } from './components/registro-fast/registro-fast.component';
import { DeportistComponent } from './components/deportist/deportist.component';
import { DashboardProfComponent } from './components/dashboard-prof/dashboard-prof.component';
import { EventoDetailComponent } from './components/evento-detail/evento-detail.component';
import { ElementosDetailComponent } from './components/elementos-detail/elementos-detail.component';
import { DashboardTecnicoComponent } from './dashboard-tecnico/dashboard-tecnico.component';
import { DashboardAdminComponent } from './dashboard-admin/dashboard-admin.component';
import { DialogsComponent } from './components/dialogs/dialogs.component';
import { UsuariosComponent } from './components/usuarios/usuarios.component';
import { DocumentacionComponent } from './components/documentacion/documentacion.component';
import { MyProfileComponent } from './components/my-profile/my-profile.component';
import { authGuard } from './guards/auth.guard';
import { noAuthGuard } from './guards/no-auth.guard';

export const routes: Routes = [

  { path: 'login', component: LoginComponent }, // canActivate: [noAuthGuard] },
  { path: 'registro', component: RegistroComponent }, // canActivate: [noAuthGuard] },
  { path: 'registroFast', component: RegistroFastComponent }, // canActivate: [noAuthGuard] },

  { path: 'deportist', component: DeportistComponent },
  { path: 'evento-detail/:evento', component: EventoDetailComponent },
  { path: 'elementos/:id', component: ElementosDetailComponent },
  { path: 'dialogs', component: DialogsComponent },
  { path: 'usuarios', component: UsuariosComponent },
  { path: 'documentacion', component: DocumentacionComponent },
  { path: 'test', component: LoginComponent },
  {path: 'dashboard-deport',
    component: DashboardDeportComponent,
    children: [

      {
        path: 'mis-datos',
        loadComponent: () =>
          import('./components/my-profile/my-profile.component')
            .then(m => m.MyProfileComponent)
      },
      {
        path: 'mis-eventos',
        loadComponent: () =>
          import('./components/evento-detail/evento-detail.component')
            .then(m => m.EventoDetailComponent),
        data: { mode: 'disponibles' }
      }
    ]
  }, // canActivate: [authGuard] },
  { path: 'dashboard-admin', component: DashboardAdminComponent }, // canActivate: [authGuard] },
  { path: 'dashboard-tecnico', component: DashboardTecnicoComponent }, // canActivate: [authGuard] },
  { path: 'dashboard-prof', component: DashboardProfComponent }, // canActivate: [authGuard] },
  // Ruta por defecto redirige a login
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  // Ruta comodín para rutas inválidas
  { path: '**', redirectTo: 'login' }
];

