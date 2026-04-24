import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

const plans = [
  {
    name: "Básico",
    description: "Para pequeños negocios que están comenzando",
    price: "29",
    currency: "$",
    period: "/mes",
    features: [
      "1 usuario",
      "Hasta 500 productos",
      "Gestión de inventario",
      "Punto de venta básico",
      "Reportes esenciales",
      "Soporte por email",
    ],
    popular: false,
    cta: "Comenzar",
    href: "/auth/sign-up?plan=basic",
  },
  {
    name: "Profesional",
    description: "Para empresas en crecimiento",
    price: "79",
    currency: "$",
    period: "/mes",
    features: [
      "5 usuarios",
      "Productos ilimitados",
      "Gestión de inventario avanzada",
      "Punto de venta completo",
      "Facturación electrónica",
      "Reportes avanzados",
      "Dashboard personalizado",
      "Soporte prioritario",
    ],
    popular: true,
    cta: "Comenzar",
    href: "/auth/sign-up?plan=pro",
  },
  {
    name: "Empresa",
    description: "Para grandes empresas con necesidades especiales",
    price: "199",
    currency: "$",
    period: "/mes",
    features: [
      "Usuarios ilimitados",
      "Productos ilimitados",
      "Todas las funcionalidades",
      "Multi-sucursal",
      "API de integración",
      "Reportes personalizados",
      "Capacitación incluida",
      "Soporte dedicado 24/7",
      "SLA garantizado",
    ],
    popular: false,
    cta: "Contactar",
    href: "#contacto",
  },
]

export function Pricing() {
  return (
    <section id="precios" className="bg-muted/30 px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Planes simples y transparentes
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            Elige el plan que mejor se adapte a las necesidades de tu negocio. 
            Sin costos ocultos ni contratos de permanencia.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={cn(
                "relative flex flex-col rounded-2xl border bg-card p-8",
                plan.popular
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-sm font-medium text-primary-foreground">
                  Más Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-semibold text-card-foreground">
                  {plan.name}
                </h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <div className="mb-6 flex items-baseline">
                <span className="text-sm text-muted-foreground">{plan.currency}</span>
                <span className="text-5xl font-bold tracking-tight text-card-foreground">
                  {plan.price}
                </span>
                <span className="ml-1 text-muted-foreground">{plan.period}</span>
              </div>

              <ul className="mb-8 flex-1 space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span className="text-sm text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={plan.popular ? "default" : "outline"}
                className="w-full"
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
