import Link from "next/link"
import { Building2, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function SignUpSuccessPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md text-center">
        <Link href="/" className="inline-flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="text-2xl font-bold text-foreground">GestEmp</span>
        </Link>

        <div className="mt-8 rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <h1 className="mt-6 text-2xl font-bold text-foreground">
            ¡Revisa tu correo!
          </h1>
          <p className="mt-4 text-muted-foreground">
            Hemos enviado un enlace de confirmación a tu correo electrónico.
            Haz clic en el enlace para activar tu cuenta y comenzar a usar GestEmp.
          </p>

          <div className="mt-8 space-y-3">
            <Button asChild className="w-full">
              <Link href="/auth/login">Ir a Iniciar Sesión</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/">Volver al Inicio</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
