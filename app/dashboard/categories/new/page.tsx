import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { CategoryForm } from "@/components/dashboard/categories/category-form"
import { Messages } from "../messages"

interface NewCategoryPageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function NewCategoryPage({ searchParams }: NewCategoryPageProps) {
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
            <h1 className="text-2xl font-bold text-foreground">Nueva Categoría</h1>
            <p className="text-muted-foreground">
              Crea una nueva categoría para tus productos
            </p>
          </div>
          <Messages searchParams={{ error: "No hay empresas activas. Crea una empresa primero en /dashboard/companies/new" }} />
        </div>
      )
    }

    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nueva Categoría</h1>
          <p className="text-muted-foreground">
            Crea una nueva categoría para tus productos
          </p>
        </div>
        <Messages searchParams={searchParams} />
        <CategoryForm companies={companies} />
      </div>
    )
  }

  if (!user.company_id) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nueva Categoría</h1>
          <p className="text-muted-foreground">
            Crea una nueva categoría para tus productos
          </p>
        </div>
        <Messages searchParams={{ error: "Tu usuario no tiene una empresa asignada. Contacta al administrador." }} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nueva Categoría</h1>
        <p className="text-muted-foreground">
          Crea una nueva categoría para tus productos
        </p>
      </div>

      <Messages searchParams={searchParams} />

      <CategoryForm />
    </div>
  )
}