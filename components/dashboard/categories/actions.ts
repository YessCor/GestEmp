"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"

export async function createCategory(formData: FormData) {
  const user = await getUser()
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/dashboard")
  }

  const supabase = await createClient()

  const { error } = await supabase.from("categories").insert({
    company_id: user.company_id,
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
  })

  if (error) {
    if (error.code === "23505") {
      redirect("/dashboard/categories/new?error=Ya existe una categoría con ese nombre")
    }
    redirect(`/dashboard/categories/new?error=Error al crear categoría: ${error.message}`)
  }

  redirect("/dashboard/categories?success=Categoría creada correctamente")
}

export async function updateCategory(id: string, formData: FormData) {
  const user = await getUser()
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/dashboard")
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("categories")
    .update({
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id)

  if (error) {
    if (error.code === "23505") {
      redirect(`/dashboard/categories/${id}?error=Ya existe una categoría con ese nombre`)
    }
    redirect(`/dashboard/categories/${id}?error=Error al actualizar categoría: ${error.message}`)
  }

  redirect("/dashboard/categories?success=Categoría actualizada correctamente")
}