import type { Estadistica } from "@/lib/supabase/types";

function sumar(estadisticas: Estadistica[], campo: keyof Estadistica) {
  return estadisticas.reduce((acc, e) => acc + (Number(e[campo]) || 0), 0);
}

export function EstadisticasResumen({
  estadisticas,
}: {
  estadisticas: Estadistica[];
}) {
  if (estadisticas.length === 0) {
    return (
      <p className="text-foreground/60">
        Todavía no hay estadísticas cargadas.
      </p>
    );
  }

  const totalAtajadas = sumar(estadisticas, "atajadas");
  const totalGoles = sumar(estadisticas, "goles_recibidos");
  const totalMinutos = sumar(estadisticas, "minutos_jugados");

  const items = [
    { label: "Atajadas", valor: totalAtajadas },
    { label: "Goles recibidos", valor: totalGoles },
    { label: "Minutos jugados", valor: totalMinutos },
    { label: "Registros", valor: estadisticas.length },
  ];

  return (
    <dl className="grid grid-cols-2 md:grid-cols-4 gap-6">
      {items.map((item) => (
        <div key={item.label}>
          <dt className="text-sm text-foreground/60">{item.label}</dt>
          <dd className="font-heading text-5xl text-accent-secondary mt-1">
            {item.valor}
          </dd>
        </div>
      ))}
    </dl>
  );
}
