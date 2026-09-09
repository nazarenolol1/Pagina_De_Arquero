import { LoginForm } from "@/features/auth/components/LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <main className="flex-1 flex flex-col justify-center px-6 py-16 md:px-16">
      <h1 className="font-heading text-5xl md:text-6xl mb-8">Ingresar</h1>
      {error === "confirmacion" && (
        <p className="text-sm text-red-700 max-w-sm mb-4">
          El link de confirmación no es válido o ya venció. Probá iniciar
          sesión igual, o registrate de nuevo.
        </p>
      )}
      <LoginForm />
    </main>
  );
}
