'use client'
import { useAuth } from '@/context/AuthContext'
import { PublicSidebar } from '@/components/layout/PublicSidebar'
import { TopNav } from '@/components/layout/TopNav'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'

/**
 * Casca compartilhada das páginas do doador (/painel, /perfil, /historico,
 * /meu-impacto). Responsiva: sidebar vira drawer no mobile e o conteúdo usa
 * md:ml-64 em vez de ml-64 fixo (que quebrava no celular).
 */
export function DonorShell({ children, title }: { children: React.ReactNode; title?: string }) {
  const { session, loading, isAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!session) router.replace('/login')
    else if (isAdmin) router.replace('/admin/dashboard')
  }, [session, loading, isAdmin, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-secondary" />
          <p className="text-sm font-inter text-on-surface-variant">Carregando…</p>
        </div>
      </div>
    )
  }

  if (!session || isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="font-inter text-sm text-on-surface-variant">Redirecionando…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <PublicSidebar />
      <div className="md:ml-64">
        <TopNav title={title} />
        <main className="p-5 sm:p-8 md:p-12 max-w-[1280px] mx-auto">{children}</main>
      </div>
    </div>
  )
}
