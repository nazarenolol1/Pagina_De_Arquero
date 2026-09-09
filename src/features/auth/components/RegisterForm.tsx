"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { signup } from "@/features/auth/actions/auth.actions";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

export function RegisterForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await signup(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4 max-w-sm w-full">
      <Input
        id="nombre_completo"
        name="nombre_completo"
        type="text"
        label="Nombre completo"
        required
      />
      <Input id="email" name="email" type="email" label="Email" required />
      <Input
        id="password"
        name="password"
        type="password"
        label="Contraseña"
        minLength={8}
        pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).{8,}"
        title="Mínimo 8 caracteres, con una mayúscula, una minúscula y un número."
        required
      />
      <p className="text-xs text-foreground/60 -mt-2">
        Mínimo 8 caracteres, con una mayúscula, una minúscula y un número.
      </p>
      <p className="text-xs text-foreground/60">
        Esta cuenta se crea como <strong>arquero</strong>. Si sos entrenador,
        pedile a la administración que te dé acceso.
      </p>

      {error && <p className="text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Creando cuenta..." : "Crear cuenta"}
      </Button>
      <p className="text-sm text-foreground/70">
        ¿Ya tenés cuenta?{" "}
        <Link href="/login" className="underline underline-offset-2">
          Ingresá
        </Link>
      </p>
    </form>
  );
}
