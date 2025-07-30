import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';
import { Observable, of } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { PerfilEditable } from '../interfaces/PerfilEditable';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiURL = environment.SERVER_API;
  private http = inject(HttpClient);
  private router = inject(Router);
  private usuario: any;
  private tokenKey = 'auth_token';
  private rolKey = 'user_rol';
  public loggedUser: any = null;

  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/auth/login`, { email, password }).pipe(
      tap((res) => {
        if (res.token && res.rolId) {
          localStorage.setItem(this.tokenKey, res.token);
          localStorage.setItem(this.rolKey, res.rolId);
          localStorage.setItem('usuario', JSON.stringify(res.usuario));

          this.loggedUser = res.usuario;
        }
      }),
      catchError(err => {
        console.error('Error en login', err);
        return of(null);
      })
    );
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.rolKey);
    this.loggedUser = null;
    this.router.navigate(['/login']);
  }

  setUsuario(usuario: any) {
    this.usuario = usuario;
    localStorage.setItem('usuario', JSON.stringify(usuario)); // opcional
  }

  getUsuario(): any {
  if (!this.loggedUser) {
    const usuarioGuardado = localStorage.getItem('usuario');
    if (usuarioGuardado) {
      try {
        const parsed = JSON.parse(usuarioGuardado);
        if (parsed?.dni) {
          this.loggedUser = parsed;
        } else {
          return null;
        }
      } catch {
        return null;
      }
    }
  }
  return this.loggedUser?.dni ? this.loggedUser : null;
}




  updatePerfilUsuario(payload: PerfilEditable) {
    const dni = payload.dni;
    return this.http.put(`${this.apiURL}/usuarios/${dni}/perfil`, payload);
  }

  getPerfilUsuario(dni: string): Observable<PerfilEditable> {
    return this.http.get<PerfilEditable>(`${this.apiURL}/usuarios/${dni}/perfil`);
  }


  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.tokenKey);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  getRol(): string | null {
    return localStorage.getItem(this.rolKey);
  }


  hasRole(roles: string[]): boolean {
    const rol = this.getRol();
    return rol !== null && roles.includes(rol);
  }
}

