import type { EntrenamientoConArchivos } from "@/features/entrenamientos/actions/getEntrenamientos";

const ICONOS: Record<string, string> = {
  video: "🎥",
  foto: "📷",
  nota: "📝",
};

export function EntrenamientoCard({
  entrenamiento,
}: {
  entrenamiento: EntrenamientoConArchivos;
}) {
  return (
    <article className="border-l-2 border-accent-secondary pl-5 py-1">
      <p className="text-sm text-foreground/60">
        {new Date(entrenamiento.fecha).toLocaleDateString("es-AR", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        })}
      </p>
      <h3 className="font-heading text-2xl mt-1">{entrenamiento.titulo}</h3>
      {entrenamiento.descripcion && (
        <p className="text-foreground/80 mt-1">{entrenamiento.descripcion}</p>
      )}

      {entrenamiento.entrenamiento_archivos?.length > 0 && (
        <ul className="flex flex-wrap gap-3 mt-3">
          {entrenamiento.entrenamiento_archivos.map((archivo) => (
            <li
              key={archivo.id}
              className="text-sm bg-surface border border-border px-3 py-1.5"
            >
              {ICONOS[archivo.tipo]}{" "}
              {archivo.tipo === "nota" ? archivo.contenido_texto : archivo.tipo}
            </li>
          ))}
        </ul>
      )}
    </article>
  );
}
