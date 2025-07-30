import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {
  private apiUrl = environment.SERVER_API;
  private http = inject(HttpClient);

  // Obtener usuarios no aprobados
  getUsuariosPendientes(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuarios?aprobado=false`).pipe(
      catchError(err => {
        console.error('Error al cargar usuarios pendientes:', err);
        return of([]);
      })
    );
  }

  // Aprobar usuario por ID
  aprobarUsuario(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/usuarios/${id}/aprobar`, {}).pipe(
      catchError(err => {
        console.error('Error al aprobar usuario:', err);
        return of(null);
      })
    );
  }
}
