import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { ProfileForm } from "@/components/dashboard/profile/profile-form"

export default async function ProfilePage() {
  const user = await getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Mi Perfil</h1>
        <p className="text-muted-foreground">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <ProfileForm user={user} />
    </div>
  )
}