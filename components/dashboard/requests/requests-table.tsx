"use client"

import { useState, useTransition } from "react"
import { format } from "date-fns"
import { es } from "date-fns/locale"
import {
  Check,
  X,
  Clock,
  Building2,
  User,
  Mail,
  FileText,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import type { RegistrationRequest } from "@/lib/types/database"
import { approveRequest, rejectRequest } from "./actions"

interface RequestsTableProps {
  requests: RegistrationRequest[]
}

const statusConfig = {
  pending: {
    label: "Pendiente",
    variant: "outline" as const,
    className: "border-amber-500/50 text-amber-500 bg-amber-500/10",
    icon: Clock,
  },
  approved: {
    label: "Aprobada",
    variant: "outline" as const,
    className: "border-emerald-500/50 text-emerald-500 bg-emerald-500/10",
    icon: Check,
  },
  rejected: {
    label: "Rechazada",
    variant: "outline" as const,
    className: "border-destructive/50 text-destructive bg-destructive/10",
    icon: X,
  },
}

export function RequestsTable({ requests }: RequestsTableProps) {
  const [isPending, startTransition] = useTransition()
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [rejectReason, setRejectReason] = useState("")
  const [actionMessage, setActionMessage] = useState<{
    type: "success" | "error"
    text: string
  } | null>(null)

  const handleApprove = (id: string) => {
    startTransition(async () => {
      const result = await approveRequest(id)
      if (result.error) {
        setActionMessage({ type: "error", text: result.error })
      } else {
        setActionMessage({
          type: "success",
          text: "Solicitud aprobada. El usuario recibirá un email para configurar su contraseña.",
        })
      }
      setTimeout(() => setActionMessage(null), 5000)
    })
  }

  const handleRejectOpen = (id: string) => {
    setSelectedId(id)
    setRejectReason("")
    setRejectDialogOpen(true)
  }

  const handleRejectConfirm = () => {
    if (!selectedId) return
    startTransition(async () => {
      const result = await rejectRequest(selectedId, rejectReason)
      setRejectDialogOpen(false)
      if (result.error) {
        setActionMessage({ type: "error", text: result.error })
      } else {
        setActionMessage({ type: "success", text: "Solicitud rechazada correctamente." })
      }
      setTimeout(() => setActionMessage(null), 4000)
    })
  }

  if (requests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
          <FileText className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Sin solicitudes</h3>
        <p className="text-sm text-muted-foreground mt-1">
          No hay solicitudes de registro en este momento.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Mensaje de acción */}
      {actionMessage && (
        <div
          className={`flex items-center gap-2 rounded-lg p-3 text-sm ${
            actionMessage.type === "success"
              ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/20"
              : "bg-destructive/10 text-destructive border border-destructive/20"
          }`}
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {actionMessage.text}
        </div>
      )}

      {/* Tabla */}
      <div className="rounded-xl border border-border bg-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Solicitante
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Empresa
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Fecha
                </th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Estado
                </th>
                <th className="text-right px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {requests.map((request) => {
                const status = statusConfig[request.status]
                const StatusIcon = status.icon

                return (
                  <tr
                    key={request.id}
                    className="hover:bg-muted/30 transition-colors"
                  >
                    {/* Solicitante */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {request.full_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            {request.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Empresa */}
                    <td className="px-4 py-4">
                      <div className="flex flex-col gap-0.5">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-sm font-medium text-foreground">
                            {request.company_name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-xs text-muted-foreground">
                            RUC: {request.company_ruc}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Fecha */}
                    <td className="px-4 py-4">
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(request.created_at), "dd MMM yyyy, HH:mm", {
                          locale: es,
                        })}
                      </span>
                      {request.rejection_reason && (
                        <p className="text-xs text-destructive mt-1 max-w-[180px] truncate">
                          Motivo: {request.rejection_reason}
                        </p>
                      )}
                    </td>

                    {/* Estado */}
                    <td className="px-4 py-4">
                      <Badge
                        variant={status.variant}
                        className={`flex w-fit items-center gap-1.5 ${status.className}`}
                      >
                        <StatusIcon className="h-3 w-3" />
                        {status.label}
                      </Badge>
                    </td>

                    {/* Acciones */}
                    <td className="px-4 py-4 text-right">
                      {request.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-emerald-500/50 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-600 h-8"
                            onClick={() => handleApprove(request.id)}
                            disabled={isPending}
                          >
                            <Check className="h-3.5 w-3.5 mr-1" />
                            Aprobar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-destructive/50 text-destructive hover:bg-destructive/10 hover:text-destructive h-8"
                            onClick={() => handleRejectOpen(request.id)}
                            disabled={isPending}
                          >
                            <X className="h-3.5 w-3.5 mr-1" />
                            Rechazar
                          </Button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          {request.reviewed_at
                            ? format(new Date(request.reviewed_at), "dd MMM yyyy", {
                                locale: es,
                              })
                            : "—"}
                        </span>
                      )}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Dialog de rechazo */}
      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Rechazar Solicitud</DialogTitle>
            <DialogDescription>
              Puedes indicar el motivo del rechazo. El administrador del sistema
              podrá verlo para referencia interna.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="rejection-reason">Motivo del rechazo (opcional)</Label>
            <Textarea
              id="rejection-reason"
              placeholder="Ej: RUC inválido, empresa ya registrada, datos incompletos..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setRejectDialogOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleRejectConfirm}
              disabled={isPending}
            >
              {isPending ? "Rechazando..." : "Confirmar Rechazo"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
