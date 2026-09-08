"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { login } from "@/features/auth/actions/auth.actions";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";

export function LoginForm() {
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function handleSubmit(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const result = await login(formData);
      if (result?.error) setError(result.error);
    });
  }

  return (
    <form action={handleSubmit} className="flex flex-col gap-4 max-w-sm w-full">
      <Input id="email" name="email" type="email" label="Email" required />
      <Input
        id="password"
        name="password"
        type="password"
        label="Contraseña"
        required
      />
      {error && <p className="text-sm text-red-700">{error}</p>}
      <Button type="submit" disabled={isPending}>
        {isPending ? "Ingresando..." : "Ingresar"}
      </Button>
      <p className="text-sm text-foreground/70">
        ¿No tenés cuenta?{" "}
        <Link href="/registro" className="underline underline-offset-2">
          Registrate
        </Link>
      </p>
    </form>
  );
}
