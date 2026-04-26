import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { InvoiceForm } from "@/components/dashboard/invoices/invoice-form"
import { Messages } from "../messages"

interface NewInvoicePageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function NewInvoicePage({ searchParams }: NewInvoicePageProps) {
  const user = await getUser()

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/dashboard")
  }

  if (!user.company_id) {
    return (
      <div className="mx-auto max-w-2xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Nueva Factura</h1>
          <p className="text-muted-foreground">
            Emite una nueva factura
          </p>
        </div>
        <Messages searchParams={{ error: "Tu usuario no tiene una empresa asignada. Contacta al administrador." }} />
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nueva Factura</h1>
        <p className="text-muted-foreground">
          Emite una nueva factura
        </p>
      </div>

      <Messages searchParams={searchParams} />

      <InvoiceForm />
    </div>
  )
}