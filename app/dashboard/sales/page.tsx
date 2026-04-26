import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Plus, Wrench } from "lucide-react"
import Link from "next/link"

export const dynamic = "force-dynamic"

export default async function SalesPage() {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Ventas</h1>
          <p className="text-muted-foreground">
            Gestiona las ventas realizadas
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/sales/new">
            <Plus className="mr-2 h-4 w-4" />
            Nueva Venta
          </Link>
        </Button>
      </div>

      <div className="text-center py-8">
        <Wrench className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Tabla de ventas en desarrollo</p>
        <p className="text-sm text-muted-foreground mt-2">
          Ventas encontradas: {sales?.length || 0}
        </p>
      </div>
    </div>
  )
}