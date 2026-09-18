"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export interface AutorizarProfesorResult {
  error: string | null;
  success?: string;
}

/**
 * Confirma el email y cambia el rol a "profesor" de una cuenta que ya
 * existe (se tuvo que haber registrado antes en /registro como alumno).
 * Usa la service_role key porque confirmar el email de OTRO usuario y
 * cambiar su rol son operaciones que la RLS normal no permite (a
 * propósito, ver prevent_role_self_escalation en schema.sql).
 */
export async function autorizarProfesor(
  formData: FormData
): Promise<AutorizarProfesorResult> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Tenés que estar logueado." };
  }

  const { data: perfil } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (perfil?.role !== "profesor") {
    return { error: "Solo un profesor puede autorizar a otro profesor." };
  }

  const email = String(formData.get("email") || "")
    .trim()
    .toLowerCase();

  if (!email) {
    return { error: "Ingresá un email." };
  }

  const admin = createAdminClient();

  const { data: destino } = await admin
    .from("profiles")
    .select("id, role, nombre_completo")
    .eq("email", email)
    .single();

  if (!destino) {
    return {
      error:
        "No encontré ninguna cuenta con ese email. Pedile que se registre primero en /registro.",
    };
  }

  if (destino.role === "profesor") {
    return { error: "Esa cuenta ya es profesor." };
  }

  const { error: confirmError } = await admin.auth.admin.updateUserById(
    destino.id,
    { email_confirm: true }
  );
  if (confirmError) {
    return { error: "No se pudo confirmar el email: " + confirmError.message };
  }

  const { error: roleError } = await admin
    .from("profiles")
    .update({ role: "profesor" })
    .eq("id", destino.id);
  if (roleError) {
    return { error: "No se pudo actualizar el rol: " + roleError.message };
  }

  revalidatePath("/admin");
  return {
    error: null,
    success: `${destino.nombre_completo} ya es profesor y puede ingresar.`,
  };
}
