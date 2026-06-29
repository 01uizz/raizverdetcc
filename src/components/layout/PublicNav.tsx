'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import { useState } from 'react'
import { Menu, X, Heart } from 'lucide-react'
import { clsx } from 'clsx'

const links = [
  { href: '/#projetos', label: 'Projetos' },
  { href: '/mapa', label: 'Mapa' },
  { href: '/#impacto', label: 'Impacto' },
  { href: '/#doe', label: 'Doe' },
]

export function PublicNav() {
  const { session, profile } = useAuth()
  const [open, setOpen] = useState(false)

  const dashHref = profile?.tipo === 'admin' ? '/admin/dashboard' : '/painel'

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface/85 backdrop-blur-md border-b border-outline-variant">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5">
          <Image 
            src="/iracambi-logo.jpeg" 
            alt="Iracambi" 
            width={32} 
            height={32} 
            style={{ height: 'auto' }} // <--- Correção adicionada aqui para manter a proporção
            className="rounded-lg object-cover" 
          />
          <span className="font-display text-primary text-lg hidden sm:block">
            Iracambi Raiz Verde
          </span>
        </Link>

        {/* Links desktop */}
        <div className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-sm font-inter text-on-surface-variant hover:text-primary transition-colors"
            >
              {l.label}
            </Link>
          ))}
        </div>

        {/* CTAs */}
        <div className="hidden md:flex items-center gap-3">
          {session ? (
            <Link
              href={dashHref}
              className="text-sm font-inter font-semibold text-primary border border-primary rounded-full px-4 py-1.5 hover:bg-primary hover:text-white transition-colors"
            >
              Meu Painel
            </Link>
          ) : (
            <Link
              href="/login"
              className="text-sm font-inter text-on-surface-variant hover:text-primary transition-colors"
            >
              Entrar
            </Link>
          )}
          <Link
            href="/#doe"
            className="flex items-center gap-1.5 text-sm font-inter font-semibold bg-secondary text-white rounded-full px-5 py-2 hover:bg-secondary/90 shadow-forest transition-colors"
          >
            <Heart className="w-3.5 h-3.5" />
            Doe Agora
          </Link>
        </div>

        {/* Mobile toggle */}
        <button className="md:hidden text-primary" onClick={() => setOpen(!open)}>
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden bg-white border-t border-outline-variant px-6 py-4 space-y-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block text-sm font-inter text-on-surface-variant" onClick={() => setOpen(false)}>
              {l.label}
            </Link>
          ))}
          <div className="pt-2 border-t border-outline-variant flex flex-col gap-2">
            {session ? (
              <Link href={dashHref} className="text-sm font-semibold text-primary">Meu Painel</Link>
            ) : (
              <Link href="/login" className="text-sm text-on-surface-variant">Entrar</Link>
            )}
            <Link href="/#doe" className="flex items-center gap-1.5 text-sm font-semibold bg-primary text-white rounded-full px-4 py-2 w-fit">
              <Heart className="w-3.5 h-3.5" /> Doe Agora
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}