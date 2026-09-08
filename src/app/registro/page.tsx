import { RegisterForm } from "@/features/auth/components/RegisterForm";

export default function RegistroPage() {
  return (
    <main className="flex-1 flex flex-col justify-center px-6 py-16 md:px-16">
      <h1 className="font-heading text-5xl md:text-6xl mb-8">Crear cuenta</h1>
      <RegisterForm />
    </main>
  );
}
