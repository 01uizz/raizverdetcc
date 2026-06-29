'use client'
import { useState, useCallback } from 'react'
import { X } from 'lucide-react'
import { StepAuth, type DonorIdentity } from './StepAuth'
import { StepPix } from './StepPix'
import { StepConfirm } from './StepConfirm'
import { createDonationIntent } from '@/services/donationsService'

interface Props {
  amount: number
  session: any
  onClose: () => void
}

type Step = 'auth' | 'pix' | 'confirm'

export function PixDonationFlow({ amount, session, onClose }: Props) {
  // Se já está logado, pula a identificação.
  const loggedMeta = session?.user?.user_metadata as { nome?: string } | undefined
  const initialIdentity: DonorIdentity | null = session?.user
    ? { nome: loggedMeta?.nome ?? session.user.email?.split('@')[0] ?? 'Apoiador', email: session.user.email ?? '' }
    : null

  const [step, setStep] = useState<Step>(initialIdentity ? 'pix' : 'auth')
  const [identity, setIdentity] = useState<DonorIdentity | null>(initialIdentity)
  const [recordError, setRecordError] = useState<string | null>(null)

  const handleIdentified = useCallback((id: DonorIdentity) => {
    setIdentity(id)
    setStep('pix')
  }, [])

  // Ao confirmar o pagamento, REGISTRA a doação (status 'pendente').
  const handlePaid = useCallback(async () => {
    setRecordError(null)
    try {
      await createDonationIntent({
        valor: amount,
        nome: identity?.nome,
        email: identity?.email,
        user_id: session?.user?.id,
      })
    } catch (err) {
      // Não bloqueia a tela de agradecimento; apenas registra o erro.
      console.error('[doação] falha ao registrar intenção:', err)
      setRecordError('Sua doação foi feita, mas houve um erro ao registrá-la. Guarde o comprovante.')
    } finally {
      setStep('confirm')
    }
  }, [amount, identity, session])

  const titles: Record<Step, string> = {
    auth: 'Identificação',
    pix: 'Pagamento PIX',
    confirm: 'Confirmação',
  }

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center px-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-forest-xl w-full max-w-md overflow-hidden animate-scale-in max-h-[92vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between bg-forest-gradient px-6 py-4 sticky top-0 z-10">
          <div>
            <p className="text-xs font-inter text-on-primary-container uppercase tracking-widest">{titles[step]}</p>
            <p className="font-manrope font-bold text-white text-lg">R$ {amount.toFixed(2).replace('.', ',')}</p>
          </div>
          <button onClick={onClose} aria-label="Fechar" className="text-white/70 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-1">
          {(['auth', 'pix', 'confirm'] as Step[]).map((s, i) => (
            <div key={s} className={`flex-1 transition-colors ${['auth', 'pix', 'confirm'].indexOf(step) >= i ? 'bg-secondary' : 'bg-outline-variant'}`} />
          ))}
        </div>

        <div className="px-6 py-6">
          {step === 'auth' && <StepAuth onIdentified={handleIdentified} />}
          {step === 'pix' && <StepPix amount={amount} onConfirmed={handlePaid} />}
          {step === 'confirm' && <StepConfirm amount={amount} onClose={onClose} recordError={recordError} />}
        </div>
      </div>
    </div>
  )
}
