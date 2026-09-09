"use client";

import { useRef, useState, useTransition } from "react";
import { crearEntrenamiento } from "@/features/entrenamientos/actions/crearEntrenamiento";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

export function NuevoEntrenamientoForm({ alumnoId }: { alumnoId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await crearEntrenamiento(alumnoId, formData);
      if (result.error) {
        setError(result.error);
      } else {
        formRef.current?.reset();
      }
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
      {error && <p className="text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar clase"}
      </Button>
    </form>
  );
}
