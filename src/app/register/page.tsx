'use client'
import { useState } from 'react'
import { signUp } from '@/services/authService'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Loader2, Mail, Lock, User, Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  function validate() {
    if (!nome.trim()) return 'Informe seu nome completo.'
    if (!email.includes('@')) return 'Informe um e-mail válido.'
    if (password.length < 8) return 'A senha deve ter pelo menos 8 caracteres.'
    if (password !== confirmPassword) return 'As senhas não coincidem.'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const validationError = validate()
    if (validationError) return setError(validationError)

    setLoading(true)
    setError(null)
    try {
      // Metadados passados como OBJETO (correção do bug de assinatura).
      // O tipo é sempre 'doador' — definido no authService, não pelo cliente.
      await signUp(email, password, { nome: nome.trim() })
      setSuccess(true)
      setTimeout(() => router.replace('/login'), 3000)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Erro ao criar conta'
      if (msg.includes('already registered') || msg.includes('already exists')) {
        setError('Este e-mail já está cadastrado.')
      } else {
        setError(msg)
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="bg-white border border-outline-variant rounded-2xl shadow-forest p-12 w-full max-w-md text-center animate-scale-in">
          <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-secondary" />
          </div>
          <h2 className="font-manrope font-bold text-primary text-2xl mb-2">Conta criada!</h2>
          <p className="font-inter text-on-surface-variant text-sm mb-6">
            Verifique seu e-mail para confirmar a conta. Redirecionando para o login…
          </p>
          <div className="w-full bg-surface-container-high rounded-full h-1.5 overflow-hidden">
            <div className="bg-secondary h-1.5 rounded-full" style={{ animation: 'progress 3s ease-in-out forwards' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-secondary-container/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary-container/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="bg-white border border-outline-variant rounded-2xl shadow-forest-lg overflow-hidden">
          <div className="bg-forest-gradient px-10 py-8">
            <div className="flex items-center gap-3">
              <Image src="/iracambi-logo.jpeg" alt="Iracambi" width={44} height={44} className="rounded-xl object-cover" />
              <div>
                <h1 className="font-manrope font-bold text-white text-xl tracking-tight">Iracambi Raiz Verde</h1>
                <p className="text-on-primary-container text-xs font-inter mt-0.5">Plataforma de Transparência Ambiental</p>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="font-display text-white text-3xl">Criar conta</h2>
              <p className="text-on-primary-container text-sm font-inter mt-1">Acompanhe o impacto das suas doações</p>
            </div>
          </div>

          <div className="px-10 py-8">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Field label="Nome completo">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input type="text" value={nome} onChange={(e) => setNome(e.target.value)} required autoComplete="name"
                  className="w-full border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-inter text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                  placeholder="Seu nome completo" />
              </Field>

              <Field label="E-mail">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email"
                  className="w-full border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-inter text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                  placeholder="seu@email.com" />
              </Field>

              <Field label="Senha">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="new-password"
                  className="w-full border border-outline-variant rounded-xl pl-10 pr-11 py-3 text-sm font-inter text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors"
                  placeholder="Mínimo 8 caracteres" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </Field>

              <Field label="Confirmar senha">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                <input type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required autoComplete="new-password"
                  className={`w-full border rounded-xl pl-10 pr-11 py-3 text-sm font-inter text-on-surface focus:outline-none focus:ring-1 transition-colors ${
                    confirmPassword && confirmPassword !== password
                      ? 'border-error focus:border-error focus:ring-error'
                      : 'border-outline-variant focus:border-secondary focus:ring-secondary'
                  }`}
                  placeholder="Repita a senha" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-on-surface transition-colors">
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </Field>

              {error && (
                <div role="alert" className="flex items-start gap-2.5 bg-error-container border border-error/20 rounded-xl px-4 py-3">
                  <div className="w-1.5 h-1.5 rounded-full bg-error mt-1.5 shrink-0" />
                  <p className="text-sm font-inter text-error leading-snug">{error}</p>
                </div>
              )}

              <button type="submit" disabled={loading}
                className="w-full bg-primary text-white font-inter font-semibold py-3 rounded-xl hover:bg-primary-container disabled:opacity-60 transition-all flex items-center justify-center gap-2 text-sm">
                {loading ? (<><Loader2 className="w-4 h-4 animate-spin" /> Criando conta…</>) : 'Criar conta'}
              </button>
            </form>

            <p className="text-center text-sm font-inter text-on-surface-variant mt-6">
              Já possui conta?{' '}
              <Link href="/login" className="text-secondary font-semibold hover:text-primary transition-colors underline underline-offset-2">Entrar</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">{label}</label>
      <div className="relative">{children}</div>
    </div>
  )
}
