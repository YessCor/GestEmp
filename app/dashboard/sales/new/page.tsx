import { redirect } from "next/navigation"
import { getUser } from "@/app/auth/actions"
import { SaleForm } from "@/components/dashboard/sales/sale-form"
import { Messages } from "../messages"

interface NewSalePageProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export default async function NewSalePage({ searchParams }: NewSalePageProps) {
  const user = await getUser()

  if (!user || (user.role !== "admin" && user.role !== "superadmin")) {
    redirect("/dashboard")
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Nueva Venta</h1>
        <p className="text-muted-foreground">
          Registra una nueva venta
        </p>
      </div>

      <Messages searchParams={searchParams} />

      <SaleForm />
    </div>
  )
}