/**
 * Formatea una fecha guardada como "YYYY-MM-DD" (columna `date` de Postgres).
 * `new Date("YYYY-MM-DD")` la interpreta como medianoche UTC, así que en
 * timezones negativos (como Argentina, UTC-3) el día mostrado queda uno
 * menos. Agregar la hora fuerza a interpretarla en hora local.
 */
export function formatFecha(fecha: string) {
  return new Date(`${fecha}T00:00:00`).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
