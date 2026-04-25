"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

interface MessagesProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export function Messages({ searchParams }: MessagesProps) {
  const error = searchParams.error as string
  const success = searchParams.success as string

  if (!error && !success) return null

  return (
    <>
      {error && (
        <Alert variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
    </>
  )
}