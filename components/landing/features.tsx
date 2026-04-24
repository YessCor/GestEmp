import {
  BarChart3,
  Box,
  Building2,
  FileText,
  Package,
  Settings,
  ShieldCheck,
  ShoppingCart,
  Users,
} from "lucide-react"

const features = [
  {
    icon: Package,
    title: "Gestión de Inventario",
    description:
      "Control completo de productos, stock en tiempo real, alertas de stock bajo y movimientos de inventario.",
  },
  {
    icon: ShoppingCart,
    title: "Punto de Venta (POS)",
    description:
      "Interfaz intuitiva para ventas rápidas, múltiples métodos de pago y gestión de descuentos.",
  },
  {
    icon: FileText,
    title: "Facturación Electrónica",
    description:
      "Genera facturas automáticamente, cumple con normativas fiscales y envía por correo.",
  },
  {
    icon: BarChart3,
    title: "Reportes y Dashboard",
    description:
      "Visualiza métricas clave, ventas por período, productos más vendidos y análisis de tendencias.",
  },
  {
    icon: Box,
    title: "Categorías de Productos",
    description:
      "Organiza tus productos en categorías personalizables para una mejor gestión.",
  },
  {
    icon: Users,
    title: "Gestión de Usuarios",
    description:
      "Administra empleados con roles y permisos diferenciados para cada nivel de acceso.",
  },
  {
    icon: Building2,
    title: "Multi-empresa",
    description:
      "Gestiona múltiples empresas desde una sola plataforma con datos completamente aislados.",
  },
  {
    icon: ShieldCheck,
    title: "Seguridad Avanzada",
    description:
      "Autenticación segura, encriptación de datos y backups automáticos de tu información.",
  },
  {
    icon: Settings,
    title: "Configuración Flexible",
    description:
      "Personaliza la plataforma según las necesidades específicas de tu negocio.",
  },
]

export function Features() {
  return (
    <section id="caracteristicas" className="px-4 py-20 sm:px-6 sm:py-28 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-balance text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Todo lo que necesitas para gestionar tu negocio
          </h2>
          <p className="mt-4 text-pretty text-lg leading-relaxed text-muted-foreground">
            GestEmp incluye todas las herramientas esenciales para optimizar las 
            operaciones de tu empresa.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group rounded-xl border border-border bg-card p-6 transition-all hover:border-primary/30 hover:shadow-md"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/20">
                <feature.icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="mt-4 text-lg font-semibold text-card-foreground">
                {feature.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
