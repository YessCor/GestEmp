import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { RequestsTable } from "@/components/dashboard/requests/requests-table"
import { ClipboardList, Clock } from "lucide-react"

export default async function RequestsPage() {
  const user = await getUser()

  if (user?.role !== "superadmin") {
    redirect("/dashboard")
  }

  const supabase = await createClient()
  const { data: requests } = await supabase
    .from("registration_requests")
    .select("*")
    .order("created_at", { ascending: false })

  const pending = (requests ?? []).filter((r) => r.status === "pending").length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <ClipboardList className="h-6 w-6" />
            Solicitudes de Registro
          </h1>
          <p className="text-muted-foreground">
            Revisa y gestiona las solicitudes de nuevas empresas que quieren unirse a GestEmp.
          </p>
        </div>
        {pending > 0 && (
          <div className="flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-2">
            <Clock className="h-4 w-4 text-amber-500" />
            <span className="text-sm font-semibold text-amber-600">
              {pending} pendiente{pending !== 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>

      <RequestsTable requests={requests ?? []} />
    </div>
  )
}
