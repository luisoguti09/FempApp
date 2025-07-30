import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-documentacion',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './documentacion.component.html',
  styleUrl: './documentacion.component.scss'
})
export class DocumentacionComponent {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  public form!: FormGroup;
  public previews: { [key: string]: string | ArrayBuffer | null } = {};
  public cargando: boolean = false;
  public successMsgDoc: string = '';
  public errorMsgDoc: string = '';
  private apiUrl = environment.SERVER_API;

  ngOnInit() {
    this.form = this.fb.group({
      dniFrente: [null],
      dniDorso: [null],
      fichaMedica: [null]
    });
  }

  onFileChange(event: any, field: string) {
    const file = event.target.files[0];
    if (file) {
      this.form.patchValue({ [field]: file });

      const reader = new FileReader();
      reader.onload = () => {
        this.previews[field] = reader.result;
      };
      reader.readAsDataURL(file);
    }
  }

  isImage(file: any): boolean {
    return typeof file === 'string' && file.startsWith('data:image');
  }

  isPDF(file: any): boolean {
    return typeof file === 'string' && file.startsWith('data:application/pdf');
  }

  subirDocumentos() {
    this.successMsgDoc = '';
    this.errorMsgDoc = '';
    this.cargando = true;

    const formData = new FormData();
    Object.keys(this.form.value).forEach(key => {
      if (this.form.value[key]) {
        formData.append(key, this.form.value[key]);
      }
    });

    const usuarioId = localStorage.getItem('usuarioId');

    if (!usuarioId) {
      this.errorMsgDoc = 'Usuario no identificado';
      this.cargando = false;
      return;
    }

    this.http.put(`${this.apiUrl}/documentacion/${usuarioId}`, formData).subscribe({
      next: () => {
        this.successMsgDoc = 'Documentación subida correctamente.';
        this.cargando = false;
        setTimeout(() => this.successMsgDoc = '', 3000);
      },
      error: () => {
        this.errorMsgDoc = 'Error al subir la documentación.';
        this.cargando = false;
        setTimeout(() => this.errorMsgDoc = '', 3000);
      }
    });
  }
}

