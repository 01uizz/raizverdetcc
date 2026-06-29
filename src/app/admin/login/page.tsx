'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { signIn } from '@/services/authService'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { Loader2, Mail, Lock, Shield } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const { session, isAdmin, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && session && isAdmin) {
      router.replace('/admin/dashboard')
    }
  }, [authLoading, session, isAdmin, router])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
      // middleware vai verificar se é admin e redirecionar
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro'
      if (msg.includes('Invalid login credentials')) {
        setError('Credenciais inválidas.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-primary flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-white" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-primary-container flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-primary px-8 py-6 flex flex-col items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div className="text-center">
              <h1 className="font-manrope font-bold text-white text-lg">Área Administrativa</h1>
              <p className="text-xs font-inter text-on-primary-container mt-0.5">
                Acesso restrito a administradores
              </p>
            </div>
          </div>

          <div className="px-8 py-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="E-mail do administrador"
                  className="w-full border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-inter focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Senha"
                  className="w-full border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-inter focus:outline-none focus:ring-1 focus:ring-secondary"
                />
              </div>

              {error && (
                <div className="bg-error-container border border-error/20 rounded-xl px-4 py-3">
                  <p className="text-xs font-inter text-error">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-inter font-semibold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
              >
                {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                Entrar como administrador
              </button>
            </form>
          </div>
        </div>

        <p className="text-center text-xs font-inter text-on-surface-variant mt-4">
          <a href="/" className="hover:text-primary transition-colors">← Voltar ao site</a>
        </p>
      </div>
    </div>
  )
}
