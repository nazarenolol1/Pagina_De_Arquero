import { type NextRequest, NextResponse } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  let session: { supabaseResponse: NextResponse; user: unknown } | null = null;

  try {
    session = await updateSession(request);
  } catch (error) {
    // No dejamos que un error acá (ej. env vars de Supabase mal
    // configuradas en Vercel) tire abajo TODO el sitio. Cada página
    // privada vuelve a chequear la sesión por su cuenta con getPerfil()
    // y redirige a /login si hace falta, así que fallar "para adentro"
    // acá es seguro.
    console.error("middleware: updateSession falló, sigo sin bloquear.", error);
    return NextResponse.next({ request });
  }

  const { supabaseResponse, user } = session;
  const { pathname } = request.nextUrl;

  const isPrivateRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/admin");

  // Sin sesión intentando entrar a una ruta privada -> a login
  if (!user && isPrivateRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Con sesión intentando ver login/registro -> a su dashboard
  if (user && (pathname === "/login" || pathname === "/registro")) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
