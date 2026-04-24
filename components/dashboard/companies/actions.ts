"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { headers } from "next/headers"

export async function createCompany(formData: FormData) {
  const user = await getUser()
  if (user?.role !== "superadmin") {
    redirect("/dashboard/companies?error=No tienes permisos para realizar esta acción")
  }

  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get("origin") || ""

  // First create the company
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      name: formData.get("name") as string,
      ruc: formData.get("ruc") as string,
      address: formData.get("address") as string || null,
      email: formData.get("email") as string || null,
      phone: formData.get("phone") as string || null,
    })
    .select()
    .single()

  if (companyError) {
    if (companyError.code === "23505") {
      redirect("/dashboard/companies/new?error=Ya existe una empresa con ese RUC")
    }
    redirect(`/dashboard/companies/new?error=Error al crear empresa: ${companyError.message}`)
  }

  // Then create the admin user for the company
  const adminEmail = formData.get("admin_email") as string
  const adminPassword = formData.get("admin_password") as string
  const adminFullName = formData.get("admin_full_name") as string

  const { error: signUpError } = await supabase.auth.signUp({
    email: adminEmail,
    password: adminPassword,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${origin}/auth/callback`,
      data: {
        full_name: adminFullName,
        role: "admin",
        company_id: company.id,
      },
    },
  })

  if (signUpError) {
    // Rollback: delete the company if user signup fails
    await supabase.from("companies").delete().eq("id", company.id)
    redirect(`/dashboard/companies/new?error=Error al crear usuario administrador: ${signUpError.message}`)
  }

  redirect("/dashboard/companies?success=Empresa y usuario administrador creados correctamente")
}

export async function updateCompany(id: string, formData: FormData) {
  const user = await getUser()
  if (user?.role !== "superadmin") {
    redirect("/dashboard/companies?error=No tienes permisos para realizar esta acción")
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("companies")
    .update({
      name: formData.get("name") as string,
      ruc: formData.get("ruc") as string,
      address: formData.get("address") as string || null,
      email: formData.get("email") as string || null,
      phone: formData.get("phone") as string || null,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id)

  if (error) {
    if (error.code === "23505") {
      redirect(`/dashboard/companies/${id}?error=Ya existe una empresa con ese RUC`)
    }
    redirect(`/dashboard/companies/${id}?error=Error al actualizar empresa: ${error.message}`)
  }

  redirect("/dashboard/companies?success=Empresa actualizada correctamente")
}

export async function activateCompany(id: string) {
  const user = await getUser()
  if (user?.role !== "superadmin") {
    return { error: "No tienes permisos para realizar esta acción" }
  }

  const supabase = await createClient()

  // Activar la empresa
  const { error } = await supabase
    .from("companies")
    .update({ is_active: true })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard/companies")
}

export async function deleteCompany(id: string) {
  const user = await getUser()
  if (user?.role !== "superadmin") {
    return { error: "No tienes permisos para realizar esta acción" }
  }

  const supabase = await createClient()

  // Desactivar la empresa en lugar de eliminarla para mantener integridad referencial
  const { error } = await supabase
    .from("companies")
    .update({ is_active: false })
    .eq("id", id)

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard/companies")
}

export async function deleteCompanyPermanently(id: string) {
  const user = await getUser()
  if (user?.role !== "superadmin") {
    redirect("/dashboard/companies?error=No tienes permisos para realizar esta acción")
  }

  const supabase = await createClient()

  // Primero verificar si la empresa tiene usuarios asociados
  const { data: users, error: usersError } = await supabase
    .from("users")
    .select("id")
    .eq("company_id", id)

  if (usersError) {
    redirect(`/dashboard/companies?error=Error al verificar usuarios asociados`)
  }

  if (users && users.length > 0) {
    redirect(`/dashboard/companies?error=No se puede eliminar la empresa porque tiene ${users.length} usuario(s) asociado(s). Desactiva la empresa en su lugar.`)
  }

  // Eliminar completamente la empresa
  const { error } = await supabase
    .from("companies")
    .delete()
    .eq("id", id)

  if (error) {
    redirect(`/dashboard/companies?error=Error al eliminar empresa: ${error.message}`)
  }

  redirect("/dashboard/companies?success=Empresa eliminada permanentemente")
}
