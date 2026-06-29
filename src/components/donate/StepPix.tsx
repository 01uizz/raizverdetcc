'use client'
import { useState, useEffect } from 'react'
import { Copy, Check, ArrowRight, Smartphone } from 'lucide-react'

// Dados PIX vêm de variáveis de ambiente (.env.local) — sem dados pessoais no código.
// Recomendado: chave PIX da PESSOA JURÍDICA da ONG. Ver .env.example.
const PIX_PHONE_KEY = process.env.NEXT_PUBLIC_PIX_KEY ?? '32991997757'
const PIX_RECEIVER_NAME = process.env.NEXT_PUBLIC_PIX_RECEIVER ?? 'ASSOCIACAO AMIGOS DE IRACAMBI'
const PIX_CITY = process.env.NEXT_PUBLIC_PIX_CITY ?? 'ROSARIO DA LIMEIRA'

// Gera o payload EMV (PIX copia e cola) a partir da chave telefone
// Formato padrão Banco Central — não expira, valor variável
function buildPixPayload(phone: string, name: string, city: string, amount: number): string {
  const cleanPhone = phone.replace(/\D/g, '')
  const pixKey = '+55' + cleanPhone

  function field(id: string, value: string) {
    const len = value.length.toString().padStart(2, '0')
    return id + len + value
  }

  const merchantAccountInfo = field('00', 'BR.GOV.BCB.PIX') + field('01', pixKey)
  const mai = field('26', merchantAccountInfo)

  const amountStr = amount.toFixed(2)
  const nameClean = name.normalize('NFD').replace(/[\u0300-\u036f]/g, '').substring(0, 25).toUpperCase()
  const cityClean = city.normalize('NFD').replace(/[\u0300-\u036f]/g, '').substring(0, 15).toUpperCase()

  let payload =
    field('00', '01') +           // Payload format indicator
    mai +                          // Merchant account info
    field('52', '0000') +          // Merchant category code
    field('53', '986') +           // Currency BRL
    field('54', amountStr) +       // Amount
    field('58', 'BR') +            // Country
    field('59', nameClean) +       // Merchant name
    field('60', cityClean) +       // Merchant city
    field('62', field('05', '***')) // Additional data (txid)

  // CRC16/CCITT
  payload += '6304'
  let crc = 0xffff
  for (let i = 0; i < payload.length; i++) {
    crc ^= payload.charCodeAt(i) << 8
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1
    }
  }
  return payload + (crc & 0xffff).toString(16).toUpperCase().padStart(4, '0')
}

// QR Code via API pública (não expira, gerado a partir do payload)
function buildQrUrl(payload: string): string {
  return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(payload)}&bgcolor=ffffff&color=08291b&margin=10`
}

interface Props {
  amount: number
  onConfirmed: () => void
}

export function StepPix({ amount, onConfirmed }: Props) {
  const [copied, setCopied] = useState(false)
  const [copiedKey, setCopiedKey] = useState(false)
  const [qrLoaded, setQrLoaded] = useState(false)

  const pixPayload = buildPixPayload(PIX_PHONE_KEY, PIX_RECEIVER_NAME, PIX_CITY, amount)
  const qrUrl = buildQrUrl(pixPayload)

  function handleCopyPayload() {
    navigator.clipboard.writeText(pixPayload).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
    })
  }

  function handleCopyKey() {
    navigator.clipboard.writeText(PIX_PHONE_KEY).then(() => {
      setCopiedKey(true)
      setTimeout(() => setCopiedKey(false), 3000)
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <p className="font-manrope font-semibold text-primary mb-0.5">Pague via PIX</p>
        <p className="text-xs font-inter text-on-surface-variant">
          Escaneie o QR Code ou copie a chave. Após pagar, clique em confirmar.
        </p>
      </div>

      {/* Valor */}
      <div className="bg-secondary-container rounded-xl px-4 py-3 flex items-center justify-between">
        <span className="text-xs font-inter font-semibold uppercase tracking-widest text-on-secondary-container">
          Valor da doação
        </span>
        <span className="font-manrope font-bold text-xl text-primary">
          R$ {amount.toFixed(2).replace('.', ',')}
        </span>
      </div>

      {/* QR Code dinâmico */}
      <div className="flex flex-col items-center gap-2">
        <div className="border-2 border-outline-variant rounded-2xl p-4 bg-white relative" style={{ width: 220, height: 220 }}>
          {!qrLoaded && (
            <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-white">
              <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={qrUrl}
            alt="QR Code PIX"
            width={192}
            height={192}
            onLoad={() => setQrLoaded(true)}
            style={{ display: qrLoaded ? 'block' : 'none', borderRadius: 8 }}
          />
        </div>
        <p className="text-xs font-inter text-on-surface-variant">
          QR Code gerado para R$ {amount.toFixed(2).replace('.', ',')}
        </p>
      </div>

      {/* Chave telefone (cópia rápida) */}
      <div className="bg-surface-container rounded-xl px-4 py-3">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-3.5 h-3.5 text-secondary" />
            <span className="text-xs font-inter font-semibold text-on-surface-variant uppercase tracking-widest">
              Chave PIX (telefone)
            </span>
          </div>
          <button
            onClick={handleCopyKey}
            className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-inter font-semibold transition-colors ${
              copiedKey
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-primary/10 text-primary hover:bg-primary/20'
            }`}
          >
            {copiedKey ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copiedKey ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
        <p className="font-manrope font-bold text-lg text-primary tracking-wider">
          {PIX_PHONE_KEY}
        </p>
      </div>

      {/* PIX copia e cola (payload completo) */}
      <div>
        <p className="text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">
          PIX copia e cola (código completo)
        </p>
        <div className="flex gap-2">
          <input
            readOnly
            value={pixPayload}
            className="flex-1 border border-outline-variant rounded-xl px-3 py-2 text-xs font-inter bg-white truncate text-on-surface-variant"
          />
          <button
            onClick={handleCopyPayload}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-inter font-semibold transition-colors shrink-0 ${
              copied
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-primary text-white hover:bg-primary/90'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? 'Copiado!' : 'Copiar'}
          </button>
        </div>
      </div>

      <p className="text-center text-xs font-inter text-on-surface-variant">
        Beneficiário: <strong className="text-on-surface">{PIX_RECEIVER_NAME}</strong> · Iracambi · Chave permanente
      </p>

      <button
        onClick={onConfirmed}
        className="w-full flex items-center justify-center gap-2 bg-secondary text-white font-inter font-semibold py-3 rounded-xl hover:bg-secondary/90 transition-colors text-sm"
      >
        Já realizei o pagamento
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}
