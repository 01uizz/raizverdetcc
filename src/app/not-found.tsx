import Link from 'next/link'
import { Compass, Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-secondary-container flex items-center justify-center mx-auto mb-6">
          <Compass className="w-8 h-8 text-secondary" />
        </div>
        <p className="font-display text-6xl text-primary mb-2">404</p>
        <h1 className="font-manrope font-bold text-xl text-primary mb-2">
          Página não encontrada
        </h1>
        <p className="font-inter text-sm text-on-surface-variant mb-7">
          O endereço que você procura não existe ou foi movido.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white font-inter font-semibold text-sm px-6 py-3 rounded-xl hover:bg-primary-container transition-colors"
        >
          <Home className="w-4 h-4" /> Voltar ao início
        </Link>
      </div>
    </div>
  )
}
