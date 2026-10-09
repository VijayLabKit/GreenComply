import { useCallback, useEffect, useRef, useState } from 'react'
import api from '../lib/api'

/**
 * Fetch JSON from the API with loading / error / retry states and an
 * optional mock fallback. Returns:
 *   data          — API data, or fallback if the request failed
 *   loading       — true during the first load
 *   error         — error message string, or null
 *   retry         — call to refetch
 *   usingFallback — true when the shown data is the mock fallback
 */
export function useApi(path, { fallback = null, enabled = true } = {}) {
  const [data, setData] = useState(fallback)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const alive = useRef(true)
  // Pages pass inline object literals as `fallback`, which are new references
  // every render. Keeping it in a ref keeps `load` stable, so the effect below
  // doesn't refire forever (that caused an endless fetch loop and a page stuck
  // on its skeleton).
  const fallbackRef = useRef(fallback)
  useEffect(() => { fallbackRef.current = fallback }, [fallback])

  useEffect(() => {
    alive.current = true
    return () => { alive.current = false }
  }, [])

  const load = useCallback(async (silent = false) => {
    if (!path || !enabled) return
    if (!silent) setLoading(true)
    setError(null)
    try {
      const res = await api.get(path)
      if (!alive.current) return
      const payload = res.data
      const empty = payload == null || (Array.isArray(payload) && payload.length === 0)
      if (empty && fallbackRef.current !== null) {
        setData(fallbackRef.current)
        setUsingFallback(true)
      } else {
        setData(payload)
        setUsingFallback(false)
      }
    } catch (e) {
      if (!alive.current) return
      setError(e?.response?.data?.detail || e?.message || 'Request failed')
      if (fallbackRef.current !== null) {
        setData(fallbackRef.current)
        setUsingFallback(true)
      }
    } finally {
      if (alive.current) setLoading(false)
    }
  }, [path, enabled])

  useEffect(() => { load() }, [load])

  return { data, setData, loading, error, retry: () => load(), usingFallback }
}

/** Downloads a binary endpoint (e.g. report exports) as a file. */
export async function downloadFile(path, fallbackFilename) {
  const res = await api.get(path, { responseType: 'blob' })
  const header = res.headers?.['content-disposition'] || ''
  const match = header.match(/filename="?([^"]+)"?/)
  const filename = match?.[1] || fallbackFilename
  const url = URL.createObjectURL(res.data)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
  return filename
}
