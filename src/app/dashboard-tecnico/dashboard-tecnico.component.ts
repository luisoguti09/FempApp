import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, Router } from '@angular/router';
import { DeportistComponent } from '../components/deportist/deportist.component';

@Component({
  selector: 'app-dashboard-tecnico',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    DeportistComponent
  ],
  templateUrl: './dashboard-tecnico.component.html',
  styleUrl: './dashboard-tecnico.component.scss'
})
export class DashboardTecnicoComponent {

   private router = inject(Router);
   /*mostrarDeportistas(){
    this.depServ.getDeportistas()
    .subscribe(deportistas => {
      if (Array.isArray(deportistas)) {
        this.dataSource.data = deportistas;
        this.dataSource.filter = this.filterValue;
      } else {
        console.error('Los datos recibidos no son un arreglo de Deportist');
      }
    });
  }*/
}
