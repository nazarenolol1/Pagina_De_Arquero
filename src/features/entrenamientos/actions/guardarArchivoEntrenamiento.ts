"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { TipoArchivo } from "@/lib/supabase/types";

export interface GuardarArchivoResult {
  error: string | null;
}

/**
 * Registra en `entrenamiento_archivos` un archivo que el cliente ya subió
 * directamente a Supabase Storage (el archivo en sí NO pasa por acá, solo
 * su ruta, para no toparnos con límites de tamaño de las Server Actions).
 */
export async function guardarArchivoEntrenamiento(
  entrenamientoId: string,
  alumnoId: string,
  tipo: TipoArchivo,
  path: string
): Promise<GuardarArchivoResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tenés que estar logueado." };
  }

  const { data: perfil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (perfil?.role !== "profesor") {
    return { error: "Solo un profesor puede adjuntar archivos." };
  }

  const { error } = await supabase.from("entrenamiento_archivos").insert({
    entrenamiento_id: entrenamientoId,
    tipo,
    url: path,
  });

  if (error) {
    return { error: "No se pudo guardar el archivo. " + error.message };
  }

  revalidatePath(`/admin/alumnos/${alumnoId}`);
  revalidatePath("/dashboard");
  return { error: null };
}
