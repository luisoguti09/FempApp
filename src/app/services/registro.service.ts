import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Usuario } from '../interfaces/usuario';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class RegistroService {

  private apURL = environment.SERVER_API;
  private http = inject(HttpClient);

  buscar(dni: string): Observable<Usuario> {
  return this.http.get<Usuario>(`${this.apURL}/usuarios/${dni}`);
}
  guardar(
    nombre: string,
    edad: number,
    email: string,
    password: string,
    dni: string,         
    rolId: number
  ) {
    return this.http.post(`${this.apURL}/register`, {
      nombre,
      edad,
      email,
      password,
      dni,            
      rolId
    });
  }

  getRoles() {
    return this.http.get<any[]>(`${this.apURL}/roles`);
  }
}

