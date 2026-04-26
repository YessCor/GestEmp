"use server"

import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"
import {
  sendRequestApprovedEmail,
  sendRequestRejectedEmail,
} from "@/lib/email"

export async function approveRequest(id: string) {
  const supabase = await createClient()

  // Verificar que es superadmin
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) return { error: "No autenticado" }

  const { data: adminUser } = await supabase
    .from("users")
    .select("role, id")
    .eq("id", authUser.id)
    .single()

  if (adminUser?.role !== "superadmin") {
    return { error: "Sin permisos suficientes" }
  }

  // Obtener la solicitud
  const { data: request, error: fetchError } = await supabase
    .from("registration_requests")
    .select("*")
    .eq("id", id)
    .eq("status", "pending")
    .single()

  if (fetchError || !request) {
    return { error: "Solicitud no encontrada o ya procesada" }
  }

  const adminSupabase = createAdminClient()

  // Crear la empresa primero
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      name: request.company_name,
      ruc: request.company_ruc,
    })
    .select()
    .single()

  if (companyError) {
    return { error: `Error al crear empresa: ${companyError.message}` }
  }

  // Crear el usuario con contraseña aleatoria
  const randomPassword =
    Math.random().toString(36).slice(-12) +
    Math.random().toString(36).slice(-12).toUpperCase() +
    "!1"

  const { data: newAuthUser, error: createUserError } =
    await adminSupabase.auth.admin.createUser({
      email: request.email,
      password: randomPassword,
      email_confirm: true,
      user_metadata: {
        full_name: request.full_name,
        role: "admin",
        company_id: company.id,
      },
    })

  if (createUserError) {
    await supabase.from("companies").delete().eq("id", company.id)
    return { error: `Error al crear usuario: ${createUserError.message}` }
  }

  // Generar enlace de recuperación para que el usuario establezca su contraseña
  const siteUrl =
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"

  const { data: linkData } = await adminSupabase.auth.admin.generateLink({
    type: "recovery",
    email: request.email,
    options: { redirectTo: siteUrl }, // Usamos la raíz porque suele estar permitida por defecto
  })

  // Marcar solicitud como aprobada
  const { error: updateError } = await supabase
    .from("registration_requests")
    .update({
      status: "approved",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUser.id,
    })
    .eq("id", id)

  if (updateError) {
    return { error: `Error al actualizar solicitud: ${updateError.message}` }
  }

  // Enviar email de aprobación via Brevo con el enlace de reset
  const loginUrl = linkData?.properties?.action_link || `${siteUrl}/auth/login`
  await sendRequestApprovedEmail(
    request.email,
    request.full_name,
    request.company_name,
    loginUrl
  )

  revalidatePath("/dashboard/requests")
  return { success: true, userId: newAuthUser.user?.id }
}

export async function rejectRequest(id: string, reason: string) {
  const supabase = await createClient()

  // Verificar que es superadmin
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  if (!authUser) return { error: "No autenticado" }

  const { data: adminUser } = await supabase
    .from("users")
    .select("role, id")
    .eq("id", authUser.id)
    .single()

  if (adminUser?.role !== "superadmin") {
    return { error: "Sin permisos suficientes" }
  }

  // Obtener la solicitud antes de actualizar para tener el email
  const { data: request } = await supabase
    .from("registration_requests")
    .select("email, full_name")
    .eq("id", id)
    .eq("status", "pending")
    .single()

  if (!request) {
    return { error: "Solicitud no encontrada o ya procesada" }
  }

  const { error } = await supabase
    .from("registration_requests")
    .update({
      status: "rejected",
      rejection_reason: reason || "Sin motivo especificado",
      reviewed_at: new Date().toISOString(),
      reviewed_by: adminUser.id,
    })
    .eq("id", id)
    .eq("status", "pending")

  if (error) {
    return { error: `Error al rechazar solicitud: ${error.message}` }
  }

  // Enviar email de rechazo via Brevo
  await sendRequestRejectedEmail(request.email, request.full_name, reason)

  revalidatePath("/dashboard/requests")
  return { success: true }
}

export async function getPendingRequestsCount() {
  const supabase = await createClient()
  const { count } = await supabase
    .from("registration_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "pending")

  return count ?? 0
}
