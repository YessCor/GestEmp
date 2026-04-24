"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { headers } from "next/headers"

export async function createUser(formData: FormData) {
  const currentUser = await getUser()
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin")) {
    return { error: "No tienes permisos para realizar esta acción" }
  }

  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get("origin") || ""

  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("full_name") as string
  const role = formData.get("role") as string
  const companyId = formData.get("company_id") as string || null

  // Admin solo puede crear usuarios en su empresa
  const finalCompanyId = currentUser.role === "admin" 
    ? currentUser.company_id 
    : companyId

  // Admin no puede crear superadmins
  const finalRole = currentUser.role === "admin" && role === "superadmin" 
    ? "admin" 
    : role

  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        role: finalRole,
        company_id: finalCompanyId,
      },
    },
  })

  if (signUpError) {
    return { error: signUpError.message }
  }

  redirect("/dashboard/users")
}

export async function updateUser(id: string, formData: FormData) {
  const currentUser = await getUser()
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin")) {
    return { error: "No tienes permisos para realizar esta acción" }
  }

  const supabase = await createClient()

  const fullName = formData.get("full_name") as string
  const role = formData.get("role") as string
  const companyId = formData.get("company_id") as string || null
  const isActive = formData.get("is_active") === "on"

  // Admin solo puede modificar usuarios de su empresa
  if (currentUser.role === "admin") {
    const { data: targetUser } = await supabase
      .from("users")
      .select("company_id")
      .eq("id", id)
      .single()

    if (targetUser?.company_id !== currentUser.company_id) {
      return { error: "No puedes modificar usuarios de otra empresa" }
    }
  }

  // Admin no puede crear superadmins
  const finalRole = currentUser.role === "admin" && role === "superadmin" 
    ? "admin" 
    : role

  const { error } = await supabase
    .from("users")
    .update({
      full_name: fullName,
      role: finalRole,
      company_id: currentUser.role === "admin" ? currentUser.company_id : companyId,
      is_active: isActive,
    })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard/users")
}

export async function deleteUser(id: string) {
  const currentUser = await getUser()
  if (!currentUser || (currentUser.role !== "admin" && currentUser.role !== "superadmin")) {
    return { error: "No tienes permisos para realizar esta acción" }
  }

  // No puedes eliminarte a ti mismo
  if (id === currentUser.id) {
    return { error: "No puedes eliminar tu propia cuenta" }
  }

  const supabase = await createClient()

  // Admin solo puede eliminar usuarios de su empresa
  if (currentUser.role === "admin") {
    const { data: targetUser } = await supabase
      .from("users")
      .select("company_id")
      .eq("id", id)
      .single()

    if (targetUser?.company_id !== currentUser.company_id) {
      return { error: "No puedes eliminar usuarios de otra empresa" }
    }
  }

  // Desactivar en lugar de eliminar para mantener integridad referencial
  const { error } = await supabase
    .from("users")
    .update({ is_active: false })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard/users")
}
