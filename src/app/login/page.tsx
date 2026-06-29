'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { signIn } from '@/services/authService'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import Link from 'next/link'
import { Loader2, Mail, Lock, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const { session, profile, loading: authLoading } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!authLoading && session && profile) {
      if (profile.tipo === 'admin') {
        router.replace('/admin/dashboard')
      } else {
        router.replace('/painel')
      }
    }
  }, [authLoading, session, profile, router])

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await signIn(email, password)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao entrar'
      if (msg.includes('Invalid login credentials')) {
        setError('E-mail ou senha incorretos.')
      } else if (msg.includes('Email not confirmed')) {
        setError('Confirme seu e-mail antes de entrar. Verifique sua caixa de entrada.')
      } else if (msg.includes('Too many requests')) {
        setError('Muitas tentativas. Aguarde alguns minutos e tente novamente.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary-container/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white border border-outline-variant rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-primary px-10 py-8">
            <div className="flex items-center gap-3">
              <Image
                src="/iracambi-logo.jpeg"
                alt="Logo Iracambi"
                width={44}
                height={44}
                className="rounded-xl object-cover"
              />
              <div>
                <h1 className="font-manrope font-bold text-white text-xl tracking-tight">
                  Iracambi Raiz Verde
                </h1>
                <p className="text-on-primary-container text-xs font-inter mt-0.5">
                  Plataforma de Transparência Ambiental
                </p>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="font-manrope font-semibold text-white text-2xl">
                Bem-vindo de volta
              </h2>
              <p className="text-on-primary-container text-sm font-inter mt-1">
                Entre com suas credenciais para continuar
              </p>
            </div>
          </div>

          <div className="px-10 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">
                  E-mail
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="w-full border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-inter text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors placeholder:text-on-surface-variant/50"
                    placeholder="seu@email.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">
                  Senha
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    className="w-full border border-outline-variant rounded-xl pl-10 pr-11 py-3 text-sm font-inter text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors placeholder:text-on-surface-variant/50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="flex justify-end">
                <Link
                  href="/esqueci-senha"
                  className="text-sm font-inter text-secondary hover:text-primary transition-colors underline underline-offset-2"
                >
                  Esqueci minha senha
                </Link>
              </div>

              {error && (
                <div className="flex items-start gap-2.5 bg-error-container border border-error/20 rounded-xl px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-error mt-1.5 shrink-0" />
                  <p className="text-sm font-inter text-error leading-snug">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-white font-inter font-semibold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 text-sm tracking-wide"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Entrando...
                  </>
                ) : (
                  'Entrar'
                )}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3">
              <div className="flex-1 h-px bg-outline-variant" />
              <span className="text-xs font-inter text-on-surface-variant">ou</span>
              <div className="flex-1 h-px bg-outline-variant" />
            </div>

            <p className="text-center text-sm font-inter text-on-surface-variant">
              Não possui conta?{' '}
              <Link
                href="/register"
                className="text-secondary font-semibold hover:text-primary transition-colors underline underline-offset-2"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </div>

        <p className="text-center text-xs font-inter text-on-surface-variant mt-6">
          © {new Date().getFullYear()} Iracambi Raiz Verde — Reflorestamento com Transparência
        </p>
      </div>
    </div>
  )
}
