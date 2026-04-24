"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { headers } from "next/headers"

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
  const companyName = formData.get("companyName") as string
  const companyRuc = formData.get("companyRuc") as string

  const supabase = await createClient()
  const headersList = await headers()
  const origin = headersList.get("origin") || ""

  // First create the company
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      name: companyName,
      ruc: companyRuc,
    })
    .select()
    .single()

  if (companyError) {
    return { error: `Error al crear empresa: ${companyError.message}` }
  }

  // Then sign up the user with company_id in metadata
  const { error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo:
        process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
        `${origin}/auth/callback`,
      data: {
        full_name: fullName,
        role: "admin",
        company_id: company.id,
      },
    },
  })

  if (signUpError) {
    // Rollback: delete the company if user signup fails
    await supabase.from("companies").delete().eq("id", company.id)
    return { error: signUpError.message }
  }

  redirect("/auth/sign-up-success")
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
