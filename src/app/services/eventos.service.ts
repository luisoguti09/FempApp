import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, Observable, of, tap } from 'rxjs';
import { Evento } from '../interfaces/evento';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EventosService {
  
  private apURL = environment.SERVER_API;
  private http = inject(HttpClient);

  getEventos(): Observable<Evento[]> {
     return this.http.get<Evento[]>(`${this.apURL}/eventos`)
            .pipe(
              tap(data => {
                console.log('Datos recibidos:', data);
              }),
              catchError(error => {
                console.error('Error al obtener eventos:', error);
                return of([]);
              })
            );
  }

  getEventoById(id: number): Observable<Evento[]> {
    return this.http.get<Evento[]>(`${this.apURL}/eventos?id=${id}`);
    
  }

  addEvento(evento: Evento): Observable<Evento> {
    return this.http.post<Evento>(`${this.apURL}/eventos`, evento);
  } 

  updateEvento(evento: Evento): Observable<Evento> {
    return this.http.put<Evento>(`${this.apURL}/eventos`, evento);
  }

  deleteEvento(id: number): Observable<Evento> {
    return this.http.delete<Evento>(`${this.apURL}/eventos/${id}`);
  }

  inscribirDeportista(eventoId: number, usuarioId: number): Observable<any> {
  const payload = { usuarioId };
  return this.http.post<any>(`${this.apURL}/eventos/${eventoId}/inscribir`, payload);
}

getEventosDelUsuario(usuarioDni: number): Observable<Evento[]> {
  return this.http.get<Evento[]>(`${this.apURL}/usuarios/${usuarioDni}/eventos`);
}


getEventosDelPatinador(dni: string): Observable<Evento[]> {
  return this.http.get<Evento[]>(`${this.apURL}/usuarios/${dni}/eventos`);
}

getDeportistasInscriptos(eventoId: number) {
  return this.http.get<any[]>(`${this.apURL}/${eventoId}/usuarios`);
}

  

}

