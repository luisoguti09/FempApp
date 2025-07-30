export interface Usuario {
  id: number;
  nombre: string;
  edad: number;
  nivel: string;
  email: string;
  dni: string;
  rol: string;
  rolId: number;
  fotoPerfil?: string;
  aprobado?: boolean;
  dniFrente?: string;
  dniDorso?: string;
  fichaMedica?: string;
  documentacionAprobada?: boolean;
}
