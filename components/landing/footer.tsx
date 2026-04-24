import Link from "next/link"
import { Building2 } from "lucide-react"

const footerLinks = {
  producto: [
    { label: "Características", href: "#caracteristicas" },
    { label: "Precios", href: "#precios" },
    { label: "Integraciones", href: "#" },
    { label: "Actualizaciones", href: "#" },
  ],
  empresa: [
    { label: "Sobre nosotros", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Carreras", href: "#" },
    { label: "Contacto", href: "#contacto" },
  ],
  soporte: [
    { label: "Centro de ayuda", href: "#" },
    { label: "Documentación", href: "#" },
    { label: "Guías", href: "#" },
    { label: "Estado del sistema", href: "#" },
  ],
  legal: [
    { label: "Privacidad", href: "#" },
    { label: "Términos", href: "#" },
    { label: "Cookies", href: "#" },
  ],
}

export function Footer() {
  return (
    <footer id="contacto" className="border-t border-border bg-card px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Building2 className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">GestEmp</span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              La plataforma de gestión empresarial más completa para hacer crecer tu negocio.
            </p>
            <div className="mt-6">
              <p className="text-sm font-medium text-foreground">Contáctanos</p>
              <a
                href="mailto:contacto@gestemp.com"
                className="mt-1 block text-sm text-muted-foreground hover:text-primary"
              >
                contacto@gestemp.com
              </a>
              <a
                href="tel:+1234567890"
                className="mt-1 block text-sm text-muted-foreground hover:text-primary"
              >
                +1 (234) 567-890
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Producto</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.producto.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Empresa</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.empresa.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-foreground">Soporte</h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.soporte.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} GestEmp by BIY Solutions. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            {footerLinks.legal.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
