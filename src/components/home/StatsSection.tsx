'use client'
import { useStats } from '@/hooks/useStats'
import { TreePine, Users, Leaf, MapPin } from 'lucide-react'

function StatCard({ icon: Icon, value, label, sub, i }: {
  icon: React.ElementType; value: string; label: string; sub?: string; i: number
}) {
  return (
    <div className="flex flex-col items-center text-center px-6 py-12 animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
      <div className="w-14 h-14 rounded-2xl bg-white/15 ring-1 ring-white/25 flex items-center justify-center mb-4">
        <Icon className="w-7 h-7 text-white" />
      </div>
      <p className="font-display text-4xl md:text-5xl text-white mb-1">{value}</p>
      <p className="font-inter font-semibold text-sm text-white mb-0.5">{label}</p>
      {sub && <p className="text-xs font-inter text-white/70">{sub}</p>}
    </div>
  )
}

export function StatsSection() {
  const { stats, loading } = useStats()
  const fmt = (n: number) => (n > 0 ? n.toLocaleString('pt-BR') : loading ? '…' : '0')

  return (
    <section id="impacto" className="relative bg-secondary overflow-hidden">
      {/* Assinatura topográfica sobre o verde forte */}
      <div className="absolute inset-0 pattern-topo-light opacity-50 pointer-events-none" />
      <div className="container-page relative">
        <div className="grid grid-cols-2 md:grid-cols-4 md:divide-x divide-white/15">
          <StatCard i={0} icon={TreePine} value={fmt(stats.totalArvores)} label="Árvores plantadas" sub="desde o início" />
          <StatCard i={1} icon={MapPin} value={stats.totalHectares > 0 ? `${fmt(stats.totalHectares)} ha` : loading ? '…' : '—'} label="Hectares monitorados" sub="Mata Atlântica" />
          <StatCard i={2} icon={Leaf} value={fmt(stats.totalAreas)} label="Áreas ativas" sub="em reflorestamento" />
          <StatCard i={3} icon={Users} value={fmt(stats.totalDoadores)} label="Doadores" sub="apoiando a causa" />
        </div>
      </div>
    </section>
  )
}
