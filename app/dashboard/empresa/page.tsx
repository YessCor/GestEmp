import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Package, TrendingUp } from "lucide-react"
import Link from "next/link"

export default async function EmpresaDashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase
    .from("users")
    .select("*, companies(*)")
    .eq("id", user.id)
    .single()

  if (!profile || profile.role !== "empresa") {
    redirect("/dashboard")
  }

  // Obtener estadísticas básicas
  const { count: productCount } = await supabase
    .from("products")
    .select("*", { count: "exact", head: true })
    .eq("company_id", profile.company_id)

  const { count: userCount } = await supabase
    .from("users")
    .select("*", { count: "exact", head: true })
    .eq("company_id", profile.company_id)

  const { count: saleCount } = await supabase
    .from("sales")
    .select("*", { count: "exact", head: true })
    .eq("company_id", profile.company_id)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">
          Dashboard Empresa
        </h1>
        <p className="text-muted-foreground">
          Bienvenido, {profile.full_name} - {profile.companies?.name}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Empresa</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{profile.companies?.name}</div>
            <p className="text-xs text-muted-foreground">
              RUC: {profile.companies?.ruc}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Productos</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productCount || 0}</div>
            <Link href="/dashboard/products" className="text-xs text-primary hover:underline">
              Gestionar productos
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Usuarios</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userCount || 0}</div>
            <Link href="/dashboard/users" className="text-xs text-primary hover:underline">
              Gestionar usuarios
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ventas</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{saleCount || 0}</div>
            <Link href="/dashboard/sales" className="text-xs text-primary hover:underline">
              Ver ventas
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
            <CardDescription>
              Gestiona tu empresa
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link href="/dashboard/products/new">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <Package className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Agregar Producto</p>
                    <p className="text-sm text-muted-foreground">Registra un nuevo producto</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/sales/new">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <TrendingUp className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Nueva Venta</p>
                    <p className="text-sm text-muted-foreground">Registra una venta</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
            <Link href="/dashboard/users/new">
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <Users className="h-8 w-8 text-primary" />
                  <div>
                    <p className="font-medium">Agregar Usuario</p>
                    <p className="text-sm text-muted-foreground">Invita un empleado</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Información de la Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Nombre:</span>
              <span className="font-medium">{profile.companies?.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">RUC:</span>
              <span className="font-medium">{profile.companies?.ruc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium">{profile.companies?.email || "No configurado"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Teléfono:</span>
              <span className="font-medium">{profile.companies?.phone || "No configurado"}</span>
            </div>
            <Link href="/dashboard/settings">
              <Button variant="outline" className="w-full mt-4">Editar Información</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
