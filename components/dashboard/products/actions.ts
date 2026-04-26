"use server"

import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"

export async function createProduct(formData: FormData) {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login?error=Debes iniciar sesión para crear productos")
  }

  if (user.role !== "admin" && user.role !== "superadmin") {
    redirect("/dashboard/products?error=No tienes permisos de administrador para crear productos")
  }

  let companyId = user.company_id

  if (user.role === "superadmin" && !companyId) {
    const companyIdFromForm = formData.get("company_id") as string
    if (!companyIdFromForm) {
      redirect("/dashboard/products/new?error=Selecciona una empresa para crear el producto")
    }
    companyId = companyIdFromForm
  }

  if (!companyId) {
    redirect("/dashboard/products/new?error=Tu usuario no tiene una empresa asignada. Contacta al administrador.")
  }

  const supabase = await createClient()

  const { error } = await supabase.from("products").insert({
    company_id: companyId,
    category_id: (formData.get("category_id") as string) || null,
    sku: formData.get("sku") as string,
    name: formData.get("name") as string,
    description: (formData.get("description") as string) || null,
    purchase_price: parseFloat(formData.get("purchase_price") as string) || 0,
    sale_price: parseFloat(formData.get("sale_price") as string),
    current_stock: parseInt(formData.get("current_stock") as string) || 0,
    min_stock: parseInt(formData.get("min_stock") as string) || 0,
    unit: (formData.get("unit") as string) || "unidad",
    image_url: (formData.get("image_url") as string) || null,
  })

  if (error) {
    console.error("Error creating product:", error)
    if (error.code === "23505") {
      redirect("/dashboard/products/new?error=Ya existe un producto con ese SKU")
    }
    redirect(`/dashboard/products/new?error=Error al crear producto: ${error.message}`)
  }

  redirect("/dashboard/products?success=Producto creado correctamente")
}

export async function updateProduct(id: string, formData: FormData) {
  const user = await getUser()
  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/dashboard")
  }

  if (!user.company_id) {
    redirect(`/dashboard/products/${id}?error=Tu usuario no tiene una empresa asignada. Contacta al administrador.`)
  }

  const supabase = await createClient()

  const { error } = await supabase
    .from("products")
    .update({
      category_id: (formData.get("category_id") as string) || null,
      sku: formData.get("sku") as string,
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || null,
      purchase_price: parseFloat(formData.get("purchase_price") as string) || 0,
      sale_price: parseFloat(formData.get("sale_price") as string),
      current_stock: parseInt(formData.get("current_stock") as string) || 0,
      min_stock: parseInt(formData.get("min_stock") as string) || 0,
      unit: (formData.get("unit") as string) || "unidad",
      image_url: (formData.get("image_url") as string) || null,
      is_active: formData.get("is_active") === "on",
    })
    .eq("id", id)

  if (error) {
    if (error.code === "23505") {
      redirect(`/dashboard/products/${id}?error=Ya existe un producto con ese SKU`)
    }
    redirect(`/dashboard/products/${id}?error=Error al actualizar producto: ${error.message}`)
  }

  redirect("/dashboard/products?success=Producto actualizado correctamente")
}