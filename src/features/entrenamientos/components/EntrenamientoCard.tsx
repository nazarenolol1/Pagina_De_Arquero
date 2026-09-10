import type { EntrenamientoConArchivos } from "@/features/entrenamientos/actions/getEntrenamientos";
import { formatFecha } from "@/shared/utils/formatFecha";

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
        {formatFecha(entrenamiento.fecha)}
      </p>
      <h3 className="font-heading text-2xl mt-1">{entrenamiento.titulo}</h3>
      {entrenamiento.descripcion && (
        <p className="text-foreground/80 mt-1">{entrenamiento.descripcion}</p>
      )}

      {entrenamiento.entrenamiento_archivos?.length > 0 && (
        <div className="flex flex-wrap gap-4 mt-4">
          {entrenamiento.entrenamiento_archivos.map((archivo) => {
            if (archivo.tipo === "nota") {
              return (
                <p
                  key={archivo.id}
                  className="text-sm bg-surface border border-border px-3 py-2 w-full"
                >
                  📝 {archivo.contenido_texto}
                </p>
              );
            }

            if (!archivo.signedUrl) {
              return (
                <p key={archivo.id} className="text-sm text-foreground/50">
                  {ICONOS[archivo.tipo]} Archivo no disponible
                </p>
              );
            }

            if (archivo.tipo === "video") {
              return (
                <video
                  key={archivo.id}
                  src={archivo.signedUrl}
                  controls
                  className="w-full max-w-xs bg-black"
                />
              );
            }

            return (
              // eslint-disable-next-line @next/next/no-img-element -- URL firmada dinámica, no apta para next/image
              <img
                key={archivo.id}
                src={archivo.signedUrl}
                alt={`Foto de la clase "${entrenamiento.titulo}"`}
                className="w-full max-w-xs object-cover border border-border"
              />
            );
          })}
        </div>
      )}
    </article>
  );
}
