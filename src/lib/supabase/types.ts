/**
 * Tipos que reflejan las tablas definidas en supabase/schema.sql.
 * Cuando el schema crezca, lo ideal es generar esto automáticamente con:
 *   npx supabase gen types typescript --project-id TU_PROJECT_ID > src/lib/supabase/types.ts
 * Por ahora están escritos a mano para arrancar rápido.
 */

export type Role = "alumno" | "profesor";

export interface Profile {
  id: string;
  role: Role;
  nombre_completo: string;
  avatar_url: string | null;
  created_at: string;
}

export type TipoArchivo = "video" | "foto" | "nota";

export interface Entrenamiento {
  id: string;
  alumno_id: string;
  profesor_id: string;
  titulo: string;
  descripcion: string | null;
  fecha: string;
  created_at: string;
}

export interface EntrenamientoArchivo {
  id: string;
  entrenamiento_id: string;
  tipo: TipoArchivo;
  url: string | null;
  contenido_texto: string | null;
  created_at: string;
}

export interface Estadistica {
  id: string;
  alumno_id: string;
  entrenamiento_id: string | null;
  fecha: string;
  atajadas: number;
  goles_recibidos: number;
  saques_exitosos: number;
  salidas_exitosas: number;
  minutos_jugados: number;
  notas: string | null;
  creado_por: string;
  created_at: string;
}
