import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { Wrench } from "lucide-react"

export default async function SettingsPage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">
          Configura los ajustes de tu cuenta y empresa
        </p>
      </div>

      <div className="text-center py-8">
        <Wrench className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">Página de configuración en desarrollo</p>
      </div>
    </div>
  )
}