import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/lib/supabase/types";

/**
 * Trae el perfil de un alumno por id. RLS ya garantiza que solo un
 * profesor puede leer perfiles que no son el propio.
 */
export async function getAlumnoPorId(id: string): Promise<Profile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .eq("role", "alumno")
    .single();

  if (error) return null;
  return data as Profile;
}
