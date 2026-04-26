"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { sendRequestReceivedEmail, sendNewRequestNotificationEmail } from "@/lib/email"

export async function signIn(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/dashboard")
}

export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const fullName = formData.get("fullName") as string
  const companyName = formData.get("companyName") as string
  const companyRuc = formData.get("companyRuc") as string

  const supabase = await createClient()

  // Verificar si ya existe una solicitud pendiente con el mismo email o RUC
  const { data: existing } = await supabase
    .from("registration_requests")
    .select("id, status")
    .or(`email.eq.${email},company_ruc.eq.${companyRuc}`)
    .in("status", ["pending", "approved"])
    .maybeSingle()

  if (existing) {
    if (existing.status === "approved") {
      return { error: "Ya existe una cuenta registrada con este correo o RUC." }
    }
    return { error: "Ya existe una solicitud pendiente con este correo o RUC. Por favor espera la revisión del administrador." }
  }

  // Guardar la solicitud pendiente (sin crear cuenta en Auth)
  const { error: insertError } = await supabase
    .from("registration_requests")
    .insert({
      full_name: fullName,
      email,
      company_name: companyName,
      company_ruc: companyRuc,
      status: "pending",
    })

  if (insertError) {
    return { error: `Error al enviar la solicitud: ${insertError.message}` }
  }

  // --- INTEGRACIÓN BREVO ---
  
  // 1. Enviar confirmación al usuario
  await sendRequestReceivedEmail(email, fullName)

  // 2. Notificar al superadmin
  // Buscamos al primer superadmin para notificarle
  const { data: superadmin } = await supabase
    .from("users")
    .select("email")
    .eq("role", "superadmin")
    .limit(1)
    .single()

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"
  
  if (superadmin?.email) {
    await sendNewRequestNotificationEmail(
      superadmin.email,
      fullName,
      email,
      companyName,
      companyRuc,
      `${siteUrl}/dashboard/requests`
    )
  }

  redirect("/auth/sign-up-pending")
}


export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect("/")
}

export async function getUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user profile from public.users
  const { data: profile } = await supabase
    .from("users")
    .select("*, companies(*)")
    .eq("id", user.id)
    .single()

  return profile
}
