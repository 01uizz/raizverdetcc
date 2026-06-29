import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import Image from 'next/image'

const statusLabel = {
  preparacao: 'Preparação',
  plantio: 'Plantio',
  manutencao: 'Manutenção',
  monitoramento: 'Monitoramento',
}

export function Timeline({ updates }) {
  if (updates.length === 0) {
    return <p className="text-sm font-inter text-on-surface-variant">Nenhuma atualização ainda.</p>
  }

  return (
    <div className="relative">
      <div className="absolute left-3 top-0 bottom-0 w-px bg-outline-variant" />
      <ul className="space-y-8">
        {updates.map((u) => (
          <li key={u.id} className="relative pl-10">
            <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-secondary-container border-2 border-secondary flex items-center justify-center">
              <span className="text-[10px]">🌱</span>
            </div>
            <div className="bg-white border border-outline-variant rounded-xl p-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-inter font-semibold uppercase tracking-wider text-secondary">
                  {statusLabel[u.status] ?? u.status}
                </span>
                <span className="text-xs font-inter text-on-surface-variant">
                  {format(new Date(u.data), 'dd MMM yyyy', { locale: ptBR })}
                </span>
              </div>
              {u.observacao && (
                <p className="text-sm font-inter text-on-surface mb-3">{u.observacao}</p>
              )}
              <div className="flex gap-4 text-xs font-inter text-on-surface-variant">
                {u.arvores && <span>🌳 {u.arvores} árvores</span>}
                {u.especies?.length > 0 && <span>🦎 {u.especies.join(', ')}</span>}
              </div>
              {u.foto_url && (
                <div className="mt-3 rounded-lg overflow-hidden h-40 relative">
                  <Image src={u.foto_url} alt="Foto da atualização" fill className="object-cover" />
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
