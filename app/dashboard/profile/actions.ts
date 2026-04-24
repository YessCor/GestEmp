"use server"

import { createClient } from "@/lib/supabase/server"
import { getUser } from "@/app/auth/actions"
import { redirect } from "next/navigation"

export async function updateProfile(formData: FormData) {
  const currentUser = await getUser()
  if (!currentUser) {
    return { error: "Usuario no autenticado" }
  }

  const supabase = await createClient()

  const fullName = formData.get("full_name") as string
  const email = formData.get("email") as string
  const currentPassword = formData.get("current_password") as string
  const newPassword = formData.get("new_password") as string

  // Actualizar nombre completo en la tabla users
  const { error: profileError } = await supabase
    .from("users")
    .update({
      full_name: fullName,
    })
    .eq("id", currentUser.id)

  if (profileError) {
    return { error: profileError.message }
  }

  // Si se proporciona email, actualizar en auth (solo para superadmin)
  if (email && email !== currentUser.email) {
    if (currentUser.role !== "superadmin") {
      return { error: "Solo el super administrador puede modificar el correo electrónico" }
    }
    
    const { error: emailError } = await supabase.auth.updateUser({
      email: email,
    })
    if (emailError) {
      return { error: emailError.message }
    }
  }

  // Si se proporciona nueva contraseña, actualizar
  if (newPassword) {
    if (!currentPassword) {
      return { error: "Debes proporcionar la contraseña actual para cambiarla" }
    }

    // Verificar contraseña actual
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: currentUser.email,
      password: currentPassword,
    })

    if (signInError) {
      return { error: "Contraseña actual incorrecta" }
    }

    const { error: passwordError } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (passwordError) {
      return { error: passwordError.message }
    }
  }

  redirect("/dashboard/profile")
}