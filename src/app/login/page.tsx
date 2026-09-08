import { LoginForm } from "@/features/auth/components/LoginForm";

export default function LoginPage() {
  return (
    <main className="flex-1 flex flex-col justify-center px-6 py-16 md:px-16">
      <h1 className="font-heading text-5xl md:text-6xl mb-8">Ingresar</h1>
      <LoginForm />
    </main>
  );
}
