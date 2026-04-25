"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"

export async function createSale(formData: FormData) {
  const user = await getUser()
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/dashboard")
  }

  const supabase = await createClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()
  if (!session?.user) {
    redirect("/auth/login")
  }

  const sale_number = formData.get("sale_number") as string
  const subtotal = parseFloat(formData.get("subtotal") as string) || 0
  const tax = parseFloat(formData.get("tax") as string) || 0
  const discount = parseFloat(formData.get("discount") as string) || 0
  const total = parseFloat(formData.get("total") as string) || subtotal + tax - discount
  const payment_method = formData.get("payment_method") as string
  const status = formData.get("status") as string
  const notes = formData.get("notes") as string

  const { error } = await supabase.from("sales").insert({
    company_id: user.company_id,
    user_id: user.id,
    sale_number,
    subtotal,
    tax,
    discount,
    total,
    payment_method,
    status,
    notes: notes || null,
  })

  if (error) {
    if (error.code === "23505") {
      redirect("/dashboard/sales/new?error=Ya existe una venta con ese número")
    }
    redirect(`/dashboard/sales/new?error=Error al crear venta: ${error.message}`)
  }

  redirect("/dashboard/sales?success=Venta creada correctamente")
}