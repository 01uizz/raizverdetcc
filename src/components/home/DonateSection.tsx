'use client'
import { useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { PixDonationFlow } from '@/components/donate/PixDonationFlow'
import { Heart, Shield, Eye, Pencil } from 'lucide-react'

const SUGGESTED = [5, 10, 15, 25, 50]

export function DonateSection() {
  const { session } = useAuth()
  const [selected, setSelected] = useState<number | null>(25)
  const [custom, setCustom] = useState('')
  const [showFlow, setShowFlow] = useState(false)

  const parsedCustom = custom.trim() !== '' ? parseFloat(custom.replace(',', '.')) : null
  const finalAmount = parsedCustom ?? selected ?? 0
  const isValid = finalAmount >= 1

  const handleDonate = useCallback(() => { if (isValid) setShowFlow(true) }, [isValid])
  const handleClose = useCallback(() => setShowFlow(false), [])

  function selectAmount(v: number) { setSelected(v); setCustom('') }

  return (
    <section id="doe" className="py-24 bg-canopy-radial relative overflow-hidden">
      <div className="absolute inset-0 pattern-topo-light opacity-60 pointer-events-none" />
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-20 right-10 w-80 h-80 rounded-full" style={{ background: 'radial-gradient(circle, #8ccb4e 0%, transparent 70%)' }} />
      </div>

      {showFlow && <PixDonationFlow amount={finalAmount} session={session} onClose={handleClose} />}

      <div className="relative max-w-4xl mx-auto px-6">
        <div className="text-center mb-12">
          <p className="text-xs font-inter font-semibold uppercase tracking-widest text-on-primary-container mb-2">Apoie a Iracambi</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Cada real vira floresta</h2>
          <p className="font-inter text-white/75 max-w-lg mx-auto leading-relaxed">
            Sua doação financia mudas, plantio, monitoramento e pesquisa científica na Mata Atlântica.
          </p>
        </div>

        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-4xl p-8 shadow-forest-xl">
          <p className="text-sm font-inter font-semibold text-white/80 mb-3">Sugestões de valor</p>

          <div className="flex flex-wrap gap-2 mb-5">
            {SUGGESTED.map((v) => (
              <button key={v} type="button" onClick={() => selectAmount(v)}
                className={`px-5 py-2.5 rounded-xl text-sm font-inter font-semibold transition-all border ${
                  selected === v && custom === '' ? 'bg-white text-primary border-white shadow-md scale-105' : 'bg-white/10 text-white border-white/20 hover:bg-white/25'
                }`}>
                R$ {v}
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="flex items-center gap-1.5 text-xs font-inter font-semibold text-white/70 uppercase tracking-widest mb-2">
              <Pencil className="w-3 h-3" /> Ou digite outro valor
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-inter font-semibold text-on-surface-variant pointer-events-none">R$</span>
              <input type="number" inputMode="decimal" min="1" step="any" placeholder="Ex: 30, 75, 200…" value={custom}
                onChange={(e) => { setCustom(e.target.value); if (e.target.value.trim() !== '') setSelected(null); else setSelected(25) }}
                className="w-full bg-white border-2 border-transparent rounded-xl pl-10 pr-4 py-3 text-sm font-inter text-on-surface placeholder:text-on-surface-variant/50 focus:outline-none focus:border-secondary transition-colors" />
            </div>
            {parsedCustom !== null && parsedCustom < 1 && <p className="text-xs font-inter text-red-300 mt-1.5">Valor mínimo: R$ 1,00</p>}
          </div>

          <button type="button" onClick={handleDonate} disabled={!isValid}
            className="w-full flex items-center justify-center gap-2 bg-white text-primary font-inter font-bold py-4 rounded-xl hover:bg-on-primary-container transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-base shadow-lg">
            <Heart className="w-4 h-4" />
            {isValid ? `Doe R$ ${finalAmount.toFixed(2).replace('.', ',')} agora` : 'Escolha um valor'}
          </button>

          <div className="flex items-center justify-center gap-8 mt-6">
            <div className="flex items-center gap-1.5 text-white/55 text-xs font-inter"><Shield className="w-3.5 h-3.5" /> Pagamento via PIX</div>
            <div className="flex items-center gap-1.5 text-white/55 text-xs font-inter"><Eye className="w-3.5 h-3.5" /> 100% transparente</div>
          </div>
        </div>
      </div>
    </section>
  )
}
