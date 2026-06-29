'use client'
import { useAllUpdates } from '@/hooks/useUpdates'
import { Timeline } from '@/components/timeline/Timeline'
import { Spinner } from '@/components/ui'

export default function HistoricoPage() {
  const { updates, loading } = useAllUpdates()

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-manrope font-bold text-3xl text-primary mb-1">Histórico de Atividades</h2>
        <p className="font-inter text-on-surface-variant">
          Todas as atualizações registradas pela equipe de campo.
        </p>
      </div>
      {loading ? <Spinner /> : <Timeline updates={updates} />}
    </div>
  )
}
