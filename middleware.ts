import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_PREFIXES = [
  '/',
  '/login',
  '/register',
  '/esqueci-senha',
  '/redefinir-senha',
  '/mapa',
  '/areas',
  '/projetos',
  '/doe',
  '/admin/login',
]

const PRIVATE_PREFIXES = ['/painel', '/historico', '/perfil', '/meu-impacto']
const ADMIN_PREFIXES   = ['/admin']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/_next') || pathname.includes('.')) return NextResponse.next()

  const isPublic = PUBLIC_PREFIXES.some((p) =>
    pathname === p || (p !== '/' && pathname.startsWith(p + '/')) || (p === '/' && pathname === '/')
  )
  if (isPublic) return NextResponse.next()

  let response = NextResponse.next({ request: { headers: request.headers } })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          response = NextResponse.next({ request: { headers: request.headers } })
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  const isPrivate = PRIVATE_PREFIXES.some((p) => pathname.startsWith(p))
  if (isPrivate && !user) return NextResponse.redirect(new URL('/login', request.url))

  const isAdmin = ADMIN_PREFIXES.some((p) => pathname.startsWith(p))
  if (isAdmin) {
    if (!user) return NextResponse.redirect(new URL('/admin/login', request.url))
    const { data: profile } = await supabase.from('profiles').select('tipo').eq('id', user.id).single()
    if (profile?.tipo !== 'admin') return NextResponse.redirect(new URL('/', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
