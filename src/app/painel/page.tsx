'use client'
import { useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { useStats } from '@/hooks/useStats'
import { useAreas } from '@/hooks/useAreas'
import { useAllUpdates } from '@/hooks/useUpdates'
import { Card } from '@/components/ui'
import { DashboardCarousel } from '@/components/dashboard/DashboardCarousel'
import { DashboardStatCards } from '@/components/dashboard/DashboardStatCards'
import { RecentUpdates } from '@/components/dashboard/RecentUpdates'
import { PixDonationFlow } from '@/components/donate/PixDonationFlow'
import { Heart, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function PainelPage() {
  const { profile, session } = useAuth()
  const { stats, loading: loadingStats } = useStats()
  const { areas } = useAreas()
  const { updates } = useAllUpdates()
  const [showPix, setShowPix] = useState(false)
  const [donateAmount, setDonateAmount] = useState(50)

  const firstName = profile?.nome?.split(' ')[0] ?? 'Doador'

  // Adapta o formato vindo de useStats (totalArrecadado, totalArvores, ...)
  // para o esperado por DashboardStatCards (total_donated, total_trees, ...).
  // CO2_POR_ARVORE_T: estimativa média de CO₂ (toneladas) sequestrado por muda.
  // É um valor de referência — a ONG pode ajustá-lo conforme sua metodologia.
  const CO2_POR_ARVORE_T = 0.0218
  const impactStats = {
    total_donated: stats.totalArrecadado,
    total_trees: stats.totalArvores,
    total_co2: Math.round(stats.totalArvores * CO2_POR_ARVORE_T * 100) / 100,
    total_area: stats.totalHectares,
  }

  const handleOpenPix = useCallback(() => setShowPix(true), [])
  const handleClosePix = useCallback(() => setShowPix(false), [])

  return (
    <div className="space-y-8">
      {showPix && (
        <PixDonationFlow
          amount={donateAmount}
          session={session}
          onClose={handleClosePix}
        />
      )}

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h2 className="font-manrope font-bold text-3xl text-primary mb-1">
            Olá, {firstName} 👋
          </h2>
          <p className="font-inter text-on-surface-variant text-sm">
            Acompanhe o impacto do seu apoio à Mata Atlântica.
          </p>
        </div>
        <button
          onClick={handleOpenPix}
          className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-xl font-inter font-semibold text-sm hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Heart className="w-4 h-4" />
          Doe Mais
        </button>
      </div>

      {/* Stat cards */}
      <DashboardStatCards stats={impactStats} loading={loadingStats} />

      {/* Carrossel */}
      <DashboardCarousel />

      {/* Grid: atualizações + projetos */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <h3 className="font-manrope font-semibold text-xl text-primary mb-4">
            Últimas Atualizações
          </h3>
          <RecentUpdates updates={updates.slice(0, 5)} />
        </div>

        <div className="lg:col-span-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-manrope font-semibold text-xl text-primary">
              Projetos Ativos
            </h3>
            <Link href="/mapa" className="text-xs font-inter text-secondary hover:text-primary flex items-center gap-1">
              Ver mapa <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {areas.length === 0 ? (
              <Card>
                <p className="text-sm font-inter text-on-surface-variant text-center py-4">
                  Nenhum projeto cadastrado ainda.
                </p>
              </Card>
            ) : (
              areas.slice(0, 4).map((area) => (
                <Link key={area.id} href={`/areas/${area.id}`}>
                  <Card className="hover:border-secondary transition-colors cursor-pointer group">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-inter font-semibold text-sm text-primary group-hover:text-secondary transition-colors">
                          {area.nome}
                        </p>
                        <p className="text-xs font-inter text-on-surface-variant mt-0.5">
                          {area.tamanho ?? '—'} ha · {area.status}
                        </p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-on-surface-variant group-hover:text-secondary transition-colors" />
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
