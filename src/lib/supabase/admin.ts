import { createClient as createSupabaseClient } from "@supabase/supabase-js";

/**
 * Cliente de Supabase con la service_role key: SE SALTA por completo la
 * Row Level Security. Existe únicamente para operaciones de administración
 * que el cliente normal no puede hacer (confirmar el email de otro usuario,
 * cambiar el rol de otro usuario).
 *
 * REGLAS DE USO:
 * - Nunca importar este archivo desde un componente "use client".
 * - Siempre validar primero, con el cliente normal (lib/supabase/server.ts),
 *   que quien llama es realmente un profesor logueado, ANTES de usar este
 *   cliente para lo que sea.
 * - La variable SUPABASE_SERVICE_ROLE_KEY (sin prefijo NEXT_PUBLIC_) tiene
 *   que existir solo en Vercel, marcada como "Secret", y jamás en el código
 *   ni en ningún archivo que se suba a GitHub.
 */
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
