'use client'
import { useEffect, useState, useCallback } from 'react'
import { getAreas, getAreaById } from '@/services/areasService'
import { supabase } from '@/lib/supabase'

export function useAreas() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback((silent = false) => {
    if (!silent) setLoading(true)
    return getAreas()
      .then((data) => { setAreas(data); setError(null) })
      .catch((e) => setError(e.message))
      .finally(() => { if (!silent) setLoading(false) })
  }, [])

  useEffect(() => { load() }, [load])

  // Mantém a lista sincronizada com o que o admin altera, SEM recarregar a
  // página: (1) ao voltar o foco/aba e (2) em tempo real via Supabase Realtime
  // (se habilitado no projeto; caso contrário, o foco já cobre a atualização).
  // Revalidação em segundo plano é "silenciosa" (não exibe o spinner).
  useEffect(() => {
    function revalidate() {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return
      load(true)
    }
    window.addEventListener('focus', revalidate)
    document.addEventListener('visibilitychange', revalidate)

    let channel
    try {
      channel = supabase
        .channel('public:areas')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'areas' }, () => load(true))
        .subscribe()
    } catch {
      channel = null
    }

    return () => {
      window.removeEventListener('focus', revalidate)
      document.removeEventListener('visibilitychange', revalidate)
      if (channel) { try { supabase.removeChannel(channel) } catch {} }
    }
  }, [load])

  // refetch permite atualizar a lista após criar/editar/excluir
  // SEM recarregar a página inteira (substitui window.location.reload()).
  return { areas, loading, error, refetch: load }
}

export function useArea(id) {
  const [area, setArea] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    if (!id) return Promise.resolve()
    setLoading(true)
    return getAreaById(id)
      .then((data) => { setArea(data); setError(null) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [id])

  useEffect(() => { load() }, [load])

  return { area, loading, error, refetch: load }
}
