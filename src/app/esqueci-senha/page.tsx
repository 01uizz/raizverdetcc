'use client'
import { useState } from 'react'
import { resetPassword } from '@/services/authService'
import Link from 'next/link'
import { Loader2, Mail, Leaf, ArrowLeft, CheckCircle } from 'lucide-react'

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      await resetPassword(email)
      setSent(true)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao enviar e-mail')
    } finally {
      setLoading(false)
    }
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
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
                <Leaf className="w-6 h-6 text-white" />
              </div>
              <h1 className="font-manrope font-bold text-white text-xl">RaizVerde</h1>
            </div>
            <h2 className="font-manrope font-semibold text-white text-2xl">
              Recuperar senha
            </h2>
            <p className="text-on-primary-container text-sm font-inter mt-1">
              Enviaremos um link para redefinir sua senha
            </p>
          </div>

          <div className="px-10 py-8">
            {sent ? (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="font-manrope font-bold text-primary text-lg mb-2">E-mail enviado!</h3>
                <p className="text-sm font-inter text-on-surface-variant mb-6">
                  Verifique sua caixa de entrada e siga as instruções para redefinir sua senha.
                </p>
                <Link
                  href="/login"
                  className="text-secondary font-semibold font-inter hover:text-primary transition-colors underline underline-offset-2"
                >
                  Voltar ao login
                </Link>
              </div>
            ) : (
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
                      className="w-full border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-inter text-on-surface focus:outline-none focus:border-secondary focus:ring-1 focus:ring-secondary transition-colors placeholder:text-on-surface-variant/50"
                      placeholder="seu@email.com"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2.5 bg-error-container border border-error/20 rounded-xl px-4 py-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-error mt-1.5 shrink-0" />
                    <p className="text-sm font-inter text-error">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-inter font-semibold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-all flex items-center justify-center gap-2 text-sm tracking-wide"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" />Enviando...</>
                  ) : (
                    'Enviar link de recuperação'
                  )}
                </button>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm font-inter text-on-surface-variant hover:text-primary transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Voltar ao login
                </Link>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
