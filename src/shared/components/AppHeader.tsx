import Link from "next/link";
import { logout } from "@/features/auth/actions/auth.actions";

export function AppHeader({ nombre }: { nombre: string }) {
  return (
    <header className="flex items-center justify-between px-6 md:px-16 py-5 border-b border-border">
      <Link href="/dashboard" className="font-heading text-3xl">
        Arqueros
      </Link>
      <div className="flex items-center gap-4">
        <span className="text-sm text-foreground/70 hidden sm:inline">
          {nombre}
        </span>
        <form action={logout}>
          <button className="text-sm underline underline-offset-2">
            Salir
          </button>
        </form>
      </div>
    </header>
  );
}
