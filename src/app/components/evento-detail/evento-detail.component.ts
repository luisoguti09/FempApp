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


@Component({
  selector: 'app-evento-detail',
  standalone: true,
  imports: [
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
    MatSelectModule
  ],
  templateUrl: './evento-detail.component.html',
  styleUrl: './evento-detail.component.scss'
})
export class EventoDetailComponent implements OnInit {
  
  public evento!: Evento;
  private router = inject (Router);
  private fb = inject(FormBuilder);
  private eventServ = inject(EventosService);
  //public chartType: ChartType = 'bar'; // o 'line', 'pie', etc.
  public chartData: any[] = [];
  public chartLabels: string[] = [];
  public chartOptions: any = {};
  public form!: FormGroup;
  public displayedColumns: string[] = ['id', 'nombre', 'fecha', 'hora', 'lugar', 'acciones'];
  public deportistasInscritos: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.mostrarEventoById(1);
    this.formularioInscripcion();
  }

  mostrarEventoById(id: number){
    this.eventServ.getEventoById(id).subscribe({
      next: (evento: any) => {
      this.evento = evento[0];
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
        console.log(eventos);
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

  inscribirseEvento(eventoId: number, deportistaId: number) {
    this.eventServ.inscribirDeportista(eventoId, deportistaId).subscribe({
      next: (response: any) => {
        console.log('Te has inscripto al evento:', response);
      },
      error: (error: any) => {
        console.error('Error al inscribirte al evento:', error);
      }
    });
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
    if (this.form.valid) {
      const { eventoId, deportistaId } = this.form.value;
      this.inscribirseEvento(eventoId, deportistaId);
    } else {
      console.error('Formulario inválido');
    }
  }

  getDeportistasInscritos(eventoId: number) {
    this.eventServ.getEventoById(eventoId).subscribe({
      next: (evento: any) => {
        this.deportistasInscritos = evento[0].deportistas;
        console.log(this.deportistasInscritos);
      },
      error: (error: any) => {
        console.error('Error fetching event:', error);
      }
    });
  }


  
}
