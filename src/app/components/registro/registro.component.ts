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
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


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
    RegistroFastComponent,
    MatSelectModule,
    MatProgressSpinnerModule
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
  public roles: any[] = [];
  public errorMsg: string = '';
  public successMsg: string = '';
  public cargando: boolean = false;



  ngOnInit() {
    this.form = this.fb.group({
      nombre: new FormControl('', [Validators.required]),
      edad: new FormControl(0),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      confirmPass: new FormControl('', [Validators.required]),
      dni: new FormControl('', [Validators.required]),
      rolId: new FormControl(null, [Validators.required])
    });

    this.regServ.getRoles().subscribe({
      next: res => this.roles = res,
      error: err => console.log('Error al obtener roles', err)
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
  this.errorMsg = '';
  this.successMsg = '';
  this.cargando = true;

  const esEmpadronada = this.empadronada !== 'NO_EMPADRONADA';

  const datos = {
    nombre: esEmpadronada ? this.pers?.apellidoYNombre : this.form.get('nombre')?.value,
    edad: esEmpadronada ? 14 : this.form.get('edad')?.value,
    email: this.form.get('email')?.value,
    password: this.form.get('password')?.value,
    dni: esEmpadronada ? this.pers?.documentoN : this.form.get('dni')?.value,
    rolId: this.form.get('rolId')?.value
  };

  console.log('📤 Datos a enviar en registro:', datos);

  this.regServ.guardar(
    datos.nombre,
    datos.edad,
    datos.email,
    datos.password,
    datos.dni,
    datos.rolId
  ).subscribe({
    next: (res) => {
      this.successMsg = 'Registro exitoso. Serás redirigido al login.';
      this.cargando = false;

      setTimeout(() => {
        this.successMsg = '';
        this.router.navigate(['']); 
      }, 2000);
    },
    error: (e) => {
      this.cargando = false;
      const mensaje = e?.error?.error || 'Ocurrió un error al registrar.';
      this.errorMsg = mensaje;
      console.error(mensaje);

      setTimeout(() => {
        this.errorMsg = '';
      }, 3000);
    }
  });
}




  /*guardar() {
    if (this.empadronada == "NO_EMPADRONADA") {
      this.regServ.guardar(
        this.form?.get('nombre')?.value,
        this.form?.get('edad')?.value,
        this.form?.get('nivel')?.value,
        this.form?.get('email')?.value,
        this.form?.get('password')?.value,
        this.pers?.documentoN || this.form?.get('dni')?.value,
        this.form?.get('rolId')?.value
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
    else {
      this.regServ.guardar(
        this.pers.apellidoYNombre,
        14,
        this.pers.categoria,
        this.form?.get('email')?.value,
        this.form?.get('password')?.value,
        this.pers?.documentoN || this.form?.get('dni')?.value,
        this.form?.get('rolId')?.value
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
  }*/




}

