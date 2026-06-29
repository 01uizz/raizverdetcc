'use client'
import { useAuth } from '@/context/AuthContext'
import { Card } from '@/components/ui'
import { User, Mail, Shield } from 'lucide-react'

export default function PerfilPage() {
  const { session, profile } = useAuth()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-manrope font-bold text-3xl text-primary mb-1">Meu Perfil</h2>
        <p className="font-inter text-on-surface-variant">Informações da sua conta</p>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-primary-container flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <p className="font-manrope font-bold text-xl text-primary">
              {profile?.nome ?? 'Usuário'}
            </p>
            <p className="text-sm font-inter text-on-surface-variant capitalize">
              {profile?.tipo ?? 'doador'}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 py-3 border-b border-outline-variant">
            <Mail className="w-4 h-4 text-on-surface-variant shrink-0" />
            <div>
              <p className="text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant">
                E-mail
              </p>
              <p className="text-sm font-inter text-on-surface mt-0.5">
                {session?.user?.email ?? '—'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 py-3">
            <Shield className="w-4 h-4 text-on-surface-variant shrink-0" />
            <div>
              <p className="text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant">
                Tipo de Conta
              </p>
              <p className="text-sm font-inter text-on-surface mt-0.5 capitalize">
                {profile?.tipo ?? '—'}
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
