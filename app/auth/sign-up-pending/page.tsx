import Link from "next/link"
import { Building2, Clock, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignUpPendingPage() {
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
        </div>

        <div className="rounded-xl border border-border bg-card p-8 shadow-sm text-center space-y-6">
          {/* Icono animado */}
          <div className="flex justify-center">
            <div className="relative flex h-20 w-20 items-center justify-center">
              <div className="absolute inset-0 animate-ping rounded-full bg-amber-500/20" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 border-2 border-amber-500/30">
                <Clock className="h-8 w-8 text-amber-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">
              Solicitud Enviada
            </h1>
            <p className="text-muted-foreground">
              Tu solicitud de registro ha sido recibida correctamente y está
              pendiente de revisión por parte del administrador.
            </p>
          </div>

          {/* Pasos */}
          <div className="rounded-lg bg-muted/50 p-4 text-left space-y-3">
            <h3 className="text-sm font-semibold text-foreground">¿Qué sigue?</h3>
            <div className="space-y-2.5">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  El administrador revisará los datos de tu empresa.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  Si es aprobada, recibirás un correo electrónico para
                  configurar tu contraseña y acceder a tu cuenta.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-4 w-4 mt-0.5 text-emerald-500 shrink-0" />
                <p className="text-sm text-muted-foreground">
                  El proceso puede tardar hasta 24 horas hábiles.
                </p>
              </div>
            </div>
          </div>

          <Button asChild variant="outline" className="w-full">
            <Link href="/auth/login">Volver al inicio de sesión</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
