'use client'
import { useAuth } from '@/context/AuthContext'
import { Bell } from 'lucide-react'

export function TopNav({ title }) {
  const { profile } = useAuth()

  const initials = profile?.nome
    ? profile.nome.split(' ').map((n) => n[0]).slice(0, 2).join('').toUpperCase()
    : '?'

  const badge = profile?.tipo === 'admin' ? 'Administrador ONG' : 'Doador ativo'

  return (
    <header className="hidden md:flex items-center justify-between h-16 px-8 bg-white/80 backdrop-blur-md sticky top-0 z-40 border-b border-outline-variant">
      {title && <h2 className="font-manrope font-semibold text-primary">{title}</h2>}
      <div className="ml-auto flex items-center gap-4">
        <button className="text-on-surface-variant hover:text-primary transition-colors">
          <Bell className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2.5 border border-outline-variant rounded-full pl-1 pr-3 py-1 hover:bg-surface-container transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-xs font-bold text-on-secondary-container font-manrope">
            {initials}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold font-inter text-on-surface leading-none">
              {profile?.nome ?? 'Usuário'}
            </span>
            <span className="text-[10px] font-inter text-on-surface-variant leading-none mt-0.5">
              {badge}
            </span>
          </div>
        </div>
      </div>
    </header>
  )
}
