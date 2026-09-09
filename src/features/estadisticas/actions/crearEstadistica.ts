"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export interface CrearEstadisticaResult {
  error: string | null;
}

const CAMPOS_NUMERICOS = [
  "atajadas",
  "goles_recibidos",
  "saques_exitosos",
  "salidas_exitosas",
  "minutos_jugados",
] as const;

/**
 * Crea un registro de estadísticas para un alumno.
 * La RLS de "estadisticas" ya exige rol profesor para insertar, pero
 * chequeamos acá también para devolver un mensaje de error claro.
 */
export async function crearEstadistica(
  alumnoId: string,
  formData: FormData
): Promise<CrearEstadisticaResult> {
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
    return { error: "Solo un profesor puede cargar estadísticas." };
  }

  const valores: Record<string, number> = {};
  for (const campo of CAMPOS_NUMERICOS) {
    const valor = Number(formData.get(campo) || 0);
    if (!Number.isFinite(valor) || valor < 0) {
      return { error: `El valor de "${campo.replace("_", " ")}" no es válido.` };
    }
    valores[campo] = valor;
  }

  const fecha = String(formData.get("fecha") || "");
  const notas = String(formData.get("notas") || "").trim();

  const { error } = await supabase.from("estadisticas").insert({
    alumno_id: alumnoId,
    creado_por: user.id,
    fecha: fecha || new Date().toISOString().slice(0, 10),
    notas: notas || null,
    ...valores,
  });

  if (error) {
    return { error: "No se pudo guardar la estadística. " + error.message };
  }

  revalidatePath(`/admin/alumnos/${alumnoId}`);
  revalidatePath("/dashboard");
  return { error: null };
}
