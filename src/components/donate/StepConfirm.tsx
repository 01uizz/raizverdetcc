'use client'
import { useEffect, useState } from 'react'
import { CheckCircle, TreePine, ArrowRight, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

interface Props {
  amount: number
  onClose: () => void
  recordError?: string | null
}

export function StepConfirm({ amount, onClose, recordError }: Props) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50)
    return () => clearTimeout(t)
  }, [])

  // Estimativa de impacto (cada ~R$10 ≈ 1 muda) — claramente apresentada como estimativa.
  const trees = Math.max(1, Math.round(amount / 10))

  return (
    <div className={`space-y-6 text-center transition-all duration-500 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
      <div className="flex justify-center">
        <div className="w-20 h-20 rounded-full bg-secondary-container flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-secondary" />
        </div>
      </div>

      <div>
        <h3 className="font-manrope font-bold text-2xl text-primary mb-2">Obrigado pela doação! 🌿</h3>
        <p className="font-inter text-on-surface-variant text-sm">
          Recebemos sua doação de{' '}
          <strong className="text-primary">R$ {amount.toFixed(2).replace('.', ',')}</strong>.
          Ela ficará como <strong>pendente</strong> até a confirmação do pagamento.
        </p>
      </div>

      {recordError && (
        <div className="flex items-start gap-2 bg-warning-container/60 border border-warning/30 rounded-xl px-4 py-3 text-left">
          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs font-inter text-on-surface">{recordError}</p>
        </div>
      )}

      <div className="bg-secondary-container rounded-2xl px-6 py-5">
        <div className="flex items-center justify-center gap-3 mb-2">
          <TreePine className="w-6 h-6 text-secondary" />
          <span className="font-manrope font-bold text-2xl text-primary">~{trees} mudas</span>
        </div>
        <p className="text-xs font-inter text-on-secondary-container">impacto ambiental estimado da sua doação</p>
      </div>

      <p className="text-xs font-inter text-on-surface-variant px-4">
        Assim que o pagamento for confirmado, você poderá acompanhar o destino da sua
        doação nos projetos da Iracambi.
      </p>

      <div className="flex flex-col gap-3">
        <Link href="/mapa" onClick={onClose}
          className="flex items-center justify-center gap-2 bg-primary text-white font-inter font-semibold py-3 rounded-xl hover:bg-primary-container transition-colors text-sm">
          Ver os projetos no mapa <ArrowRight className="w-4 h-4" />
        </Link>
        <button onClick={onClose} className="text-sm font-inter text-on-surface-variant hover:text-primary transition-colors">Fechar</button>
      </div>
    </div>
  )
}
