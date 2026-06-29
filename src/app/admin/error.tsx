'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { AlertTriangle, RotateCw, LogIn } from 'lucide-react'

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter()
  useEffect(() => {
    console.error('[admin/error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center bg-white border border-outline-variant rounded-2xl shadow-forest p-10">
        <div className="w-14 h-14 rounded-2xl bg-error-container flex items-center justify-center mx-auto mb-5">
          <AlertTriangle className="w-7 h-7 text-error" />
        </div>
        <h1 className="font-manrope font-bold text-xl text-primary mb-2">
          Erro no painel
        </h1>
        <p className="font-inter text-sm text-on-surface-variant mb-7">
          Não foi possível carregar esta área. Tente novamente ou refaça o login
          administrativo.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 bg-primary text-white font-inter font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-container transition-colors"
          >
            <RotateCw className="w-4 h-4" /> Tentar novamente
          </button>
          <button
            onClick={() => router.replace('/admin/login')}
            className="inline-flex items-center justify-center gap-2 border border-outline-variant text-on-surface font-inter font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-surface-container transition-colors"
          >
            <LogIn className="w-4 h-4" /> Login admin
          </button>
        </div>
      </div>
    </div>
  )
}
