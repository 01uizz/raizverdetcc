// Rota /admin: ponto de entrada do painel.
// É um Client Component que decide o destino com base na sessão/permissão,
// evitando a tela em branco que acontecia quando o redirect no servidor
// competia com a verificação de auth no cliente.
'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'

export default function AdminIndexPage() {
  const router = useRouter()
  const { loading, session, isAdmin } = useAuth()

  useEffect(() => {
    if (loading) return
    if (!session) router.replace('/admin/login')
    else if (!isAdmin) router.replace('/')
    else router.replace('/admin/dashboard')
  }, [loading, session, isAdmin, router])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="w-9 h-9 border-[3px] border-secondary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}
