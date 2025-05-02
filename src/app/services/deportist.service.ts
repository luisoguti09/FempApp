import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Deportist } from '../interfaces/deportist';
import { catchError, map, tap } from "rxjs/operators";
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DeportistService {

  private apURL = environment.SERVER_API;
  private http = inject(HttpClient);

  mostrarDeportist() {
    return this.http.get(`${this.apURL}/padron`);
  }

  getDeportistas(): Observable<Deportist[]> {
    return this.http.get<Deportist[]>(`${this.apURL}/padron`)
      .pipe(
        tap(data => {
          console.log('Datos recibidos:', data);
        }),
        catchError(error => {
          console.error('Error al obtener deportistas:', error);
          return of([]);
        })
      );
  }

  buscarDni(dni: string) {
    return this.http.get(`${this.apURL}/padron/${dni}`);
  }

  addDeportist(deportist: Deportist): Observable<Deportist> {
    return this.http.post<Deportist>(`${this.apURL}/padron`, deportist);
  }

  updateDeportist(deportist: Deportist): Observable<Deportist> {
    return this.http.put<Deportist>(`${this.apURL}/padron`, deportist);
  }

  deleteDeportist(id: number): Observable<Deportist> {
    return this.http.delete<Deportist>(`${this.apURL}/padron/${id}`);
  }

  getDeportistById(id: number): Observable<Deportist[]> {
    return this.http.get<Deportist[]>(`${this.apURL}/padron?id=${id}`);
  }

  getDeportistByDni(dni: string): Observable<Deportist[]> {
    return this.http.get<Deportist[]>(`${this.apURL}/padron?dni=${dni}`);
  }

  getDeportistByNombre(nombre: string): Observable<Deportist[]> {
    return this.http.get<Deportist[]>(`${this.apURL}/padron?nombre=${nombre}`);
  }

  getDeportistByApellidos(apellidos: string): Observable<Deportist[]> {
    return this.http.get<Deportist[]>(`${this.apURL}/padron?apellidos=${apellidos}`);
  }

  subirFotoPerfil(id: number, formData: FormData): Observable<any> {
    return this.http.post(`${this.apURL}/padron/${id}/upload`, formData)
      .pipe(
        tap(response => {
          console.log('Foto de perfil cargada:', response);
        }),
        catchError(error => {
          console.error('Error al cargar la foto de perfil:', error);
          return of(null);
        })
      );
  }

  obtenerFotoPerfil(id: number): Observable<any> {
    return this.http.get(`${this.apURL}/padron/${id}/profile-picture`);
  }

  eliminarFotoPerfil(id: number): Observable<any> {
    return this.http.delete(`${this.apURL}/padron/${id}/profile-picture`)
      .pipe(
        tap(response => {
          console.log('Foto de perfil eliminada:', response);
        }),
        catchError(error => {
          console.error('Error al eliminar la foto de perfil:', error);
          return of(null);
        })
      );
  }




}
