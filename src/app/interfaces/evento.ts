import { Deportist } from "./deportist";

export interface Evento {
    id: number;
    nombre: string;
    descripcion: string;
    fecha: Date;
    fechaInscripcion: Date;
    lugar: string;
    deportistas: Deportist[]; // Array de objetos Patinador
  }