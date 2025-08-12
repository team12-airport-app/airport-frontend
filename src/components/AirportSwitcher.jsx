import { useEffect, useState } from 'react'
import { listAirports } from '../api/airports'

export default function AirportSwitcher({ value, onChange }) {
  const [airports, setAirports] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        setLoading(true)
        const data = await listAirports()
        if (!ignore) {
          setAirports(Array.isArray(data) ? data : [])
          setError(null)
          setLoading(false)
          // note to self!!! auto select first airport if nothing is picked
          if (!value && data?.length) onChange?.(String(data[0].id))
        }
      } catch (e) {
        if (!ignore) {
          setError('Failed to load airports')
          setLoading(false)
        }
      }
    })()
    return () => { ignore = true }
  }, []) 

  if (loading) return <span>Loading airports…</span>
  if (error) return <span style={{ color: 'crimson' }}>{error}</span>
  if (!airports.length) return <span>No airports available</span>

  return (
    <label style={{ display: 'inline-flex', gap: '0.5rem', alignItems: 'center' }}>
      <span>Airport</span>
      <select value={value ?? ''} onChange={e => onChange?.(e.target.value)}>
        {airports.map(a => (
          <option key={a.id} value={a.id}>
            {a.code ? `${a.code} — ${a.name}` : a.name}
          </option>
        ))}
      </select>
    </label>
  )
}
