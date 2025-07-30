import { Component, inject, OnInit } from '@angular/core';
import { Evento } from '../../interfaces/evento';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { EventosService } from '../../services/eventos.service';
import { MatCard, MatCardActions } from '@angular/material/card';
import { MatCardModule } from '@angular/material/card';
import { FormControl, Validators, FormsModule, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog';


import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DialogsComponent } from '../dialogs/dialogs.component';
import { LoginService } from '../../services/login.service';
// import { showAthleteRegistro } from '../dialogs/dialogs.component';

@Component({
  selector: 'app-evento-detail',
  standalone: true,
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    RouterLink,
    RouterOutlet,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatSelectModule,
    MatToolbarModule,

  ],
  templateUrl: './evento-detail.component.html',
  styleUrl: './evento-detail.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class EventoDetailComponent implements OnInit {

  public evento!: Evento;
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private eventServ = inject(EventosService);
  //public chartType: ChartType = 'bar'; // o 'line', 'pie', etc.
  public chartData: any[] = [];
  public chartLabels: string[] = [];
  public chartOptions: any = {};
  public form!: FormGroup;
  public displayedColumns: string[] = ['id', 'nombre', 'fecha', 'hora', 'lugar', 'acciones'];
  public deportistasInscritos: any[] = [];
  public eventos: Evento[] = [];
  public deportistas: any[] = [];
  injectedRoute = inject(ActivatedRoute);
  private logServ = inject(LoginService);
  private matDialog = inject(MatDialog);
  constructor() { }



  ngOnInit(): void {
    this.injectedRoute.params.subscribe(params => {
      this.mostrarEventoById(params['evento']);
      this.formularioInscripcion();
    });
    this.mostrarTodosEventos();
    this.getDeportistasInscritos(this.evento?.id);

  }

  mostrarEventoById(id: number) {
    console.log(id, 'hola esta prueba de console');

    this.eventServ.getEventoById(id).subscribe({
      next: (eventos: any) => {
        this.evento = eventos.find((evento: Evento) => evento.id == id);
        this.getDeportistasInscritos(this.evento.id);
        console.log(this.evento);
      },
      error: (error: any) => {
        console.error('Error fetching event:', error);
      }
    });
  }

  mostrarTodosEventos() {
    this.eventServ.getEventos().subscribe({
      next: (eventos: Evento[]) => {
        this.eventos = eventos;
      },
      error: (error: any) => {
        console.error('Error fetching events:', error);
      }
    });
  }

  crearEvento() {
    this.evento.fechaInscripcion = new Date();
    this.eventServ.addEvento(this.evento).subscribe({
      next: (evento: Evento) => {
        console.log('Evento creado con fecha de inscripción:', evento);
      },
      error: (error: any) => {
        console.error('Error creando evento:', error);
      }
    });
  }

  actualizarEvento() {
    this.eventServ.updateEvento(this.evento).subscribe({
      next: (evento: Evento) => {
        console.log('Evento actualizado:', evento);
      },
      error: (error: any) => {
        console.error('Error actualizando evento:', error);
      }
    });
  }

  verDetalleEvento(id: number) {
    this.router.navigate(['/evento-detail', id]);
  }


  // Método para inscribirse a un evento

  /*inscribirseEvento(eventoId: number, deportistaId: number) {
  this.eventServ.inscribirDeportista(eventoId, deportistaId).subscribe({
    next: (response: any) => {
      this.matDialog.open(DialogsComponent, {
        data: { success: true }
      });
      this.router.navigate(['/dashboard-deport']);
    },
    error: (error: any) => {
      console.error('Error al inscribirte al evento:', error);
      this.matDialog.open(DialogsComponent, {
        data: { success: false }
      });
      this.router.navigate(['/dashboard-deport']);
    }
  });
}*/

  inscribirseEvento() {
    const usuario = this.logServ.loggedUser?.usuario;
    const yaInscripto = this.deportistasInscritos.some(dep => dep.id === usuario.id);
    if (yaInscripto) {
      this.abrirDialogo(false);
      return;
    }
    this.eventServ.inscribirDeportista(this.evento.id, usuario.id).subscribe({
      next: () => {
        this.abrirDialogo(true);
      },
      error: () => {
        this.abrirDialogo(false);
      }
    });
  }

  abrirDialogo(success: boolean): void {
    this.matDialog.open(DialogsComponent, {
      data: { success },
      panelClass: 'custom-dialog-panel'
    });

    setTimeout(() => {
      this.matDialog.closeAll();
      this.router.navigate(['/dashboard-deport']);
    }, 3000);
  }



  eliminarEvento(id: number) {
    this.eventServ.deleteEvento(id).subscribe({
      next: (evento: Evento) => {
        console.log('Evento eliminado:', evento);
      },
      error: (error: any) => {
        console.error('Error eliminando evento:', error);
      }
    });
  }

  volver() {
    this.router.navigate(['/dashboard-deport']);
  }

  formularioInscripcion() {
    this.form = this.fb.group({
      eventoId: ['', Validators.required],
      deportistaId: ['', Validators.required]
    });
  }

  onSubmitInscripcion() {
    this.inscribirseEvento();
  }

  /*getDeportistasInscritos(eventoId: number) {
    this.eventServ.getEventoById(eventoId).subscribe({
      next: (evento: any) => {
        this.deportistasInscritos = evento[0].deportistas;
        console.log(this.deportistasInscritos);
      },
      error: (error: any) => {
        console.error('Error fetching event:', error);
      }
    });
  }*/

  getDeportistasInscritos(eventoId: number) {
    this.eventServ.getDeportistasInscriptos(eventoId).subscribe({
      next: (usuarios: any[]) => {
        this.deportistasInscritos = usuarios;
        console.log('Inscriptos:', usuarios);
      },
      error: (error: any) => {
        console.error('Error obteniendo inscriptos:', error);
      }
    });
  }


}
