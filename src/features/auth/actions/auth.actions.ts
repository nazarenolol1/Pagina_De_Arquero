"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export interface AuthResult {
  error: string | null;
}

export async function login(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    if (error.code === "email_not_confirmed") {
      return {
        error:
          "Todavía no confirmaste tu email. Revisá tu bandeja de entrada (y spam) y hacé clic en el link que te enviamos.",
      };
    }
    return { error: "Email o contraseña incorrectos." };
  }

  redirect("/dashboard");
}

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export async function signup(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const nombre_completo = String(formData.get("nombre_completo"));

  if (!PASSWORD_REGEX.test(password)) {
    return {
      error:
        "La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula y un número.",
    };
  }

  const supabase = await createClient();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  if (!siteUrl) {
    console.warn(
      "NEXT_PUBLIC_SITE_URL no está configurada: el link de confirmación de email puede no funcionar en producción."
    );
  }

  // Nota: no se envía "role" acá a propósito. El registro público
  // siempre crea usuarios "alumno" (lo aplica la base de datos,
  // ver handle_new_user() en supabase/schema.sql), así que aunque
  // alguien agregue un campo "role" manipulando el formulario desde
  // DevTools, no tiene ningún efecto.
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre_completo },
      emailRedirectTo: `${siteUrl ?? "http://localhost:3000"}/auth/callback`,
    },
  });

  if (error) {
    return { error: "No se pudo crear la cuenta. " + error.message };
  }

  // Si Supabase no devuelve sesión, significa que la confirmación de
  // email está activada y todavía no se confirmó: no hay que llevar
  // al usuario al dashboard, sino avisarle que revise su correo.
  if (!data.session) {
    redirect("/registro/confirma-tu-email");
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
