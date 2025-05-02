import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { RegistroService } from '../../services/registro.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { RegistroFastComponent } from '../registro-fast/registro-fast.component';


@Component({
  selector: 'app-registro',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    RouterOutlet,
    RouterLink,
    MatListModule,
    MatDividerModule,
    RegistroFastComponent
  ],
  templateUrl: './registro.component.html',
  styleUrl: './registro.component.scss'
})
export class RegistroComponent {

  public form!: FormGroup;


  private router = inject(Router);
  private fb = inject(FormBuilder);
  private regServ = inject(RegistroService);
  public empadronada: string = "";
  public pers: any;

  ngOnInit() {
    this.form = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      edad: new FormControl(0),
      nivel: new FormControl('', [Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPass: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required])
    });

  }

  verificarPass() {
    if (this.form?.get('password')?.value == this.form?.get('confirmPass')?.value) {
      return true;
    } else {
      error: (e: { error: { error: any; }; }) => {
        //mostrar mensaje de error sacandolo de error
        console.log(e.error.error);
      };
      return false;
    }
  }

  buscar() {
    this.regServ.buscar(this.form?.get('dni')?.value)
      .subscribe((res) => {
        this.pers = res;
        if (!!res) {
          this.empadronada = "EMPADRONADA";
        } else {
          this.empadronada = "NO_EMPADRONADA";
        }
      });
  }

  guardar() {
    if (this.empadronada == "NO_EMPADRONADA") {
      this.regServ.guardar(
        this.form?.get('nombre')?.value,
        this.form?.get('edad')?.value,
        this.form?.get('nivel')?.value,
        this.form?.get('email')?.value,
        this.form?.get('password')?.value,
        this.form?.get('dni')?.value,
      ).subscribe({
        next: (res) => {
          // token
          //this.router.navigate(['dashboard-deport']);
          // llamar a un metodo del servicio que guarde el token en localstorage
          console.log(res);
          this.router.navigate(['dashboard-deport']);
        },
        error: (e) => {
          //mostrar mensaje de error sacandolo de error
          console.log(e.error.error);
        }
      });
    }
  }




}

