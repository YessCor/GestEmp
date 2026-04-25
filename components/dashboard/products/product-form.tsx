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
import { createProduct, updateProduct } from "./actions"
import type { Product } from "@/lib/types/database"

interface ProductFormProps {
  product?: Product
  categories: { id: string; name: string }[]
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter()
  const isEditing = !!product

  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      if (isEditing) {
        return await updateProduct(product.id, formData)
      }
      return await createProduct(formData)
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
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                name="sku"
                defaultValue={product?.sku}
                placeholder="PROD-001"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nombre del producto *</Label>
              <Input
                id="name"
                name="name"
                defaultValue={product?.name}
                placeholder="Producto ejemplo"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción</Label>
            <Input
              id="description"
              name="description"
              defaultValue={product?.description || ""}
              placeholder="Descripción del producto"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Categoría</Label>
            <Select
              name="category_id"
              defaultValue={product?.category_id || undefined}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar categoría" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="purchase_price">Precio de compra</Label>
              <Input
                id="purchase_price"
                name="purchase_price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.purchase_price || ""}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sale_price">Precio de venta *</Label>
              <Input
                id="sale_price"
                name="sale_price"
                type="number"
                step="0.01"
                min="0"
                defaultValue={product?.sale_price || ""}
                placeholder="0.00"
                required
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="current_stock">Stock actual</Label>
              <Input
                id="current_stock"
                name="current_stock"
                type="number"
                min="0"
                defaultValue={product?.current_stock || 0}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="min_stock">Stock mínimo</Label>
              <Input
                id="min_stock"
                name="min_stock"
                type="number"
                min="0"
                defaultValue={product?.min_stock || 0}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="unit">Unidad</Label>
              <Input
                id="unit"
                name="unit"
                defaultValue={product?.unit || "unidad"}
                placeholder="unidad"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="image_url">URL de imagen</Label>
            <Input
              id="image_url"
              name="image_url"
              type="url"
              defaultValue={product?.image_url || ""}
              placeholder="https://ejemplo.com/imagen.jpg"
            />
          </div>

          {isEditing && (
            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div>
                <Label htmlFor="is_active">Producto activo</Label>
                <p className="text-sm text-muted-foreground">
                  Los productos inactivos no aparecen en las ventas
                </p>
              </div>
              <Switch
                id="is_active"
                name="is_active"
                defaultChecked={product?.is_active}
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
                : "Crear Producto"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}