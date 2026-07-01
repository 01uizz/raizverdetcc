'use client'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { useArea } from '@/hooks/useAreas'
import { useUpdatesByArea } from '@/hooks/useUpdates'
import { useReports } from '@/hooks/useReports'
import { Timeline } from '@/components/timeline/Timeline'
import { Badge, Card, ProgressBar, Spinner, EmptyState, CoverImage } from '@/components/ui'
import { Target, TreePine, Leaf, FileText, Download, MapPin, ImageOff } from 'lucide-react'

const statusColor: Record<string, string> = { ativo: 'green', em_andamento: 'green', concluido: 'gray', pausado: 'amber' }
const statusLabel: Record<string, string> = { ativo: 'Ativo', em_andamento: 'Em andamento', concluido: 'Concluído', pausado: 'Pausado' }

export default function AreaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { area, loading: loadingArea } = useArea(id)
  const { updates, loading: loadingUpdates } = useUpdatesByArea(id)
  const { reports, loading: loadingReports } = useReports(id)

  if (loadingArea) return <div className="container-page py-12"><Spinner /></div>
  if (!area) {
    return (
      <div className="container-page py-12">
        <EmptyState icon={MapPin} title="Área não encontrada" message="Este projeto pode ter sido removido." />
      </div>
    )
  }

  const totalArvores = updates.reduce((sum, u: any) => sum + (u.arvores ?? 0), 0)
  const allEspecies = [...new Set(updates.flatMap((u: any) => u.especies ?? []))]

  // Progresso REAL: árvores plantadas / meta. Sem meta, mostramos o número absoluto.
  const metaArvores = (area as any).meta_arvores as number | undefined
  const progresso = metaArvores && metaArvores > 0
    ? Math.min(100, Math.round((totalArvores / metaArvores) * 100))
    : null

  const capa = (area as any).capa_url as string | undefined
  const objetivo = (area as any).objetivo as string | undefined

  return (
    <div className="container-page py-8 space-y-8 animate-fade-up">
      <nav className="flex items-center gap-2 text-xs font-inter text-on-surface-variant">
        <Link href="/mapa" className="hover:text-primary">Mapa</Link>
        <span>/</span>
        <span className="text-on-surface">{area.nome}</span>
      </nav>

      {/* Capa do projeto (placeholder elegante quando não há imagem) */}
      <div className="relative h-56 md:h-72 rounded-2xl overflow-hidden border border-outline-variant bg-canopy-radial">
        <CoverImage src={capa} alt={area.nome}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70 gap-2">
            <ImageOff className="w-8 h-8" />
            <span className="text-xs font-inter">Imagem do projeto em breve</span>
          </div>
        </CoverImage>
        <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <Badge label={statusLabel[area.status] ?? area.status} color={statusColor[area.status] ?? 'gray'} />
          <h1 className="font-display text-3xl md:text-4xl text-white mt-2">{area.nome}</h1>
        </div>
      </div>

      {(area.descricao || objetivo) && (
        <Card>
          {area.descricao && <p className="font-inter text-on-surface leading-relaxed mb-3">{area.descricao}</p>}
          {objetivo && (
            <div className="flex items-start gap-2.5">
              <Target className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
              <p className="font-inter text-sm text-on-surface-variant"><strong className="text-on-surface">Objetivo:</strong> {objetivo}</p>
            </div>
          )}
        </Card>
      )}

      {/* Indicadores reais */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard label="Tamanho" value={`${area.tamanho ?? '—'} ha`} icon={MapPin} />
        <StatCard label="Árvores plantadas" value={totalArvores.toLocaleString('pt-BR')} icon={TreePine} />
        <StatCard label="Espécies" value={String(allEspecies.length)} icon={Leaf} />
        <StatCard label="Atualizações" value={String(updates.length)} icon={FileText} />
      </div>

      {/* Progresso baseado na meta */}
      {progresso !== null && (
        <Card>
          <h3 className="font-manrope font-semibold text-primary mb-3">Progresso da meta</h3>
          <ProgressBar value={progresso} label={`${totalArvores.toLocaleString('pt-BR')} de ${metaArvores!.toLocaleString('pt-BR')} mudas`} />
        </Card>
      )}

      {allEspecies.length > 0 && (
        <Card>
          <h3 className="font-manrope font-semibold text-primary mb-4">Espécies registradas</h3>
          <div className="flex flex-wrap gap-2">
            {allEspecies.map((sp) => (
              <span key={sp} className="bg-secondary-container text-on-secondary-container text-xs font-inter font-medium px-3 py-1 rounded-full">{sp}</span>
            ))}
          </div>
        </Card>
      )}

      {/* Relatórios de transparência */}
      <Card>
        <h3 className="font-manrope font-semibold text-primary mb-4">Relatórios</h3>
        {loadingReports ? <Spinner /> : reports.length === 0 ? (
          <p className="text-sm font-inter text-on-surface-variant">Nenhum relatório publicado ainda.</p>
        ) : (
          <ul className="divide-y divide-outline-variant">
            {reports.map((r: any) => (
              <li key={r.id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4 text-secondary" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-inter text-sm font-semibold text-on-surface truncate">{r.titulo}</p>
                    {r.data && <p className="text-xs font-inter text-on-surface-variant">{r.data}</p>}
                  </div>
                </div>
                {r.arquivo_url && (
                  <a href={r.arquivo_url} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-inter font-semibold text-secondary hover:text-primary border border-secondary/30 rounded-lg px-3 py-1.5 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Baixar
                  </a>
                )}
              </li>
            ))}
          </ul>
        )}
      </Card>

      {/* Timeline de atualizações */}
      <div>
        <h3 className="font-manrope font-semibold text-xl text-primary mb-6">Atualizações</h3>
        {loadingUpdates ? <Spinner /> : <Timeline updates={updates} />}
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon }: { label: string; value: string; icon: React.ElementType }) {
  return (
    <Card className="!p-4">
      <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center mb-3">
        <Icon className="w-4 h-4 text-secondary" />
      </div>
      <p className="font-manrope font-bold text-2xl text-primary leading-none mb-1">{value}</p>
      <p className="text-xs font-inter text-on-surface-variant">{label}</p>
    </Card>
  )
}
