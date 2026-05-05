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
  const password = formData.get("password") as string
  const fullName = formData.get("fullName") as string
  const type = formData.get("type") as "user" | "company"
  const companyName = formData.get("companyName") as string
  const companyRuc = formData.get("companyRuc") as string

  const supabase = await createClient()

  // Verificar si ya existe un usuario con el mismo email
  const { data: existingUser } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle()

  if (existingUser) {
    return { error: "Ya existe una cuenta registrada con este correo." }
  }

  // Si es empresa, verificar RUC
  if (type === "company") {
    const { data: existingCompany } = await supabase
      .from("companies")
      .select("id")
      .eq("ruc", companyRuc)
      .maybeSingle()

    if (existingCompany) {
      return { error: "Ya existe una empresa registrada con este RUC." }
    }
  }

  // Crear usuario en Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
        role: type === "company" ? "empresa" : "user",
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  if (!authData.user) {
    return { error: "Error al crear la cuenta. Intenta nuevamente." }
  }

  let companyId: string | null = null

  // Crear empresa (para empresas) o empresa personal (para usuarios individuales)
  if (type === "company") {
    const { data: company, error: companyError } = await supabase
      .from("companies")
      .insert({ name: companyName, ruc: companyRuc })
      .select()
      .single()

    if (companyError) {
      return { error: `Error al crear la empresa: ${companyError.message}` }
    }

    companyId = company.id
  } else {
    // Usuario individual: crear una empresa personal
    const { data: personalCompany, error: personalCompanyError } = await supabase
      .from("companies")
      .insert({ name: `Personal - ${fullName}`, ruc: `USER-${authData.user.id.slice(0, 8)}` })
      .select()
      .single()

    if (personalCompanyError) {
      return { error: `Error al crear el espacio personal: ${personalCompanyError.message}` }
    }

    companyId = personalCompany.id
  }

  // Crear perfil de usuario en public.users
  const { error: userError } = await supabase
    .from("users")
    .insert({
      id: authData.user.id,
      email,
      full_name: fullName,
      role: type === "company" ? "empresa" : "user",
      company_id: companyId,
      is_active: true,
    })

  if (userError) {
    return { error: `Error al crear el perfil: ${userError.message}` }
  }

  redirect("/auth/registro-exitoso")
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
