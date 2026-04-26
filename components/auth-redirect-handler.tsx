"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

/**
 * Este componente detecta si el usuario viene de un enlace de Supabase
 * (confirmación, recuperación, etc) que haya caído en la Home por falta de permisos
 * en los Redirect URLs de Supabase, y lo redirige a la página correcta.
 */
export function AuthRedirectHandler() {
  const router = useRouter()

  useEffect(() => {
    // Supabase envía los tokens en el hash (#)
    const hash = window.location.hash
    
    if (hash && (
      hash.includes("type=recovery") || 
      hash.includes("type=invite") || 
      hash.includes("type=signup") ||
      hash.includes("access_token=")
    )) {
      console.log("[AuthRedirect] Detectado token en hash, redirigiendo a reset-password...")
      // Redirigimos a la página de establecer contraseña preservando el hash (donde está el token)
      router.replace("/auth/reset-password" + hash)
    }
  }, [router])

  return null
}
