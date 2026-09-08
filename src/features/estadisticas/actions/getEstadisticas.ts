import { createClient } from "@/lib/supabase/server";
import type { Estadistica } from "@/lib/supabase/types";

/**
 * Lista las estadísticas de un alumno, de la más reciente a la más vieja.
 */
export async function getEstadisticas(alumnoId: string): Promise<Estadistica[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("estadisticas")
    .select("*")
    .eq("alumno_id", alumnoId)
    .order("fecha", { ascending: false });

  if (error) {
    console.error("Error al obtener estadísticas:", error.message);
    return [];
  }

  return data as Estadistica[];
}
