'use client'
import { useState } from 'react'
import Link from 'next/link'
import { signIn } from '@/services/authService'
import { Loader2, Mail, Lock, User, ArrowRight } from 'lucide-react'

export interface DonorIdentity {
  nome: string
  email: string
}

interface Props {
  // Recebe a identidade do doador (convidado ou logado) e avança.
  onIdentified: (identity: DonorIdentity) => void
}

/**
 * Passo de identificação UNIFICADO e claro.
 * Padrão: doar como convidado (nome + e-mail só para comprovante, SEM criar conta).
 * Opcional: quem já tem conta pode entrar para acompanhar a doação no painel.
 * Não há mais criação de conta com senha aleatória.
 */
export function StepAuth({ onIdentified }: Props) {
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [showLogin, setShowLogin] = useState(false)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function handleGuest(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!nome.trim()) return setError('Informe seu nome.')
    if (!email.includes('@')) return setError('Informe um e-mail válido.')
    onIdentified({ nome: nome.trim(), email: email.trim() })
  }

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const data = await signIn(email, password)
      const meta = (data?.user?.user_metadata ?? {}) as { nome?: string }
      onIdentified({ nome: meta.nome ?? email.split('@')[0], email })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro'
      setError(msg.includes('Invalid login credentials') ? 'E-mail ou senha incorretos.' : msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="font-manrope font-semibold text-primary mb-1">
          {showLogin ? 'Entrar para doar' : 'Quase lá'}
        </p>
        <p className="text-xs font-inter text-on-surface-variant">
          {showLogin
            ? 'Acesse sua conta para vincular a doação ao seu histórico.'
            : 'Precisamos do seu nome e e-mail apenas para emitir o comprovante. Não é preciso criar conta.'}
        </p>
      </div>

      {!showLogin ? (
        <form onSubmit={handleGuest} className="space-y-4">
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input value={nome} onChange={(e) => setNome(e.target.value)} required placeholder="Seu nome" autoComplete="name"
              className="w-full border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-inter text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary" />
          </div>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" autoComplete="email"
              className="w-full border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-inter text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary" />
          </div>

          {error && <ErrorBox msg={error} />}

          <button type="submit"
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-inter font-semibold py-3 rounded-xl hover:bg-primary-container transition-colors text-sm">
            Continuar para o pagamento <ArrowRight className="w-4 h-4" />
          </button>

          <button type="button" onClick={() => { setShowLogin(true); setError(null) }}
            className="w-full text-center text-xs font-inter text-on-surface-variant hover:text-primary transition-colors">
            Já tem conta? <span className="text-secondary font-semibold">Entrar</span>
          </button>
        </form>
      ) : (
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="seu@email.com" autoComplete="email"
              className="w-full border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-inter text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary" />
          </div>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Senha" autoComplete="current-password"
              className="w-full border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-inter text-on-surface focus:outline-none focus:ring-1 focus:ring-secondary" />
          </div>

          {error && <ErrorBox msg={error} />}

          <button type="submit" disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-inter font-semibold py-3 rounded-xl hover:bg-primary-container disabled:opacity-60 transition-colors text-sm">
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Entrar e continuar
          </button>

          <div className="flex items-center justify-between text-xs font-inter">
            <button type="button" onClick={() => { setShowLogin(false); setError(null) }}
              className="text-on-surface-variant hover:text-primary transition-colors">
              ← Doar como convidado
            </button>
            <Link href="/esqueci-senha" className="text-secondary hover:text-primary">Esqueci a senha</Link>
          </div>
        </form>
      )}
    </div>
  )
}

function ErrorBox({ msg }: { msg: string }) {
  return (
    <div role="alert" className="flex items-start gap-2 bg-error-container border border-error/20 rounded-xl px-4 py-3">
      <div className="w-1.5 h-1.5 rounded-full bg-error mt-1.5 shrink-0" />
      <p className="text-xs font-inter text-error">{msg}</p>
    </div>
  )
}
