import { createClient } from "@supabase/supabase-js"

/**
 * Cliente Supabase con service_role para operaciones de administración.
 * SOLO debe usarse en Server Actions o Route Handlers, NUNCA en el cliente.
 */
export function createAdminClient() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY no está definida en las variables de entorno."
    )
  }

  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
