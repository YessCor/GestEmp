"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"

export async function createCompany(formData: FormData) {
  const user = await getUser()
  if (user?.role !== "superadmin") {
    return { error: "No tienes permisos para realizar esta acción" }
  }

  const supabase = await createClient()

  const { error } = await supabase.from("companies").insert({
    name: formData.get("name") as string,
    ruc: formData.get("ruc") as string,
    address: formData.get("address") as string || null,
    email: formData.get("email") as string || null,
    phone: formData.get("phone") as string || null,
  })

  if (error) {
    if (error.code === "23505") {
      return { error: "Ya existe una empresa con ese RUC" }
    }
    return { error: error.message }
  }

  redirect("/dashboard/companies")
}

export async function updateCompany(id: string, formData: FormData) {
  const user = await getUser()
  if (user?.role !== "superadmin") {
    return { error: "No tienes permisos para realizar esta acción" }
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
      return { error: "Ya existe una empresa con ese RUC" }
    }
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

  const { error } = await supabase.from("companies").delete().eq("id", id)

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard/companies")
}
