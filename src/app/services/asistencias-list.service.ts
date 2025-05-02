import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AsistenciasListService {

  constructor() { }

  getAsistencias(): string[] {
    return ['Asistencia 1', 'Asistencia 2', 'Asistencia 3'];
  }
}
