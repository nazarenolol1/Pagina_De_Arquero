import { createClient } from "@/lib/supabase/server";
import type { Entrenamiento, EntrenamientoArchivo } from "@/lib/supabase/types";

export type EntrenamientoConArchivos = Entrenamiento & {
  entrenamiento_archivos: EntrenamientoArchivo[];
};

/**
 * Lista los entrenamientos de un alumno, del más reciente al más viejo.
 * RLS ya se encarga de que un alumno solo pueda pedir los suyos.
 */
export async function getEntrenamientos(
  alumnoId: string
): Promise<EntrenamientoConArchivos[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("entrenamientos")
    .select("*, entrenamiento_archivos(*)")
    .eq("alumno_id", alumnoId)
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error al obtener entrenamientos:", error.message);
    return [];
  }

  return data as EntrenamientoConArchivos[];
}
