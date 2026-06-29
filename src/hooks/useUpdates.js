'use client'

import { useEffect, useState } from 'react'
import { getUpdatesByArea, getAllUpdates } from '@/services/updatesService'

export function useUpdatesByArea(areaId) {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!areaId) return

    getUpdatesByArea(areaId)
      .then(setUpdates)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [areaId])

  return { updates, loading, error }
}

export function useAllUpdates() {
  const [updates, setUpdates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    getAllUpdates()
      .then(setUpdates)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { updates, loading, error }
}