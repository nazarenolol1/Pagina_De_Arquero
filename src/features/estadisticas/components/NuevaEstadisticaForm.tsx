"use client";

import { useRef, useState, useTransition } from "react";
import { crearEstadistica } from "@/features/estadisticas/actions/crearEstadistica";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

export function NuevaEstadisticaForm({ alumnoId }: { alumnoId: string }) {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await crearEstadistica(alumnoId, formData);
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
      <h3 className="font-heading text-2xl">Cargar estadística</h3>
      <Input id="fecha" name="fecha" type="date" label="Fecha" required />

      <div className="grid grid-cols-2 gap-4">
        <Input
          id="atajadas"
          name="atajadas"
          type="number"
          min={0}
          defaultValue={0}
          label="Atajadas"
        />
        <Input
          id="goles_recibidos"
          name="goles_recibidos"
          type="number"
          min={0}
          defaultValue={0}
          label="Goles recibidos"
        />
        <Input
          id="saques_exitosos"
          name="saques_exitosos"
          type="number"
          min={0}
          defaultValue={0}
          label="Saques exitosos"
        />
        <Input
          id="salidas_exitosas"
          name="salidas_exitosas"
          type="number"
          min={0}
          defaultValue={0}
          label="Salidas exitosas"
        />
      </div>

      <Input
        id="minutos_jugados"
        name="minutos_jugados"
        type="number"
        min={0}
        defaultValue={0}
        label="Minutos jugados"
      />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="notas" className="text-sm text-foreground/70">
          Notas
        </label>
        <textarea
          id="notas"
          name="notas"
          rows={3}
          className="bg-surface border border-border px-4 py-2.5 outline-none focus:border-accent-secondary"
        />
      </div>

      {error && <p className="text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Guardando..." : "Guardar estadística"}
      </Button>
    </form>
  );
}
