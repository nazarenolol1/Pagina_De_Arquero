import { createClient } from "@/lib/supabase/server";
import type { Entrenamiento, EntrenamientoArchivo } from "@/lib/supabase/types";

export type ArchivoConUrl = EntrenamientoArchivo & { signedUrl: string | null };

export type EntrenamientoConArchivos = Entrenamiento & {
  entrenamiento_archivos: ArchivoConUrl[];
};

const BUCKET = "entrenamientos";
const EXPIRACION_SEGUNDOS = 60 * 60; // 1 hora

/**
 * Lista los entrenamientos de un alumno, del más reciente al más viejo.
 * RLS ya se encarga de que un alumno solo pueda pedir los suyos.
 * Como el bucket de Storage es privado, cada archivo (video/foto) se
 * devuelve con una URL firmada temporal en vez de la ruta cruda.
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

  const entrenamientos = data as (Entrenamiento & {
    entrenamiento_archivos: EntrenamientoArchivo[];
  })[];

  // Juntamos las rutas de Storage de TODOS los entrenamientos para pedir
  // las URLs firmadas en un solo viaje, en vez de uno por archivo.
  const paths = entrenamientos
    .flatMap((e) => e.entrenamiento_archivos)
    .filter((a) => a.tipo !== "nota" && a.url)
    .map((a) => a.url as string);

  const urlPorPath = new Map<string, string>();
  if (paths.length > 0) {
    const { data: firmadas } = await supabase.storage
      .from(BUCKET)
      .createSignedUrls(paths, EXPIRACION_SEGUNDOS);

    for (const f of firmadas ?? []) {
      if (f.path && f.signedUrl && !f.error) urlPorPath.set(f.path, f.signedUrl);
    }
  }

  return entrenamientos.map((e) => ({
    ...e,
    entrenamiento_archivos: e.entrenamiento_archivos.map((a) => ({
      ...a,
      signedUrl: a.url ? urlPorPath.get(a.url) ?? null : null,
    })),
  }));
}
