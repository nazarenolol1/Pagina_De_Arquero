import { redirect } from "next/navigation";
import { getPerfil } from "@/features/arqueros/actions/getPerfil";
import { getEntrenamientos } from "@/features/entrenamientos/actions/getEntrenamientos";
import { getEstadisticas } from "@/features/estadisticas/actions/getEstadisticas";
import { EntrenamientoCard } from "@/features/entrenamientos/components/EntrenamientoCard";
import { EstadisticasResumen } from "@/features/estadisticas/components/EstadisticasResumen";
import { AppHeader } from "@/shared/components/AppHeader";

export default async function DashboardPage() {
  const perfil = await getPerfil();

  if (!perfil) redirect("/login");
  if (perfil.role === "profesor") redirect("/admin");

  const [entrenamientos, estadisticas] = await Promise.all([
    getEntrenamientos(perfil.id),
    getEstadisticas(perfil.id),
  ]);

  return (
    <>
      <AppHeader nombre={perfil.nombre_completo} />
      <main className="flex-1 px-6 md:px-16 py-12">
        <h1 className="font-heading text-5xl md:text-6xl mb-2">
          Hola, {perfil.nombre_completo.split(" ")[0]}
        </h1>
        <p className="text-foreground/70 mb-10">Tu rendimiento hasta ahora.</p>

        <EstadisticasResumen estadisticas={estadisticas} />

        <h2 className="font-heading text-3xl mt-14 mb-6">
          Entrenamientos recientes
        </h2>
        <div className="flex flex-col gap-8">
          {entrenamientos.length === 0 && (
            <p className="text-foreground/60">
              Tu entrenador todavía no cargó contenido de tus clases.
            </p>
          )}
          {entrenamientos.map((entrenamiento) => (
            <EntrenamientoCard
              key={entrenamiento.id}
              entrenamiento={entrenamiento}
            />
          ))}
        </div>
      </main>
    </>
  );
}
