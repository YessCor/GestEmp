import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          )
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          )
        },
      },
    },
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Rutas públicas que no requieren autenticación
  const publicRoutes = ['/', '/auth/login', '/auth/sign-up', '/auth/callback', '/auth/error', '/auth/registro-exitoso', '/auth/sign-up-success']
  const isPublicRoute = publicRoutes.some(route => request.nextUrl.pathname === route)

  // Si el usuario intenta acceder al dashboard sin estar autenticado
  if (request.nextUrl.pathname.startsWith('/dashboard') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth/login'
    return NextResponse.redirect(url)
  }

  // Si el usuario autenticado intenta acceder a páginas de auth, redirigir al dashboard
  if (user && (request.nextUrl.pathname.startsWith('/auth/login') || request.nextUrl.pathname.startsWith('/auth/sign-up'))) {
    // Obtener el rol del usuario para redirigir al dashboard correspondiente
    const { data: profile } = await supabase
      .from('users')
      .select('role')
      .eq('id', user.id)
      .single()

    const url = request.nextUrl.clone()
    if (profile?.role === 'empresa') {
      url.pathname = '/dashboard/empresa'
    } else {
      url.pathname = '/dashboard'
    }
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
