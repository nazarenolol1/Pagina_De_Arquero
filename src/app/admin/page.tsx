import { redirect } from "next/navigation";
import { getPerfil } from "@/features/arqueros/actions/getPerfil";
import { getAlumnos } from "@/features/admin/actions/getAlumnos";
import { ListaAlumnos } from "@/features/admin/components/ListaAlumnos";
import { AppHeader } from "@/shared/components/AppHeader";

export default async function AdminPage() {
  const perfil = await getPerfil();

  if (!perfil) redirect("/login");
  if (perfil.role !== "profesor") redirect("/dashboard");

  const alumnos = await getAlumnos();

  return (
    <>
      <AppHeader nombre={perfil.nombre_completo} />
      <main className="flex-1 px-6 md:px-16 py-12">
        <h1 className="font-heading text-5xl md:text-6xl mb-2">Mis arqueros</h1>
        <p className="text-foreground/70 mb-10">
          {alumnos.length} arquero{alumnos.length !== 1 ? "s" : ""} registrado
          {alumnos.length !== 1 ? "s" : ""}.
        </p>
        <ListaAlumnos alumnos={alumnos} />
      </main>
    </>
  );
}
