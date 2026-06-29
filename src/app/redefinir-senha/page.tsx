'use client'
import { useEffect, useState, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import Image from 'next/image'
import { Loader2, Lock, CheckCircle, AlertCircle } from 'lucide-react'

function ResetForm() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [sessionReady, setSessionReady] = useState(false)

  // Supabase envia o token na URL como hash (#access_token=...) OU como query param
  // O cliente JS do Supabase detecta automaticamente via onAuthStateChange
  useEffect(() => {
    let cancelled = false

    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (cancelled) return
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setSessionReady(true)
        setVerifying(false)
      }
    })

    // Timeout de segurança: se após 8s nenhum evento disparou, mostra erro
    const timeout = setTimeout(() => {
      if (!cancelled && !sessionReady) {
        setVerifying(false)
        setError('Link inválido ou expirado. Solicite uma nova recuperação de senha.')
      }
    }, 8000)

    return () => {
      cancelled = true
      clearTimeout(timeout)
      listener.subscription.unsubscribe()
    }
  }, []) // eslint-disable-line

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('As senhas não coincidem.')
      return
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password })
      if (updateError) throw updateError
      setSuccess(true)
      setTimeout(() => router.replace('/login'), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="bg-white border border-outline-variant rounded-2xl shadow-forest-lg overflow-hidden">
          {/* Header */}
          <div className="bg-primary px-8 py-7">
            <div className="flex items-center gap-3 mb-4">
              <Image src="/iracambi-logo.jpeg" alt="Iracambi" width={36} height={36} className="rounded-lg object-cover" />
              <p className="font-manrope font-bold text-white text-base">Iracambi Raiz Verde</p>
            </div>
            <h1 className="font-manrope font-bold text-white text-2xl">Redefinir senha</h1>
            <p className="text-on-primary-container text-sm font-inter mt-1">
              Digite sua nova senha abaixo.
            </p>
          </div>

          <div className="px-8 py-8">
            {/* Verificando token */}
            {verifying && (
              <div className="flex flex-col items-center py-8 gap-3">
                <Loader2 className="w-8 h-8 animate-spin text-secondary" />
                <p className="text-sm font-inter text-on-surface-variant">Verificando link...</p>
              </div>
            )}

            {/* Erro no token */}
            {!verifying && !sessionReady && error && (
              <div className="flex flex-col items-center py-6 gap-4 text-center">
                <AlertCircle className="w-10 h-10 text-error" />
                <p className="text-sm font-inter text-error">{error}</p>
                <a
                  href="/esqueci-senha"
                  className="text-sm font-inter font-semibold text-primary underline underline-offset-2"
                >
                  Solicitar novo link
                </a>
              </div>
            )}

            {/* Sucesso */}
            {success && (
              <div className="flex flex-col items-center py-6 gap-4 text-center">
                <div className="w-16 h-16 rounded-full bg-secondary-container flex items-center justify-center">
                  <CheckCircle className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="font-manrope font-bold text-primary text-lg">Senha atualizada!</h3>
                <p className="text-sm font-inter text-on-surface-variant">
                  Redirecionando para o login...
                </p>
                <Loader2 className="w-4 h-4 animate-spin text-secondary" />
              </div>
            )}

            {/* Formulário */}
            {!verifying && sessionReady && !success && (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">
                    Nova senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      minLength={6}
                      placeholder="Mínimo 6 caracteres"
                      className="w-full border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-inter focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">
                    Confirmar nova senha
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
                    <input
                      type="password"
                      value={confirm}
                      onChange={(e) => setConfirm(e.target.value)}
                      required
                      placeholder="Repita a nova senha"
                      className="w-full border border-outline-variant rounded-xl pl-10 pr-4 py-3 text-sm font-inter focus:outline-none focus:ring-1 focus:ring-secondary"
                    />
                  </div>
                </div>

                {error && (
                  <div className="flex items-start gap-2 bg-error-container border border-error/20 rounded-xl px-4 py-3">
                    <AlertCircle className="w-4 h-4 text-error shrink-0 mt-0.5" />
                    <p className="text-sm font-inter text-error">{error}</p>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-primary text-white font-inter font-semibold py-3 rounded-xl hover:bg-primary/90 disabled:opacity-60 flex items-center justify-center gap-2 text-sm"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  {loading ? 'Salvando...' : 'Salvar nova senha'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function RedefinirSenhaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-secondary" />
      </div>
    }>
      <ResetForm />
    </Suspense>
  )
}
