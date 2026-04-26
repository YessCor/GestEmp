"use client"

import { useEffect, useState } from "react"
import { updatePassword } from "./actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Lock, Loader2, ShieldCheck, Eye, EyeOff, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { createClient } from "@/lib/supabase/client"
import Link from "next/link"

export default function ResetPasswordPage() {
  const [loading, setLoading] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const handleAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setSessionReady(true)
        return
      }

      const hash = window.location.hash
      if (hash && hash.includes("access_token")) {
        const params = new URLSearchParams(hash.substring(1))
        const accessToken = params.get("access_token")
        const refreshToken = params.get("refresh_token")

        if (accessToken && refreshToken) {
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })
          if (!error) {
            setSessionReady(true)
          } else {
            toast.error("El enlace ha expirado o no es válido")
          }
        }
      } else {
        // Un pequeño delay por si el hash tarda en parsearse
        setTimeout(async () => {
          const { data: { session: retry } } = await supabase.auth.getSession()
          if (retry) setSessionReady(true)
          else toast.error("No se detectó una sesión válida")
        }, 1500)
      }
    }
    handleAuth()
  }, [supabase])

  async function handleSubmit(formData: FormData) {
    const password = formData.get("password") as string
    const confirm = formData.get("confirmPassword") as string

    if (password.length < 6) {
      toast.error("La contraseña debe ser más robusta (mín. 6 caracteres)")
      return
    }

    if (password !== confirm) {
      toast.error("Las contraseñas no coinciden")
      return
    }

    setLoading(true)
    const result = await updatePassword(formData)
    
    if (result?.error) {
      toast.error(result.error)
      setLoading(false)
    } else {
      toast.success("¡Contraseña guardada! Bienvenido a GestEmp")
    }
  }

  if (!sessionReady) {
    return (
      <div className="relative min-h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden">
        {/* Background Gradient similar to Hero */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        
        <div className="text-center space-y-6 animate-in fade-in duration-700">
          <div className="relative">
            <div className="absolute inset-0 blur-2xl bg-primary/20 rounded-full" />
            <Loader2 className="w-16 h-16 animate-spin text-primary relative mx-auto" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-semibold tracking-tight">Verificando seguridad</h2>
            <p className="text-muted-foreground text-sm max-w-[200px] mx-auto">Sincronizando tus credenciales con el servidor...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-background p-4 overflow-hidden">
      {/* Background Aesthetic */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/15 via-background to-background" />
      
      {/* Floating Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full -z-10" />

      <div className="w-full max-w-md space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-block hover:opacity-80 transition-opacity">
            <h1 className="text-3xl font-extrabold tracking-tighter text-foreground">
              Gest<span className="text-primary">Emp</span>
            </h1>
          </Link>
        </div>

        <Card className="border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden relative">
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent" />
          
          <CardHeader className="space-y-2 text-center pb-8">
            <div className="mx-auto w-14 h-14 bg-primary/10 rounded-2xl flex items-center justify-center mb-2 rotate-3 transition-transform hover:rotate-0">
              <ShieldCheck className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold tracking-tight">Configura tu acceso</CardTitle>
            <CardDescription className="text-balance px-4">
              Tu solicitud ha sido aprobada. Por favor, establece una contraseña para tu nueva empresa.
            </CardDescription>
          </CardHeader>

          <form action={handleSubmit}>
            <CardContent className="space-y-5">
              <div className="space-y-2 group">
                <Label htmlFor="password">Nueva Contraseña</Label>
                <div className="relative">
                  <Input 
                    id="password" 
                    name="password" 
                    type={showPassword ? "text" : "password"} 
                    placeholder="Mínimo 6 caracteres" 
                    required 
                    minLength={6}
                    className="pr-10 bg-background/50 border-border/50 focus:border-primary transition-colors h-11"
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Contraseña</Label>
                <Input 
                  id="confirmPassword" 
                  name="confirmPassword" 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Repite tu contraseña" 
                  required 
                  minLength={6}
                  className="bg-background/50 border-border/50 focus:border-primary transition-colors h-11"
                />
              </div>

              <div className="bg-muted/30 rounded-lg p-3 border border-border/50 flex gap-3 items-start">
                <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Tu contraseña debe ser segura. Te recomendamos usar una combinación de letras, números y símbolos.
                </p>
              </div>
            </CardContent>

            <CardFooter className="pt-2 pb-8">
              <Button 
                type="submit" 
                className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all duration-300 active:scale-[0.98]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  "Finalizar Configuración"
                )}
              </Button>
            </CardFooter>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          ¿Necesitas ayuda? <Link href="#" className="text-primary hover:underline font-medium">Contactar soporte</Link>
        </p>
      </div>
    </div>
  )
}
