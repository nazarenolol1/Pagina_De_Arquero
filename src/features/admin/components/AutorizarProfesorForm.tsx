"use client";

import { useRef, useState, useTransition } from "react";
import { autorizarProfesor } from "@/features/admin/actions/autorizarProfesor";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

export function AutorizarProfesorForm() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setSuccess(null);
    startTransition(async () => {
      const resultado = await autorizarProfesor(formData);
      if (resultado.error) {
        setError(resultado.error);
      } else {
        setSuccess(resultado.success ?? "Listo.");
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
      <h3 className="font-heading text-2xl">Autorizar profesor</h3>
      <p className="text-sm text-foreground/60">
        La persona tiene que haberse registrado antes como arquero en
        /registro. Esto confirma su email y le cambia el rol.
      </p>
      <Input id="email" name="email" type="email" label="Email" required />
      {error && <p className="text-sm text-red-700">{error}</p>}
      {success && <p className="text-sm text-accent-secondary">{success}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Autorizando..." : "Autorizar como profesor"}
      </Button>
    </form>
  );
}
