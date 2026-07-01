'use client'
import Link from 'next/link'
import { useAreas } from '@/hooks/useAreas'
import { Badge, Spinner, EmptyState, ErrorState, CoverImage } from '@/components/ui'
import { ArrowRight, TreePine, Target } from 'lucide-react'

const statusColor: Record<string, string> = { ativo: 'green', em_andamento: 'green', concluido: 'gray', pausado: 'amber' }
const statusLabel: Record<string, string> = { ativo: 'Em andamento', em_andamento: 'Em andamento', concluido: 'Concluído', pausado: 'Pausado' }

// Placeholders locais — substituídos automaticamente pela capa real (capa_url) quando cadastrada no painel.
const fallbackImages = ['/carousel-1.png', '/carousel-4.png', '/carousel-3.png']

export function ProjectsSection() {
  const { areas, loading, error, refetch } = useAreas()

  return (
    <section id="projetos" className="py-20 bg-accent-light relative overflow-hidden">
      <div className="absolute inset-0 pattern-topo opacity-60 pointer-events-none" />
      <div className="container-page relative">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="eyebrow mb-3">Transparência</p>
            <h2 className="font-display text-3xl md:text-4xl text-primary">Onde seu dinheiro vai</h2>
            <p className="font-inter text-on-surface-variant mt-2 max-w-lg">
              Cada projeto tem objetivo, metas e atualizações reais. Acompanhe o destino de cada doação.
            </p>
          </div>
          <Link href="/mapa" className="hidden md:flex items-center gap-2 text-sm font-inter font-semibold text-primary hover:text-secondary transition-colors">
            Ver todos no mapa <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <Spinner />
        ) : error ? (
          <ErrorState message={error} onRetry={refetch} />
        ) : areas.length === 0 ? (
          <EmptyState icon={TreePine} title="Projetos em breve" message="Assim que a ONG cadastrar os projetos no painel, eles aparecerão aqui." />
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {areas.slice(0, 3).map((area: any, i: number) => (
              <Link key={area.id} href={`/areas/${area.id}`} className="block group animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="bg-white border border-outline-variant rounded-2xl overflow-hidden hover:shadow-forest-lg transition-all duration-300 hover:-translate-y-1 h-full">
                  <div className="relative overflow-hidden" style={{ height: 176 }}>
                    <CoverImage
                      src={area.capa_url}
                      fallbackSrc={fallbackImages[i % fallbackImages.length]}
                      alt={area.nome}
                      imgClassName="group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
                    <div className="absolute top-3 left-3">
                      <Badge label={statusLabel[area.status] ?? area.status} color={statusColor[area.status] ?? 'gray'} />
                    </div>
                  </div>

                  <div className="p-5">
                    <h3 className="font-manrope font-bold text-primary mb-1 group-hover:text-secondary transition-colors">{area.nome}</h3>
                    {area.descricao && (
                      <p className="text-xs font-inter text-on-surface-variant mb-4 line-clamp-2 leading-relaxed">{area.descricao}</p>
                    )}
                    <div className="flex items-center justify-between text-xs font-inter text-on-surface-variant">
                      <span>{area.tamanho ? `${area.tamanho} ha` : '—'}</span>
                      {area.meta_arvores ? (
                        <span className="flex items-center gap-1"><Target className="w-3.5 h-3.5" /> Meta: {Number(area.meta_arvores).toLocaleString('pt-BR')} mudas</span>
                      ) : (
                        <span className="flex items-center gap-1 text-secondary font-semibold">Ver transparência <ArrowRight className="w-3.5 h-3.5" /></span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
