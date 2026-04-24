import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { CompanyForm } from "@/components/dashboard/companies/company-form"

export default async function NewCompanyPage() {
  const user = await getUser()

  if (user?.role !== "superadmin") {
    redirect("/dashboard")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nueva Empresa</h1>
        <p className="text-muted-foreground">
          Registra una nueva empresa en el sistema
        </p>
      </div>

      <CompanyForm />
    </div>
  )
}
