'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { clsx } from 'clsx'
import { useAuth } from '@/context/AuthContext'
import {
  LayoutDashboard, Trees, Plus, Users, FileText,
  DollarSign, LogOut, Globe, Menu, X,
} from 'lucide-react'

const nav = [
  { href: '/admin/dashboard',   label: 'Dashboard',     icon: LayoutDashboard },
  { href: '/admin/areas',       label: 'Projetos',      icon: Trees },
  { href: '/admin/update',      label: 'Atualizações',  icon: Plus },
  { href: '/admin/relatorios',  label: 'Relatórios',    icon: FileText },
  { href: '/admin/usuarios',    label: 'Usuários',      icon: Users },
  { href: '/admin/doacoes',     label: 'Doações',       icon: DollarSign },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { signOut } = useAuth()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  // Fecha o drawer ao trocar de rota
  useEffect(() => { setOpen(false) }, [pathname])

  async function handleLogout() {
    await signOut()
    router.replace('/')
  }

  const Inner = (
    <>
      <div className="px-6 mb-8">
        <div className="flex items-center gap-3">
          <Image src="/iracambi-logo.jpeg" alt="Iracambi" width={34} height={34} className="rounded-lg object-cover" />
          <div>
            <h1 className="text-sm font-bold font-manrope text-white leading-tight">Iracambi Raiz Verde</h1>
            <p className="text-[10px] font-inter text-white/40 mt-0.5">Painel Administrativo</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 overflow-y-auto">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/')
          return (
            <Link key={href} href={href}
              className={clsx(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-inter transition-colors',
                active ? 'bg-white/15 text-white font-semibold' : 'text-white/60 hover:bg-white/10 hover:text-white'
              )}>
              <Icon className="w-4 h-4 shrink-0" /><span>{label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="px-6 mt-4 space-y-2">
        <Link href="/" className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-inter text-white/50 hover:text-white hover:bg-white/10 transition-colors">
          <Globe className="w-4 h-4" /> Ver site
        </Link>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-inter text-white/50 hover:text-red-300 hover:bg-red-900/20 transition-colors">
          <LogOut className="w-4 h-4" /> Sair
        </button>
      </div>
    </>
  )

  return (
    <>
      {/* Barra superior mobile */}
      <div className="md:hidden sticky top-0 z-40 flex items-center justify-between bg-[#08291b] px-4 h-14">
        <div className="flex items-center gap-2.5">
          <Image src="/iracambi-logo.jpeg" alt="Iracambi" width={28} height={28} className="rounded-lg object-cover" />
          <span className="text-sm font-manrope font-bold text-white">Painel</span>
        </div>
        <button onClick={() => setOpen(true)} aria-label="Abrir menu" className="text-white p-2">
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Drawer mobile */}
      {open && (
        <div className="md:hidden fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50" onClick={() => setOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-72 bg-[#08291b] flex flex-col py-6 animate-fade-in">
            <button onClick={() => setOpen(false)} aria-label="Fechar menu" className="absolute right-4 top-4 text-white/70 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            {Inner}
          </aside>
        </div>
      )}

      {/* Sidebar desktop */}
      <aside className="hidden md:flex h-screen w-64 border-r border-white/10 fixed left-0 top-0 bg-[#08291b] flex-col py-6 z-50">
        {Inner}
      </aside>
    </>
  )
}
