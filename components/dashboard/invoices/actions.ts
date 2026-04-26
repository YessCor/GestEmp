"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"

export async function createInvoice(formData: FormData) {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login?error=Debes iniciar sesión para crear facturas")
  }

  if (user.role !== "admin" && user.role !== "superadmin") {
    redirect("/dashboard/invoices?error=No tienes permisos de administrador para crear facturas")
  }

  if (!user.company_id) {
    redirect("/dashboard/invoices/new?error=Tu usuario no tiene una empresa asignada. Contacta al administrador.")
  }

  const supabase = await createClient()

  const invoice_number = formData.get("invoice_number") as string
  const customer_name = formData.get("customer_name") as string
  const customer_ruc = formData.get("customer_ruc") as string
  const customer_address = formData.get("customer_address") as string
  const issue_date = formData.get("issue_date") as string
  const due_date = formData.get("due_date") as string
  const subtotal = parseFloat(formData.get("subtotal") as string) || 0
  const tax = parseFloat(formData.get("tax") as string) || 0
  const total = parseFloat(formData.get("total") as string) || subtotal + tax
  const status = formData.get("status") as string

  const { error } = await supabase.from("invoices").insert({
    company_id: user.company_id,
    invoice_number,
    customer_name,
    customer_ruc: customer_ruc || null,
    customer_address: customer_address || null,
    issue_date: issue_date || new Date().toISOString().split("T")[0],
    due_date: due_date || null,
    subtotal,
    tax,
    total,
    status,
  })

  if (error) {
    console.error("Error creating invoice:", error)
    if (error.code === "23505") {
      redirect("/dashboard/invoices/new?error=Ya existe una factura con ese número")
    }
    redirect(`/dashboard/invoices/new?error=Error al crear factura: ${error.message}`)
  }

  redirect("/dashboard/invoices?success=Factura creada correctamente")
}