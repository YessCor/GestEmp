"use client"

import { useActionState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { updateProfile } from "@/app/dashboard/profile/actions"
import type { UserWithCompany } from "@/lib/types/database"

interface ProfileFormProps {
  user: UserWithCompany
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, null)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Información Personal</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nombre Completo</Label>
            <Input
              id="full_name"
              name="full_name"
              defaultValue={user.full_name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input
              id="email"
              name="email"
              type="email"
              defaultValue={user.email}
              required
              readOnly={user.role !== "superadmin"}
              className={user.role !== "superadmin" ? "bg-muted" : ""}
            />
            {user.role !== "superadmin" && (
              <p className="text-sm text-muted-foreground">
                Solo el super administrador puede modificar el correo electrónico
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="current_password">Contraseña Actual (solo si deseas cambiarla)</Label>
            <Input
              id="current_password"
              name="current_password"
              type="password"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="new_password">Nueva Contraseña</Label>
            <Input
              id="new_password"
              name="new_password"
              type="password"
            />
          </div>

          {state?.error && (
            <div className="text-sm text-destructive">{state.error}</div>
          )}

          <Button type="submit" disabled={isPending}>
            {isPending ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}