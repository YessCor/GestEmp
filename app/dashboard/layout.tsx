import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { createClient } from "@/lib/supabase/server"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/dashboard/app-sidebar"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Obtener conteo de solicitudes pendientes para el badge del sidebar (solo relevante para superadmin)
  let pendingRequestsCount = 0
  if (user.role === "superadmin") {
    const supabase = await createClient()
    const { count } = await supabase
      .from("registration_requests")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending")
    pendingRequestsCount = count ?? 0
  }

  return (
    <SidebarProvider>
      <AppSidebar user={user} pendingRequestsCount={pendingRequestsCount} />
      <SidebarInset>
        <DashboardHeader />
        <div className="flex-1 overflow-auto p-6">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  )
}
