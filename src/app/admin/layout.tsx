'use client'
import { useAuth } from '@/context/AuthContext'
import { AdminSidebar } from '@/components/layout/AdminSidebar'
import { TopNav } from '@/components/layout/TopNav'
import { usePathname, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { isAdmin, loading, session } = useAuth()
  const pathname = usePathname()
  const router = useRouter()

  // A página /admin/login tem layout próprio (não usa a sidebar).
  const isLoginRoute = pathname === '/admin/login'

  useEffect(() => {
    if (loading || isLoginRoute) return
    if (!session) router.replace('/admin/login')
    else if (!isAdmin) router.replace('/')
  }, [isAdmin, loading, session, router, isLoginRoute])

  // Login renderiza livre, sem chrome do painel.
  if (isLoginRoute) return <>{children}</>

  // Enquanto resolve a sessão, mostra um estado de carregamento — nunca tela vazia.
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    )
  }

  // Sem permissão: mostra um aviso curto enquanto o redirect acontece
  // (em vez de `return null`, que aparecia como página em branco).
  if (!session || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-6">
        <p className="font-inter text-sm text-on-surface-variant">
          Redirecionando…
        </p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="md:ml-64">
        <TopNav title="Painel Administrativo" />
        <main className="p-6 md:p-12 max-w-[1280px] mx-auto">{children}</main>
      </div>
    </div>
  )
}
