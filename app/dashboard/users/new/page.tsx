import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { UserForm } from "@/components/dashboard/users/user-form"

export default async function NewUserPage() {
  const user = await getUser()

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/dashboard")
  }

  const supabase = await createClient()

  // Superadmin puede ver todas las empresas, admin solo la suya
  let companies: { id: string; name: string }[] = []
  if (user.role === "superadmin") {
    const { data } = await supabase
      .from("companies")
      .select("id, name")
      .eq("is_active", true)
      .order("name")
    companies = data || []
  } else if (user.company_id) {
    const { data } = await supabase
      .from("companies")
      .select("id, name")
      .eq("id", user.company_id)
      .single()
    if (data) companies = [data]
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nuevo Usuario</h1>
        <p className="text-muted-foreground">
          Registra un nuevo usuario en el sistema
        </p>
      </div>

      <UserForm companies={companies} currentUserRole={user.role} />
    </div>
  )
}
