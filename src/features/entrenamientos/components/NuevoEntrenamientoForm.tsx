"use client";

import { useRef, useState, useTransition } from "react";
import { crearEntrenamiento } from "@/features/entrenamientos/actions/crearEntrenamiento";
import { guardarArchivoEntrenamiento } from "@/features/entrenamientos/actions/guardarArchivoEntrenamiento";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

function tipoDeArchivo(file: File): "video" | "foto" | null {
  if (file.type.startsWith("video/")) return "video";
  if (file.type.startsWith("image/")) return "foto";
  return null;
}

function nombreSeguro(nombre: string) {
  return nombre.replace(/[^a-zA-Z0-9.\-_]/g, "_");
}

export function NuevoEntrenamientoForm({ alumnoId }: { alumnoId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [estado, setEstado] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setEstado(null);

    const archivos = (formData.getAll("archivos") as File[]).filter(
      (f) => f.size > 0
    );

    startTransition(async () => {
      const resultado = await crearEntrenamiento(alumnoId, formData);
      if (resultado.error || !resultado.entrenamientoId) {
        setError(resultado.error ?? "No se pudo crear la clase.");
        return;
      }
      const entrenamientoId = resultado.entrenamientoId;

      const erroresDeArchivos: string[] = [];

      for (let i = 0; i < archivos.length; i++) {
        const archivo = archivos[i];
        const tipo = tipoDeArchivo(archivo);

        if (!tipo) {
          erroresDeArchivos.push(`"${archivo.name}" no es video ni foto.`);
          continue;
        }

        setEstado(`Subiendo archivo ${i + 1} de ${archivos.length}...`);

        const path = `${alumnoId}/${entrenamientoId}/${crypto.randomUUID()}-${nombreSeguro(
          archivo.name
        )}`;

        const supabase = createClient();
        const { error: uploadError } = await supabase.storage
          .from("entrenamientos")
          .upload(path, archivo);

        if (uploadError) {
          erroresDeArchivos.push(`"${archivo.name}": ${uploadError.message}`);
          continue;
        }

        const guardado = await guardarArchivoEntrenamiento(
          entrenamientoId,
          alumnoId,
          tipo,
          path
        );
        if (guardado.error) erroresDeArchivos.push(guardado.error);
      }

      setEstado(null);

      if (erroresDeArchivos.length > 0) {
        setError(
          `La clase se guardó, pero hubo problemas con algunos archivos: ${erroresDeArchivos.join(
            " "
          )}`
        );
        return;
      }

      formRef.current?.reset();
    });
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="flex flex-col gap-4 max-w-md bg-surface border border-border p-6"
    >
      <h3 className="font-heading text-2xl">Cargar nueva clase</h3>
      <Input id="titulo" name="titulo" type="text" label="Título" required />
      <Input id="fecha" name="fecha" type="date" label="Fecha" required />
      <div className="flex flex-col gap-1.5">
        <label htmlFor="descripcion" className="text-sm text-foreground/70">
          Descripción (qué se trabajó en la clase)
        </label>
        <textarea
          id="descripcion"
          name="descripcion"
          rows={4}
          className="bg-surface border border-border px-4 py-2.5 outline-none focus:border-accent-secondary"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="archivos" className="text-sm text-foreground/70">
          Videos o fotos de la clase (opcional)
        </label>
        <input
          id="archivos"
          name="archivos"
          type="file"
          accept="video/*,image/*"
          multiple
          className="text-sm file:mr-3 file:px-3 file:py-1.5 file:border file:border-border file:bg-background file:text-sm"
        />
        <p className="text-xs text-foreground/50">Hasta 100MB por archivo.</p>
      </div>
      {estado && <p className="text-sm text-accent-secondary">{estado}</p>}
      {error && <p className="text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar clase"}
      </Button>
    </form>
  );
}
