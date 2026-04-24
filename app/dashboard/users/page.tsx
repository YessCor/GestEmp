import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { UsersTable } from "@/components/dashboard/users/users-table"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default async function UsersPage() {
  const user = await getUser()

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/dashboard")
  }

  const supabase = await createClient()

  let query = supabase.from("users").select("*, companies(name)")

  // Admin solo ve usuarios de su empresa
  if (user.role === "admin" && user.company_id) {
    query = query.eq("company_id", user.company_id)
  }

  const { data: users } = await query.order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Usuarios</h1>
          <p className="text-muted-foreground">
            {user.role === "superadmin"
              ? "Gestiona todos los usuarios del sistema"
              : "Gestiona los usuarios de tu empresa"}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/users/new">
            <Plus className="mr-2 h-4 w-4" />
            Nuevo Usuario
          </Link>
        </Button>
      </div>

      <UsersTable users={users || []} currentUserRole={user.role} />
    </div>
  )
}
