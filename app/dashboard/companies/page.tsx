import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { CompaniesTable } from "@/components/dashboard/companies/companies-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function CompaniesPage() {
  const user = await getUser()

  if (user?.role !== "superadmin") {
    redirect("/dashboard")
  }

  const supabase = await createClient()
  const { data: companies } = await supabase
    .from("companies")
    .select("*")
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Empresas</h1>
          <p className="text-muted-foreground">
            Gestiona todas las empresas registradas en el sistema
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/companies/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Empresa
          </Link>
        </Button>
      </div>

      <CompaniesTable companies={companies || []} />
    </div>
  )
}
