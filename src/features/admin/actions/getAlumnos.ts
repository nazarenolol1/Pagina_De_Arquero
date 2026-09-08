import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

/**
 * Lista todos los alumnos (arqueros) registrados.
 * Solo un profesor puede llamar esto con éxito (lo garantiza RLS).
 */
export async function getAlumnos(): Promise<Profile[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "alumno")
    .order("nombre_completo", { ascending: true });

  if (error) {
    console.error("Error al obtener alumnos:", error.message);
    return [];
  }

  return data as Profile[];
}
