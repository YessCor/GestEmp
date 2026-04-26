import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { Wrench } from "lucide-react"

export const dynamic = "force-dynamic"

export default async function InvoicesPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const supabase = await createClient()
  const { data: sales } = await supabase
    .from("sales")
    .select(`
      *,
      users(full_name)
    `)
    .eq("company_id", user.company_id)
    .order("created_at", { ascending: false })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Facturación</h1>
        <p className="text-muted-foreground">
          Gestiona las facturas y comprobantes
        </p>
      </div>

      <div className="text-center py-8">
        <Wrench className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Vista de facturación en desarrollo</p>
        <p className="text-sm text-muted-foreground mt-2">
          Facturas encontradas: {sales?.length || 0}
        </p>
      </div>
    </div>
  )
}