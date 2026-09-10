"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CrearEntrenamientoResult {
  error: string | null;
  entrenamientoId?: string;
}

/**
 * Crea un entrenamiento (clase) para un alumno.
 * La RLS de "entrenamientos" ya exige rol profesor para insertar, pero
 * además chequeamos acá para poder devolver un mensaje de error claro
 * en vez de que la inserción falle en silencio contra la base.
 */
export async function crearEntrenamiento(
  alumnoId: string,
  formData: FormData
): Promise<CrearEntrenamientoResult> {
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
    return { error: "Solo un profesor puede cargar clases." };
  }

  const titulo = String(formData.get("titulo") || "").trim();
  const descripcion = String(formData.get("descripcion") || "").trim();
  const fecha = String(formData.get("fecha") || "");

  if (!titulo) {
    return { error: "El título de la clase es obligatorio." };
  }

  const { data: nuevoEntrenamiento, error } = await supabase
    .from("entrenamientos")
    .insert({
      alumno_id: alumnoId,
      profesor_id: user.id,
      titulo,
      descripcion: descripcion || null,
      fecha: fecha || new Date().toISOString().slice(0, 10),
    })
    .select("id")
    .single();

  if (error) {
    return { error: "No se pudo guardar la clase. " + error.message };
  }

  revalidatePath(`/admin/alumnos/${alumnoId}`);
  return { error: null, entrenamientoId: nuevoEntrenamiento.id };
}
