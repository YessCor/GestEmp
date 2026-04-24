import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { CompanyForm } from "@/components/dashboard/companies/company-form"

interface EditCompanyPageProps {
  params: {
    id: string
  }
}

export default async function EditCompanyPage({ params }: EditCompanyPageProps) {
  const user = await getUser()

  if (user?.role !== "superadmin") {
    redirect("/dashboard")
  }

  const supabase = await createClient()
  const { data: company } = await supabase
    .from("companies")
    .select("*")
    .eq("id", params.id)
    .single()

  if (!company) {
    redirect("/dashboard/companies")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Editar Empresa</h1>
        <p className="text-muted-foreground">
          Modifica la información de la empresa
        </p>
      </div>

      <CompanyForm company={company} />
    </div>
  )
}