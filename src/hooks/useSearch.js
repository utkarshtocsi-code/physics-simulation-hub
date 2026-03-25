// src/hooks/useSearch.js
import { useState, useMemo } from 'react'
import { simulations } from '../data/SimulationData.js'

export function useSearch() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return simulations.filter(s =>
      s.title.toLowerCase().includes(q) ||
      s.description.toLowerCase().includes(q) ||
      s.tags.some(t => t.toLowerCase().includes(q)) ||
      s.branch.toLowerCase().includes(q)
    )
  }, [query])

  return { query, setQuery, results }
}
