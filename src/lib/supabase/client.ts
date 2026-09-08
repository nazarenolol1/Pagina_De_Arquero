import { createBrowserClient } from "@supabase/ssr";

/**
 * Cliente de Supabase para usar en el navegador (Client Components).
 * Ejemplo: const supabase = createClient(); dentro de un componente con "use client".
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
