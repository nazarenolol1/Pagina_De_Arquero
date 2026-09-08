import Link from "next/link";
import type { Profile } from "@/lib/supabase/types";

export function ListaAlumnos({ alumnos }: { alumnos: Profile[] }) {
  if (alumnos.length === 0) {
    return (
      <p className="text-foreground/60">
        Todavía no hay arqueros registrados en la plataforma.
      </p>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-border">
      {alumnos.map((alumno) => (
        <li key={alumno.id}>
          <Link
            href={`/admin/alumnos/${alumno.id}`}
            className="flex items-center justify-between py-4 hover:text-accent-secondary"
          >
            <span className="font-heading text-2xl">
              {alumno.nombre_completo}
            </span>
            <span className="text-sm text-foreground/60">Ver perfil →</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
