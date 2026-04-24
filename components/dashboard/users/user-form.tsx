"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createUser, updateUser } from "./actions"
import type { User, UserRole } from "@/lib/types/database"

interface UserFormProps {
  user?: User
  companies: { id: string; name: string }[]
  currentUserRole: UserRole
}

export function UserForm({ user, companies, currentUserRole }: UserFormProps) {
  const router = useRouter()
  const isEditing = !!user

  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      if (isEditing) {
        return await updateUser(user.id, formData)
      }
      return await createUser(formData)
    },
    null
  )

  const availableRoles: { value: UserRole; label: string }[] =
    currentUserRole === "superadmin"
      ? [
          { value: "superadmin", label: "Superadmin" },
          { value: "admin", label: "Administrador" },
          { value: "empleado", label: "Empleado" },
        ]
      : [
          { value: "admin", label: "Administrador" },
          { value: "empleado", label: "Empleado" },
        ]

  return (
    <Card>
      <form action={formAction}>
        <CardContent className="space-y-6 pt-6">
          {state?.error && (
            <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
              {state.error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="full_name">Nombre completo *</Label>
              <Input
                id="full_name"
                name="full_name"
                defaultValue={user?.full_name}
                placeholder="Juan Pérez"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={user?.email}
                placeholder="usuario@email.com"
                required
                disabled={isEditing}
              />
            </div>
          </div>

          {!isEditing && (
            <div className="space-y-2">
              <Label htmlFor="password">Contraseña *</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                minLength={8}
                required
              />
              <p className="text-xs text-muted-foreground">
                Mínimo 8 caracteres
              </p>
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {currentUserRole === "superadmin" && (
              <div className="space-y-2">
                <Label htmlFor="company_id">Empresa</Label>
                <Select
                  name="company_id"
                  defaultValue={user?.company_id || undefined}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar empresa" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((company) => (
                      <SelectItem key={company.id} value={company.id}>
                        {company.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {currentUserRole === "admin" && companies.length > 0 && (
              <input type="hidden" name="company_id" value={companies[0].id} />
            )}

            <div className="space-y-2">
              <Label htmlFor="role">Rol *</Label>
              <Select name="role" defaultValue={user?.role || "empleado"}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar rol" />
                </SelectTrigger>
                <SelectContent>
                  {availableRoles.map((role) => (
                    <SelectItem key={role.value} value={role.value}>
                      {role.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {isEditing && (
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="is_active">Usuario activo</Label>
                <p className="text-sm text-muted-foreground">
                  Los usuarios inactivos no pueden acceder al sistema
                </p>
              </div>
              <Switch
                id="is_active"
                name="is_active"
                defaultChecked={user?.is_active}
              />
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? isEditing
                ? "Guardando..."
                : "Creando..."
              : isEditing
                ? "Guardar Cambios"
                : "Crear Usuario"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
