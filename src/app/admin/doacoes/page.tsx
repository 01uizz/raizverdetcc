'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { getDonations, updateDonationStatus } from '@/services/donationsService'
import { Card, Spinner, EmptyState } from '@/components/ui'
import { DollarSign, Users, TrendingUp, Hash, Check, X } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Doacao {
  id: string
  valor: number
  status: string
  nome?: string
  email?: string
  created_at: string
}

export default function AdminDoacoesPage() {
  const [doacoes, setDoacoes] = useState<Doacao[]>([])
  const [loading, setLoading] = useState(true)
  const [totalDoadores, setTotalDoadores] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const data = await getDonations()
      setDoacoes(data as Doacao[])
    } catch (e) {
      console.warn('[doacoes] tabela pode não existir ainda:', e)
    }
    const { count } = await supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('tipo', 'doador')
    setTotalDoadores(count ?? 0)
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  async function setStatus(id: string, status: string) {
    try { await updateDonationStatus(id, status); await load() }
    catch (e) { alert(e instanceof Error ? e.message : 'Erro') }
  }

  const confirmadas = doacoes.filter((d) => d.status === 'confirmado' || d.status === 'pago')
  const totalArrecadado = confirmadas.reduce((s, d) => s + (d.valor ?? 0), 0)
  const totalPendente = doacoes.filter((d) => d.status === 'pendente').reduce((s, d) => s + (d.valor ?? 0), 0)
  const brl = (n: number) => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })

  const statusColor: Record<string, string> = {
    confirmado: 'bg-secondary-container text-on-secondary-container',
    pago: 'bg-secondary-container text-on-secondary-container',
    pendente: 'bg-warning-container text-warning',
    cancelado: 'bg-error-container text-error',
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-primary">Doações</h2>
        <p className="font-inter text-on-surface-variant text-sm mt-1">Histórico, conciliação e estatísticas de arrecadação</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric icon={DollarSign} label="Arrecadado (confirmado)" value={brl(totalArrecadado)} />
        <Metric icon={TrendingUp} label="Pendente" value={brl(totalPendente)} />
        <Metric icon={Users} label="Doadores cadastrados" value={String(totalDoadores)} />
        <Metric icon={Hash} label="Transações" value={String(doacoes.length)} />
      </div>

      <Card>
        <h3 className="font-manrope font-semibold text-primary mb-4">Histórico de Doações</h3>
        {loading ? <Spinner /> : doacoes.length === 0 ? (
          <EmptyState icon={DollarSign} title="Nenhuma doação registrada"
            message="As doações feitas pelo site aparecem aqui como 'pendente'. Confirme cada uma após conferir o recebimento no PIX (ou integre um gateway para confirmação automática)." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm font-inter">
              <thead>
                <tr className="border-b border-outline-variant text-left">
                  {['Doador', 'Valor', 'Status', 'Data', 'Ações'].map((h) => (
                    <th key={h} className="pb-3 text-xs font-semibold uppercase tracking-widest text-on-surface-variant">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {doacoes.map((d) => (
                  <tr key={d.id}>
                    <td className="py-3 text-on-surface">
                      <div className="font-medium">{d.nome ?? 'Anônimo'}</div>
                      {d.email && <div className="text-xs text-on-surface-variant">{d.email}</div>}
                    </td>
                    <td className="py-3 font-semibold text-primary">{brl(d.valor ?? 0)}</td>
                    <td className="py-3">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusColor[d.status] ?? 'bg-surface-container text-on-surface-variant'}`}>{d.status}</span>
                    </td>
                    <td className="py-3 text-on-surface-variant">{format(new Date(d.created_at), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</td>
                    <td className="py-3">
                      {d.status === 'pendente' && (
                        <div className="flex gap-1.5">
                          <button onClick={() => setStatus(d.id, 'confirmado')} title="Confirmar recebimento"
                            className="w-7 h-7 rounded-lg bg-secondary-container text-secondary hover:bg-secondary hover:text-white flex items-center justify-center transition-colors"><Check className="w-3.5 h-3.5" /></button>
                          <button onClick={() => setStatus(d.id, 'cancelado')} title="Cancelar"
                            className="w-7 h-7 rounded-lg bg-surface-container text-on-surface-variant hover:bg-error-container hover:text-error flex items-center justify-center transition-colors"><X className="w-3.5 h-3.5" /></button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  )
}

function Metric({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <Card>
      <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center mb-3"><Icon className="w-5 h-5 text-secondary" /></div>
      <p className="font-manrope font-bold text-2xl text-primary leading-none mb-1">{value}</p>
      <p className="text-xs font-inter text-on-surface-variant">{label}</p>
    </Card>
  )
}
