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

export const routes: Routes = [

    { path: '', component: LoginComponent },
    { path: 'dashboard-deport', component: DashboardDeportComponent },
    { path: 'registro', component: RegistroComponent },
    { path: 'registroFast', component: RegistroFastComponent },
    { path: 'deportist', component: DeportistComponent },
    { path: '', component: DashboardProfComponent },
    { path: 'evento-detail', component: EventoDetailComponent },
    { path: 'elementos/:id', component: ElementosDetailComponent },
    { path: 'dashboard-prof', component: DashboardProfComponent },
    {path: 'dashboard-admin', component: DashboardAdminComponent},
    {path: 'dashboard-tecnico', component: DashboardTecnicoComponent},

];

