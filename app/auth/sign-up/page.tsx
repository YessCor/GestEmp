"use client"

import Link from "next/link"
import { useState } from "react"
import { useActionState } from "react"
import { Building2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { signUp } from "../actions"

type RegisterType = "user" | "company"

export default function SignUpPage() {
  const [registerType, setRegisterType] = useState<RegisterType>("user")
  const [state, formAction, isPending] = useActionState(
    async (_: unknown, formData: FormData) => {
      formData.set("type", registerType)
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
            Crear Cuenta
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {registerType === "user" ? "Gestiona tus deudas personales" : "Administra tu empresa"}
          </p>
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          {/* Toggle User / Company */}
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-lg bg-muted p-1">
            <button
              type="button"
              onClick={() => setRegisterType("user")}
              className={`flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                registerType === "user"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <User className="h-4 w-4" />
              👤 Usuario
            </button>
            <button
              type="button"
              onClick={() => setRegisterType("company")}
              className={`flex items-center justify-center gap-2 rounded-md px-4 py-2.5 text-sm font-medium transition-all ${
                registerType === "company"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Building2 className="h-4 w-4" />
              🏢 Empresa
            </button>
          </div>

          <form action={formAction} className="space-y-5">
            {state?.error && (
              <div className="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                {state.error}
              </div>
            )}

            {registerType === "company" && (
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
                    required={registerType === "company"}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="companyRuc">RUC / NIT</Label>
                  <Input
                    id="companyRuc"
                    name="companyRuc"
                    type="text"
                    placeholder="12345678901"
                    required={registerType === "company"}
                  />
                </div>
              </div>
            )}

            <div className="space-y-4 rounded-lg bg-muted/50 p-4">
              <h3 className="text-sm font-medium text-foreground">
                {registerType === "company" ? "Datos del Responsable" : "Datos Personales"}
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
              <div className="space-y-2">
                <Label htmlFor="password">Contraseña</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Registrando..." : "Registrarse"}
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
