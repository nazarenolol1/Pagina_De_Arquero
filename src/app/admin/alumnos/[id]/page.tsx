import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { getPerfil } from "@/features/arqueros/actions/getPerfil";
import { getAlumnoPorId } from "@/features/admin/actions/getAlumnoPorId";
import { getEntrenamientos } from "@/features/entrenamientos/actions/getEntrenamientos";
import { EntrenamientoCard } from "@/features/entrenamientos/components/EntrenamientoCard";
import { NuevoEntrenamientoForm } from "@/features/entrenamientos/components/NuevoEntrenamientoForm";
import { AppHeader } from "@/shared/components/AppHeader";

export default async function AlumnoDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const perfil = await getPerfil();

  if (!perfil) redirect("/login");
  if (perfil.role !== "profesor") redirect("/dashboard");

  const alumno = await getAlumnoPorId(id);
  if (!alumno) notFound();

  const entrenamientos = await getEntrenamientos(alumno.id);

  return (
    <>
      <AppHeader nombre={perfil.nombre_completo} />
      <main className="flex-1 px-6 md:px-16 py-12">
        <Link
          href="/admin"
          className="text-sm underline underline-offset-2 text-foreground/60"
        >
          ← Mis arqueros
        </Link>
        <h1 className="font-heading text-5xl md:text-6xl mt-4 mb-10">
          {alumno.nombre_completo}
        </h1>

        <div className="grid md:grid-cols-2 gap-12">
          <NuevoEntrenamientoForm alumnoId={alumno.id} />

          <div>
            <h2 className="font-heading text-3xl mb-6">Historial de clases</h2>
            <div className="flex flex-col gap-8">
              {entrenamientos.length === 0 && (
                <p className="text-foreground/60">
                  Todavía no hay clases cargadas para este alumno.
                </p>
              )}
              {entrenamientos.map((entrenamiento) => (
                <EntrenamientoCard
                  key={entrenamiento.id}
                  entrenamiento={entrenamiento}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
