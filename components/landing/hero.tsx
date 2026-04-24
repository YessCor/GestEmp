import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight, BarChart3, Package, Receipt, ShoppingCart } from "lucide-react"

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-20 sm:px-6 sm:py-32 lg:px-8">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-6 inline-flex items-center rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm font-medium text-muted-foreground">
            Plataforma de Gestión Empresarial
          </div>
          
          <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Gestiona tu empresa de forma{" "}
            <span className="text-primary">inteligente</span>
          </h1>
          
          <p className="mx-auto mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted-foreground">
            GestEmp es la plataforma SaaS todo-en-uno para gestionar inventario, ventas, 
            facturación y reportes. Diseñada para empresas que buscan crecer y optimizar 
            sus operaciones.
          </p>
          
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button size="lg" asChild className="w-full sm:w-auto">
              <Link href="/auth/sign-up">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="w-full sm:w-auto">
              <Link href="#caracteristicas">Ver Características</Link>
            </Button>
          </div>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            { icon: Package, label: "Inventario", desc: "Control total" },
            { icon: ShoppingCart, label: "Ventas", desc: "Punto de venta" },
            { icon: Receipt, label: "Facturación", desc: "Automatizada" },
            { icon: BarChart3, label: "Reportes", desc: "En tiempo real" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex flex-col items-center rounded-xl border border-border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="mt-4 font-semibold text-card-foreground">{item.label}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
