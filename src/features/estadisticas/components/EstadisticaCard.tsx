import type { Estadistica } from "@/lib/supabase/types";
import { formatFecha } from "@/shared/utils/formatFecha";

export function EstadisticaCard({ estadistica }: { estadistica: Estadistica }) {
  const items = [
    { label: "Atajadas", valor: estadistica.atajadas },
    { label: "Goles recibidos", valor: estadistica.goles_recibidos },
    { label: "Saques exitosos", valor: estadistica.saques_exitosos },
    { label: "Salidas exitosas", valor: estadistica.salidas_exitosas },
    { label: "Minutos jugados", valor: estadistica.minutos_jugados },
  ];

  return (
    <article className="border-l-2 border-accent pl-5 py-1">
      <p className="text-sm text-foreground/60">{formatFecha(estadistica.fecha)}</p>
      <dl className="flex flex-wrap gap-x-6 gap-y-1 mt-2">
        {items.map((item) => (
          <div key={item.label} className="flex gap-1.5 text-sm">
            <dt className="text-foreground/60">{item.label}:</dt>
            <dd className="font-medium">{item.valor}</dd>
          </div>
        ))}
      </dl>
      {estadistica.notas && (
        <p className="text-foreground/80 mt-2 text-sm">{estadistica.notas}</p>
      )}
    </article>
  );
}
