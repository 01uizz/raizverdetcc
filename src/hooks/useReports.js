'use client'
import { useEffect, useState, useCallback } from 'react'
import { getReportsByArea } from '@/services/reportsService'

export function useReports(areaId) {
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(() => {
    if (!areaId) return Promise.resolve()
    setLoading(true)
    return getReportsByArea(areaId)
      .then((d) => { setReports(d); setError(null) })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [areaId])

  useEffect(() => { load() }, [load])
  return { reports, loading, error, refetch: load }
}
