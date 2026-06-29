'use client'
import { Card } from '@/components/ui'
import { TreePine, Leaf, BarChart3 } from 'lucide-react'

export default function MeuImpactoPage() {
  // Dados reais virão do Supabase futuramente
  const totalArvores = 0
  const totalArea = 0
  const totalCO2 = 0

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-manrope font-bold text-3xl text-primary mb-1">Meu Impacto</h2>
        <p className="font-inter text-on-surface-variant">
          Acompanhe sua contribuição para o reflorestamento
        </p>
      </div>

      <div className="grid grid-cols-3 gap-6">
        <Card>
          <div className="flex items-center gap-3 mb-2">
            <TreePine className="w-5 h-5 text-primary" />
            <p className="text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant">
              Árvores Financiadas
            </p>
          </div>
          <p className="font-manrope font-bold text-3xl text-primary">
            {totalArvores > 0 ? totalArvores : '—'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <Leaf className="w-5 h-5 text-primary" />
            <p className="text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant">
              Área Apoiada (ha)
            </p>
          </div>
          <p className="font-manrope font-bold text-3xl text-primary">
            {totalArea > 0 ? `${totalArea} ha` : '—'}
          </p>
        </Card>

        <Card>
          <div className="flex items-center gap-3 mb-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            <p className="text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant">
              CO₂ Compensado (t)
            </p>
          </div>
          <p className="font-manrope font-bold text-3xl text-primary">
            {totalCO2 > 0 ? `${totalCO2}t` : '—'}
          </p>
        </Card>
      </div>

      <Card>
        <div className="text-center py-8">
          <TreePine className="w-12 h-12 text-primary-container mx-auto mb-3" />
          <p className="font-manrope font-semibold text-primary mb-1">
            Nenhuma contribuição ainda
          </p>
          <p className="text-sm font-inter text-on-surface-variant">
            Seu impacto aparecerá aqui após a primeira doação.
          </p>
        </div>
      </Card>
    </div>
  )
}
