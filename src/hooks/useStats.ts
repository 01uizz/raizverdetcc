'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

interface Stats {
  totalArrecadado: number
  totalDoadores: number
  totalArvores: number
  totalAreas: number
  totalHectares: number
}

const INITIAL: Stats = {
  totalArrecadado: 0,
  totalDoadores: 0,
  totalArvores: 0,
  totalAreas: 0,
  totalHectares: 0,
}

export function useStats() {
  const [stats, setStats] = useState<Stats>(INITIAL)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function loadStats() {
      try {
        const [areasRes, updatesRes, doadoresRes, doacoesRes] = await Promise.all([
          supabase.from('areas').select('id, tamanho, status'),
          // CORREÇÃO: a tabela correta é 'area_updates' (antes consultava 'updates', inexistente)
          supabase.from('area_updates').select('arvores'),
          supabase.from('profiles').select('id', { count: 'exact', head: true }).eq('tipo', 'doador'),
          // Arrecadação real, calculada a partir das doações confirmadas/pagas
          supabase.from('doacoes').select('valor, status'),
        ])

        if (cancelled) return

        if (areasRes.error) console.warn('[useStats] areas:', areasRes.error.message)
        if (updatesRes.error) console.warn('[useStats] area_updates:', updatesRes.error.message)
        if (doadoresRes.error) console.warn('[useStats] profiles:', doadoresRes.error.message)
        if (doacoesRes.error) console.warn('[useStats] doacoes:', doacoesRes.error.message)

        const areas = areasRes.data ?? []
        const updates = updatesRes.data ?? []
        const doacoes = doacoesRes.data ?? []

        const totalArvores = updates.reduce((s, u: any) => s + (Number(u.arvores) || 0), 0)
        const totalHectaresRaw = areas.reduce((s, a: any) => s + (Number(a.tamanho) || 0), 0)
        const totalArrecadado = doacoes
          .filter((d: any) => d.status === 'confirmado' || d.status === 'pago')
          .reduce((s, d: any) => s + (Number(d.valor) || 0), 0)

        setStats({
          totalArrecadado,
          totalDoadores: doadoresRes.count ?? 0,
          totalArvores,
          totalAreas: areas.length,
          totalHectares: Math.round(totalHectaresRaw * 10) / 10,
        })
      } catch (err) {
        if (!cancelled) {
          const msg = err instanceof Error ? err.message : 'Erro desconhecido'
          console.error('[useStats]', msg)
          setError(msg)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadStats()
    return () => { cancelled = true }
  }, [])

  return { stats, loading, error }
}
