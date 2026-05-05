"use client"

import Link from "next/link"
import { useActionState } from "react"
import { Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUp } from "../actions"

export default function SignUpPage() {
  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      return await signUp(formData)
    },
    null
  )

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <Building2 className="h-6 w-6 text-primary-foreground" />
            </div>
            <span className="text-2xl font-bold text-foreground">GestEmp</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold text-foreground">
            Solicitar Acceso
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Envía tu solicitud para registrar tu empresa. Un administrador la revisará y recibirás un email de confirmación.
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}

            <div className="space-y-4 rounded-lg bg-muted/50 p-4">
              <h3 className="text-sm font-medium text-foreground">
                Datos de la Empresa
              </h3>
              <div className="space-y-2">
                <Label htmlFor="companyName">Nombre de la empresa</Label>
                <Input
                  id="companyName"
                  name="companyName"
                  type="text"
                  placeholder="Mi Empresa S.A."
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="companyRuc">RUC / NIT</Label>
                <Input
                  id="companyRuc"
                  name="companyRuc"
                  type="text"
                  placeholder="12345678901"
                  required
                />
              </div>
            </div>

            <div className="space-y-4 rounded-lg bg-muted/50 p-4">
              <h3 className="text-sm font-medium text-foreground">
                Datos del Administrador
              </h3>
              <div className="space-y-2">
                <Label htmlFor="fullName">Nombre completo</Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="tu@email.com"
                  required
                  autoComplete="email"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Enviando solicitud..." : "Enviar Solicitud"}
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Al registrarte, aceptas nuestros{" "}
              <Link href="#" className="text-primary hover:underline">
                Términos de Servicio
              </Link>{" "}
              y{" "}
              <Link href="#" className="text-primary hover:underline">
                Política de Privacidad
              </Link>
            </p>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            ¿Ya tienes una cuenta?{" "}
            <Link href="/auth/login" className="font-medium text-primary hover:underline">
              Inicia sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
