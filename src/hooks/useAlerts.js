import { useState, useEffect, useCallback, useRef } from 'react'

// const BASE_URL = 'http://localhost:8080'
const BASE_URL ="https://shadowguard-backend-final.onrender.com";
const POLL_INTERVAL = 5000 

export function useAlerts(token, onUnauthorized) {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [syncTime, setSyncTime] = useState('–')
  const [error, setError] = useState(null)
  const [newCount, setNewCount] = useState(0) 
  const prevLengthRef = useRef(0)

  const fetchData = useCallback(async (isManual = false) => {
    if (!token) return
    if (isManual) setLoading(true)
    setError(null)
    try {
      const res = await fetch(`${BASE_URL}/api/alerts`, {
        headers: { Authorization: 'Bearer ' + token },
      })
      if (res.status === 401 || res.status === 403) {
        onUnauthorized()
        return
      }
      const expiry = sessionStorage.getItem('sg_expiry')
if (expiry && Date.now() > Number(expiry)) {
  sessionStorage.clear()
  onUnauthorized()
  return
}
      const data = await res.json()
      const reversed = Array.isArray(data) ? [...data].reverse() : []

      setAlerts((prev) => {
        const diff = reversed.length - prev.length
        if (diff > 0) setNewCount(diff)
        return reversed
      })

      prevLengthRef.current = reversed.length
      setSyncTime(new Date().toLocaleTimeString())
    } catch (e) {
      setError('Connection failed — is your backend running?')
    } finally {
      if (isManual) setLoading(false)
    }
  }, [token, onUnauthorized])

  // Initial fetch + live polling
  useEffect(() => {
    if (!token) return
    fetchData(true) // first load shows spinner
    const loop = setInterval(() => fetchData(false), POLL_INTERVAL)
    return () => clearInterval(loop)
  }, [token, fetchData])

  // Clear new count after 3s
  useEffect(() => {
    if (newCount === 0) return
    const t = setTimeout(() => setNewCount(0), 3000)
    return () => clearTimeout(t)
  }, [newCount])

  const stats = {
    total: alerts.length,
    blocked: alerts.filter((a) => a.verdict === 'BLOCKED').length,
    warning: alerts.filter((a) => a.verdict === 'WARNING').length,
    safe: alerts.filter((a) => a.verdict === 'SAFE').length,
  }

  return { alerts, loading, syncTime, error, fetchData, stats, newCount }
}

export async function loginRequest(email, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) throw new Error('Invalid credentials')
  return res.json()
}