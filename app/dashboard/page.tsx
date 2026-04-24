import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Package, ShoppingCart, FileText, TrendingUp, AlertTriangle, DollarSign } from "lucide-react"

async function getDashboardStats(companyId: string | null) {
  if (!companyId) return null

  const supabase = await createClient()

  const [productsResult, salesResult, invoicesResult, lowStockResult] = await Promise.all([
    supabase.from("products").select("id", { count: "exact" }).eq("company_id", companyId),
    supabase.from("sales").select("id, total", { count: "exact" }).eq("company_id", companyId),
    supabase.from("invoices").select("id", { count: "exact" }).eq("company_id", companyId),
    supabase.from("products").select("id", { count: "exact" }).eq("company_id", companyId).lte("current_stock", 10),
  ])

  const totalSales = salesResult.data?.reduce((sum, sale) => sum + Number(sale.total || 0), 0) || 0

  return {
    products: productsResult.count || 0,
    sales: salesResult.count || 0,
    totalRevenue: totalSales,
    invoices: invoicesResult.count || 0,
    lowStock: lowStockResult.count || 0,
  }
}

export default async function DashboardPage() {
  const user = await getUser()
  const stats = await getDashboardStats(user?.company_id ?? null)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Buenos días"
    if (hour < 18) return "Buenas tardes"
    return "Buenas noches"
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          {greeting()}, {user?.full_name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Aquí tienes un resumen de tu negocio
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Productos
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.products ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Productos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ventas Realizadas
            </CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.sales ?? 0}</div>
            <p className="text-xs text-muted-foreground">
              Ventas totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Ingresos Totales
            </CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats?.totalRevenue ?? 0).toLocaleString("es-ES", { minimumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-muted-foreground">
              Ingresos acumulados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Stock Bajo
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">
              {stats?.lowStock ?? 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Productos con poco stock
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Acciones Rápidas
            </CardTitle>
            <CardDescription>
              Accede rápidamente a las funciones más utilizadas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href="/dashboard/sales/new"
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
              >
                <ShoppingCart className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Nueva Venta</p>
                  <p className="text-sm text-muted-foreground">Registrar una venta</p>
                </div>
              </a>
              <a
                href="/dashboard/products/new"
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
              >
                <Package className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Nuevo Producto</p>
                  <p className="text-sm text-muted-foreground">Agregar producto</p>
                </div>
              </a>
              <a
                href="/dashboard/invoices/new"
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
              >
                <FileText className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Nueva Factura</p>
                  <p className="text-sm text-muted-foreground">Generar factura</p>
                </div>
              </a>
              <a
                href="/dashboard/inventory"
                className="flex items-center gap-3 rounded-lg border border-border p-4 transition-colors hover:bg-muted"
              >
                <AlertTriangle className="h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium">Ver Inventario</p>
                  <p className="text-sm text-muted-foreground">Gestionar stock</p>
                </div>
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
            <CardDescription>
              Datos de tu empresa registrada
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">Empresa</span>
              <span className="font-medium">{user?.companies?.name || "No asignada"}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">RUC</span>
              <span className="font-medium">{user?.companies?.ruc || "-"}</span>
            </div>
            <div className="flex items-center justify-between border-b border-border pb-3">
              <span className="text-sm text-muted-foreground">Tu Rol</span>
              <span className="font-medium capitalize">
                {user?.role === "superadmin"
                  ? "Superadmin"
                  : user?.role === "admin"
                    ? "Administrador"
                    : "Empleado"}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Email</span>
              <span className="font-medium">{user?.email}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
