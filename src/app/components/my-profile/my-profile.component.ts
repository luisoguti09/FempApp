import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DeportistService } from '../../services/deportist.service';
import { PerfilEditable } from '../../interfaces/PerfilEditable';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { EventosService } from '../../services/eventos.service';
import { Router } from '@angular/router';
import { Evento } from '../../interfaces/evento';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-my-profile',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatDividerModule
    
  ],
  templateUrl: './my-profile.component.html',
  styleUrl: './my-profile.component.scss'
})
export class MyProfileComponent implements OnInit {

  public form!: FormGroup;
  public empadronada: 'EMPADRONADA' | 'NO_EMPADRONADA' = 'NO_EMPADRONADA';
  public usuario: any;
  public pers: any;
  public eventosInscritos: Evento[] = [];

  readonly snackBar = inject(MatSnackBar);

  private deportistService = inject(DeportistService);
  private eventosService = inject(EventosService);
  private router = inject(Router);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);

  constructor() { }

  ngOnInit(): void {
    this.usuario = this.authService.getUsuario();
    this.initForm();
    if (this.usuario?.dni) {
      this.cargarEventosInscriptos(this.usuario.dni);
      this.buscarEnPadron(this.usuario.dni);
    }
    console.log('✅ MyProfileComponent inicializado');
  }

  initForm(): void {
    this.form = this.fb.group({
      email: [{ value: '', disabled: true }],
      dni: [{ value: '', disabled: true }],
      nombre: [{ value: '', disabled: true }],
      club: [''],
      categoria: [''],
      nivel: [''],
      domicilio: [''],
      telefono: [''],
      fechaNacimiento: [''],
      instagram: [''],
      facebook: [''],
      tiktok: ['']
    });

  }

  cargarEventosInscriptos(dni: number): void {
  this.eventosService.getEventosDelUsuario(dni).subscribe({
    next: (eventos) => {
      this.eventosInscritos = eventos;
      console.log('Eventos inscriptos cargados en perfil:', eventos);
    },
    error: (err) => {
      console.error('Error al cargar eventos inscriptos:', err);
    }
  });
}

  buscarEnPadron(dni: string): void {
    this.deportistService.getDeportistByDni(dni).subscribe((res) => {
      if (res?.length > 0) {
        this.empadronada = 'EMPADRONADA';
        this.pers = res[0];
        this.form.patchValue({
          email: this.usuario.email,
          dni: dni,
          nombre: this.usuario.nombre,
          club: this.pers.club,
          categoria: this.pers.categoria,
          nivel: this.pers.nivel,
          domicilio: this.pers.domicilio,
          telefono: this.pers.telefono
        });
      } else {
        this.empadronada = 'NO_EMPADRONADA';
        this.form.patchValue({
          email: this.usuario.email,
          dni: this.usuario.dni,
          nombre: this.usuario.nombre,
          club: this.pers?.club || '',
          categoria: this.pers?.categoria || '',
          nivel: this.pers?.nivel || '',
          domicilio: this.pers?.domicilio || '',
          telefono: this.pers?.telefono || '',
          fechaNacimiento: this.pers?.fechaNacimiento || '',
          instagram: this.pers?.instagram || '',
          facebook: this.pers?.facebook || '',
          tiktok: this.pers?.tiktok || ''
        });
      }
    });
  }

  guardar(): void {
  const payload: PerfilEditable = {
    dni: this.usuario.dni,
    club: this.form.value.club,
    categoria: this.form.value.categoria,
    nivel: this.form.value.nivel,
    domicilio: this.form.value.domicilio,
    telefono: this.form.value.telefono,
    fechaNacimiento: this.form.value.fechaNacimiento,
    instagram: this.form.value.instagram,
    facebook: this.form.value.facebook,
    tiktok: this.form.value.tiktok
  };

  this.authService.updatePerfilUsuario(payload).subscribe({
    next: () => {
      this.snackBar.open('Datos actualizados correctamente', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['snackbar-success'] // opcional, para estilos
      });
    },
    error: () => {
      this.snackBar.open('Error al actualizar los datos', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['snackbar-error'] // opcional
      });
    }
  });
}

onFileSelected(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('fotoPerfil', file);

  this.deportistService.subirFotoPerfil(this.usuario.dni, formData).subscribe({
    next: (res) => {
      this.usuario.fotoPerfil = res.url; // 🔥 refresca imagen automáticamente
      this.snackBar.open('✅ Foto de perfil actualizada', 'Cerrar', { duration: 3000 });
    },
    error: () => this.snackBar.open('❌ Error al subir foto', 'Cerrar', { duration: 3000 })
  });
}

triggerFileInput() {
  const fileInput = document.getElementById('fileInput') as HTMLInputElement;
  fileInput?.click();
}

trackById(_: number, e: Evento) { return e.id; }

cambiarFotoPerfil() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = (event: any) => {
    const file = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('fotoPerfil', file);
      this.deportistService.subirFotoPerfil(this.usuario.dni, formData).subscribe({
        next: (res) => {
          this.snackBar.open('✅ Foto actualizada', 'Cerrar', { duration: 3000 });
          this.usuario.fotoPerfil = res.url; // refresca la imagen
        },
        error: () => this.snackBar.open('❌ Error al subir foto', 'Cerrar', { duration: 3000 })
      });
    }
  };
  input.click();
}

}


