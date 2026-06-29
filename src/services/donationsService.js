import { supabase } from '@/lib/supabase'

/**
 * Registra a INTENÇÃO de doação (status 'pendente').
 *
 * Importante: PIX estático não confirma pagamento automaticamente. O registro
 * fica 'pendente' até conciliação manual no painel admin OU até um webhook de
 * gateway (Mercado Pago/Asaas/PagBank) atualizar para 'confirmado'/'pago'.
 * Isso torna a área de doações REAL — antes nada era gravado.
 *
 * @param {{ valor:number, nome?:string, email?:string, user_id?:string, area_id?:string }} d
 */
export async function createDonationIntent(d) {
  const payload = {
    valor: Number(d.valor) || 0,
    status: 'pendente',
    nome: d.nome ?? null,
    email: d.email ?? null,
    user_id: d.user_id ?? null,
    area_id: d.area_id ?? null,
  }
  const { data, error } = await supabase.from('doacoes').insert(payload).select().single()
  if (error) throw error
  return data
}

export async function getDonations() {
  const { data, error } = await supabase
    .from('doacoes')
    .select('id, valor, status, nome, email, created_at, user_id, area_id')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

/** Atualiza o status de uma doação (conciliação manual no painel). */
export async function updateDonationStatus(id, status) {
  const { data, error } = await supabase
    .from('doacoes')
    .update({ status })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}
