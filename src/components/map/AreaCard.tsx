import { clsx } from 'clsx'
import Link from 'next/link'
import { Badge } from '@/components/ui'

const statusColor = {
  ativo: 'green',
  concluido: 'gray',
  pausado: 'amber',
}

export function AreaCard({ area, selected, onClick }) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white border rounded-xl p-4 cursor-pointer transition-all',
        selected ? 'border-primary shadow-md' : 'border-outline-variant hover:border-secondary'
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-manrope font-semibold text-primary text-sm leading-tight">{area.nome}</h3>
        <Badge label={area.status} color={statusColor[area.status] ?? 'gray'} />
      </div>
      {area.tamanho && (
        <p className="text-xs font-inter text-on-surface-variant mb-3">{area.tamanho} ha</p>
      )}
      <Link
        href={`/areas/${area.id}`}
        className="text-xs font-inter font-medium text-secondary hover:underline"
        onClick={(e) => e.stopPropagation()}
      >
        Ver detalhes →
      </Link>
    </div>
  )
}
