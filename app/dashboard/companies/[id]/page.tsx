import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { CompanyForm } from "@/components/dashboard/companies/company-form"
import { Messages } from "../messages"

interface EditCompanyPageProps {
  params: {
    id: string
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function EditCompanyPage({ params, searchParams }: EditCompanyPageProps) {
  const user = await getUser()

  if (user?.role !== "superadmin") {
    redirect("/dashboard")
  }

  // Await params since they are now Promises in Next.js 16
  const { id } = await params

  // Validar que el ID sea un UUID válido
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89abAB][0-9a-f]{3}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(id)) {
    redirect("/dashboard/companies?error=ID de empresa inválido")
  }

  const supabase = await createClient()
  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single()

  if (error) {
    redirect(`/dashboard/companies?error=Error al cargar empresa: ${error.message}`)
  }

  if (!company) {
    redirect("/dashboard/companies?error=Empresa no encontrada")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Editar Empresa</h1>
        <p className="text-muted-foreground">
          Modifica la información de la empresa
        </p>
      </div>

      <Messages searchParams={searchParams} />

      <CompanyForm company={company} />
    </div>
  )
}