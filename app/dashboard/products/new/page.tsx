import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { ProductForm } from "@/components/dashboard/products/product-form"

import { Messages } from "../messages"

interface NewProductPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function NewProductPage({ searchParams }: NewProductPageProps) {
  const user = await getUser()

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/dashboard")
  }

  if (user.role === "superadmin" && !user.company_id) {
    const supabase = await createClient()
    const { data: companies } = await supabase
      .from("companies")
      .select("id, name")
      .eq("is_active", true)
      .order("name")

    if (!companies || companies.length === 0) {
      return (
        <div className="mx-auto max-w-2xl space-y-6">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Nuevo Producto</h1>
            <p className="text-muted-foreground">
              Registra un nuevo producto en el catálogo
            </p>
          </div>
          <Messages searchParams={{ error: "No hay empresas activas. Crea una empresa primero en /dashboard/companies/new" }} />
        </div>
      )
    }

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nuevo Producto</h1>
          <p className="text-muted-foreground">
            Registra un nuevo producto en el catálogo
          </p>
        </div>
        <Messages searchParams={searchParams} />
        <ProductForm categories={[]} companies={companies} />
      </div>
    )
  }

  if (!user.company_id) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nuevo Producto</h1>
          <p className="text-muted-foreground">
            Registra un nuevo producto en el catálogo
          </p>
        </div>
        <Messages searchParams={{ error: "Tu usuario no tiene una empresa asignada. Contacta al administrador." }} />
      </div>
    )
  }

  const supabase = await createClient()
  const { data: categories } = await supabase
    .from("categories")
    .select("id, name")
    .eq("company_id", user.company_id)
    .eq("is_active", true)
    .order("name")

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nuevo Producto</h1>
        <p className="text-muted-foreground">
          Registra un nuevo producto en el catálogo
        </p>
      </div>

      <Messages searchParams={searchParams} />

      <ProductForm categories={categories || []} />
    </div>
  )
}