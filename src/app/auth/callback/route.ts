import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Supabase redirige acá después de que el usuario confirma su email
 * (o hace login con un magic link). Intercambia el "code" de la URL
 * por una sesión válida y lo manda al dashboard.
 */
export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}/dashboard`);
    }
  }

  // Si algo falló (link vencido, ya usado, etc.), mandamos a login con aviso.
  return NextResponse.redirect(`${origin}/login?error=confirmacion`);
}
