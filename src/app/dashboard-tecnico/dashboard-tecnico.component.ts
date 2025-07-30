// dashboard-prof.component.ts (refactorizado con servicios existentes)
import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { HttpClientModule } from '@angular/common/http';
import { DeportistService } from '../services/deportist.service';
import { ElementosService } from '../services/elementos.service';
import { RouterModule } from '@angular/router';
import { DeportistComponent } from '../components/deportist/deportist.component';


@Component({
  selector: 'app-dashboard-tecnico',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule,
    MatTableModule,
    MatIconModule,
    HttpClientModule,
    RouterModule,
    DeportistComponent
  ],
  templateUrl: './dashboard-tecnico.component.html',
  styleUrls: ['./dashboard-tecnico.component.scss']
})
export class DashboardTecnicoComponent implements OnInit {

  private fb = inject(FormBuilder);
  private snackBar = inject(MatSnackBar);
  private deportistService = inject(DeportistService);
  private elementosService = inject(ElementosService);

  deportistas: any[] = [];
  elementos: any[] = [];
  evaluacionForm!: FormGroup;
  cargando = false;

  ngOnInit(): void {
    this.evaluacionForm = this.fb.group({
      deportistaId: [''],
      elementoId: [''],
      nota: ['']
    });

    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;
    this.deportistService.getAll().subscribe({
      next: (res) => this.deportistas = res,
      error: () => this.snackBar.open('Error al cargar deportistas', 'Cerrar', { duration: 3000 })
    });

    this.elementosService.getElementos().subscribe({
      next: (res) => this.elementos = res,
      error: () => this.snackBar.open('Error al cargar elementos técnicos', 'Cerrar', { duration: 3000 })
    });

    this.cargando = false;
  }

  evaluarElemento() {
    if (this.evaluacionForm.valid) {
      const data = this.evaluacionForm.value;
      this.deportistService.evaluarElemento(data).subscribe({
        next: () => {
          this.snackBar.open('Evaluación registrada correctamente', 'Cerrar', { duration: 3000 });
          this.evaluacionForm.reset();
        },
        error: () => {
          this.snackBar.open('Error al registrar evaluación', 'Cerrar', { duration: 3000 });
        }
      });
    }
  }
}
