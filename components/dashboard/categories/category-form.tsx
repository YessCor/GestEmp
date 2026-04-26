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
import { createCategory, updateCategory } from "./actions"
import type { Category } from "@/lib/types/database"

interface CategoryFormProps {
  category?: Category
  companies?: { id: string; name: string }[]
}

export function CategoryForm({ category, companies }: CategoryFormProps) {
  const router = useRouter()
  const isEditing = !!category

  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      if (isEditing) {
        return await updateCategory(category.id, formData)
      }
      return await createCategory(formData)
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

          {companies && companies.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="company_id">Empresa *</Label>
              <Select name="company_id" required>
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

          <div className="space-y-2">
            <Label htmlFor="name">Nombre de la categoría *</Label>
            <Input
              id="name"
              name="name"
              defaultValue={category?.name}
              placeholder="Electrónicos"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              defaultValue={category?.description || ""}
              placeholder="Descripción de la categoría"
            />
          </div>

          {isEditing && (
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="is_active">Categoría activa</Label>
                <p className="text-sm text-muted-foreground">
                  Las categorías inactivas no aparecen en productos
                </p>
              </div>
              <Switch
                id="is_active"
                name="is_active"
                defaultChecked={category?.is_active}
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
                : "Crear Categoría"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}