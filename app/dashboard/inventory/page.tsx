import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { Wrench } from "lucide-react"

export default async function InventoryPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const supabase = await createClient()
  const { data: products } = await supabase
    .from("products")
    .select(`
      *,
      categories(name)
    `)
    .eq("company_id", user.company_id)
    .order("current_stock", { ascending: true })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
        <p className="text-muted-foreground">
          Controla el stock de tus productos
        </p>
      </div>

      <div className="text-center py-8">
        <Wrench className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Vista de inventario en desarrollo</p>
        <p className="text-sm text-muted-foreground mt-2">
          Productos en inventario: {products?.length || 0}
        </p>
      </div>
    </div>
  )
}