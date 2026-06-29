'use client'
import { useEffect, useState, useCallback } from 'react'
import { getAreas, getAreaById } from '@/services/areasService'

export function useAreas() {
  const [areas, setAreas] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    return getAreas()
      .then((data) => { setAreas(data); setError(null) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { load() }, [load])

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
