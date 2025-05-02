import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { DeportistComponent } from '../deportist/deportist.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { DeportistService } from '../../services/deportist.service';
import { LoginService } from '../../services/login.service';
import { RegistroService } from '../../services/registro.service';
import { EventosService } from '../../services/eventos.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-deport',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    DeportistComponent,
    MatFormFieldModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    CommonModule,

  ],
  templateUrl: './dashboard-deport.component.html',
  styleUrl: './dashboard-deport.component.scss'
})
export class DashboardDeportComponent implements OnInit {

  private router = inject(Router);
  private depServ = inject(DeportistService);
  public empadronada: string = "";
  public displayedColumns: string[] = ['apellidoYNombre', 'fechadeNacimiento', 'club', 'categoria'];
  public displayedEventColumns: string[] = ['nombre', 'fecha', 'inscribirse'];
  public dataSource = new MatTableDataSource();
  public filterValue = '';
  public pers: any;

  private regServ = inject(RegistroService);
  private logServ = inject(LoginService);
  private eventServ = inject(EventosService);

  ngOnInit() {
    this.mostrarMisDatos();
    this.mostrarEventos();
  }

  mostrarMisDatos() {
    this.regServ.buscar(this.logServ.loggedUser.usuario.dni)
      .subscribe((res: any) => {
        this.pers = res;
        console.log(this.pers);

      });
  }



  mostrarEventos() {
    const today = new Date();
    this.eventServ.getEventos().subscribe((res: any) => {
      /*this.dataSource.data = res.filter((evento: any) => 
        new Date(evento.fechaInscripcion) >= today
      );*/
      this.dataSource = res;
      console.log(this.dataSource.data);
    });
  }

  mostrarEventosInscritos() {
    const today = new Date();
    this.eventServ.getEventos().subscribe((res: any) => {
      this.dataSource.data = res.filter((evento: any) => 
        evento.deportistas.some((deportista: any) => 
          deportista.dni === this.logServ.loggedUser.usuario.dni) &&
        new Date(evento.fechaInscripcion) >= today
      );
      console.log(this.dataSource.data);
    });
  }


  inscribirEvento(eventoId: string) {
    this.eventServ.inscribirDeportista(Number(this.logServ.loggedUser.usuario.dni), 
    Number(eventoId)).subscribe({
      next: (response: any) => {
        console.log('Inscripción al evento realizada exitosamente', response);
        // Aquí puedes agregar lógica para manejar la inscripción exitosa
      },
      error: (e: any) => {
        console.error('Error al inscribirse al evento', e.error.error);
      }
    });
  }

  seleccionarEvento(eventoId: string) {
    this.router.navigate(['/evento-detail', eventoId]);
  }




  // Aquí puedes agregar métodos para manejar la foto de perfil del deportista

  subirFotoPerfil(event: any) {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('fotoPerfil', file);
    this.depServ.subirFotoPerfil(this.logServ.loggedUser.usuario.dni, formData).subscribe({
      next: (response: any) => {
        console.log('Foto de perfil subida exitosamente', response);
        // Aquí puedes agregar lógica para manejar la foto de perfil subida
      },
      error: (e: any) => {
        console.error('Error al subir la foto de perfil', e.error.error);
      }
    });
  }

  actualizarFotoPerfil() {
    this.depServ.obtenerFotoPerfil(this.logServ.loggedUser.usuario.dni).subscribe({
      next: (response: any) => {
        console.log('Foto de perfil obtenida exitosamente', response);
        // Aquí puedes agregar lógica para manejar la foto de perfil obtenida
      },
      error: (e: any) => {
        console.error('Error al obtener la foto de perfil', e.error.error);
      }
    });
  }

  mostrarFotoPerfil() {
    this.depServ.obtenerFotoPerfil(this.logServ.loggedUser.usuario.dni).subscribe({
      next: (response: any) => {
        const fotoUrl = URL.createObjectURL(response);
        console.log('Foto de perfil mostrada exitosamente', fotoUrl);
        // Aquí puedes agregar lógica para mostrar la foto de perfil en la interfaz
      },
      error: (e: any) => {
        console.error('Error al mostrar la foto de perfil', e.error.error);
      }
    });
  }

  eliminarFotoPerfil() {
    this.depServ.eliminarFotoPerfil(this.logServ.loggedUser.usuario.dni).subscribe({
      next: (response: any) => {
        console.log('Foto de perfil eliminada exitosamente', response);
        // Aquí puedes agregar lógica para manejar la eliminación de la foto de perfil
      },
      error: (e: any) => {
        console.error('Error al eliminar la foto de perfil', e.error.error);
      }
    });
  }

  filterData() {
    this.dataSource.filter = this.filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
    this.dataSource.filterPredicate = (data: any, filter: string) => {
      const dataStr = JSON.stringify(data).toLowerCase();
      return dataStr.includes(filter);
    }
  }

}
