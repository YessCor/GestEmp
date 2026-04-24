"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { createCompany, updateCompany } from "./actions"
import type { Company } from "@/lib/types/database"

interface CompanyFormProps {
  company?: Company
}

export function CompanyForm({ company }: CompanyFormProps) {
  const router = useRouter()
  const isEditing = !!company

  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      if (isEditing) {
        return await updateCompany(company.id, formData)
      }
      return await createCompany(formData)
    },
    null
  )

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
              <Label htmlFor="name">Nombre de la empresa *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={company?.name}
                placeholder="Mi Empresa S.A."
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ruc">RUC / NIT *</Label>
              <Input
                id="ruc"
                name="ruc"
                defaultValue={company?.ruc}
                placeholder="12345678901"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              defaultValue={company?.address || ""}
              placeholder="Av. Principal 123"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="email">Correo electrónico</Label>
              <Input
                id="email"
                name="email"
                type="email"
                defaultValue={company?.email || ""}
                placeholder="contacto@empresa.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input
                id="phone"
                name="phone"
                defaultValue={company?.phone || ""}
                placeholder="+1 234 567 890"
              />
            </div>
          </div>

          {!isEditing && (
            <>
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Administrador de la Empresa</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Crea el usuario administrador que tendrá acceso completo a esta empresa
                </p>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="admin_email">Correo electrónico del administrador *</Label>
                    <Input
                      id="admin_email"
                      name="admin_email"
                      type="email"
                      placeholder="admin@empresa.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin_full_name">Nombre completo del administrador *</Label>
                    <Input
                      id="admin_full_name"
                      name="admin_full_name"
                      placeholder="Juan Pérez"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="admin_password">Contraseña del administrador *</Label>
                    <Input
                      id="admin_password"
                      name="admin_password"
                      type="password"
                      placeholder="Contraseña segura"
                      required
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {isEditing && (
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="is_active">Empresa activa</Label>
                <p className="text-sm text-muted-foreground">
                  Las empresas inactivas no pueden acceder al sistema
                </p>
              </div>
              <Switch
                id="is_active"
                name="is_active"
                defaultChecked={company?.is_active}
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
                : "Crear Empresa"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
