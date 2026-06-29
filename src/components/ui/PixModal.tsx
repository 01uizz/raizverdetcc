'use client'
import { useState } from 'react'
import Image from 'next/image'
import { X, Copy, Check, Heart } from 'lucide-react'

const PIX_COPIA_COLA =
  '00020126580014br.gov.bcb.pix0136xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx5204000053039865802BR5913ONG Iracambi6015Rosario Limeira62070503***6304XXXX'

export function PixModal({ onClose }: { onClose: () => void }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(PIX_COPIA_COLA).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    })
  }

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-primary px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="w-5 h-5 text-white" />
            <h2 className="font-manrope font-bold text-white text-lg">Doe via PIX</h2>
          </div>
          <button
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-5">
          <p className="text-sm font-inter text-on-surface-variant text-center">
            Escaneie o QR Code ou copie o PIX para apoiar o reflorestamento da Iracambi.
          </p>

          {/* QR Code */}
          <div className="flex justify-center">
            <div className="border-2 border-outline-variant rounded-xl p-3">
              <Image
                src="/qr-code-pix.png"
                alt="QR Code PIX Iracambi"
                width={200}
                height={200}
                className="rounded"
              />
            </div>
          </div>

          {/* Pix copia e cola */}
          <div>
            <p className="text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1.5">
              PIX Copia e Cola
            </p>
            <div className="flex items-center gap-2">
              <input
                readOnly
                value={PIX_COPIA_COLA}
                className="flex-1 border border-outline-variant rounded-xl px-3 py-2.5 text-xs font-inter text-on-surface-variant bg-surface-container-low truncate"
              />
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-primary text-white text-xs font-inter font-semibold hover:bg-primary/90 transition-colors shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    Copiado
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    Copiar
                  </>
                )}
              </button>
            </div>
          </div>

          <p className="text-xs font-inter text-on-surface-variant text-center">
            Iracambi — CNPJ: XX.XXX.XXX/0001-XX
          </p>
        </div>
      </div>
    </div>
  )
}
