"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { Role } from "@/lib/supabase/types";

export interface AuthResult {
  error: string | null;
}

export async function login(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { error: "Email o contraseña incorrectos." };
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData): Promise<AuthResult> {
  const email = String(formData.get("email"));
  const password = String(formData.get("password"));
  const nombre_completo = String(formData.get("nombre_completo"));
  const role = String(formData.get("role")) as Role;

  if (password.length < 6) {
    return { error: "La contraseña debe tener al menos 6 caracteres." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { nombre_completo, role },
    },
  });

  if (error) {
    return { error: "No se pudo crear la cuenta. " + error.message };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
