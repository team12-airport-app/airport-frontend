import { useEffect, useRef, useState } from 'react'
import AirportSwitcher from '../components/AirportSwitcher'

const REFRESH_MS = Number(import.meta.env.VITE_REFRESH_MS ?? 30000)

export default function Boards() {
  const [airportId, setAirportId] = useState(null)
  const [tick, setTick] = useState(0)
  const timerRef = useRef()

  // start auto refresh. this is timer
  useEffect(() => {
    // clear previous
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setTick(t => t + 1), REFRESH_MS)
    return () => clearInterval(timerRef.current)
  }, [])


  useEffect(() => {
    if (!airportId) return

  }, [airportId, tick])

  return (
    <div style={{ padding: '1rem', display: 'grid', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ margin: 0 }}>Arrivals & Departures</h2>
        <AirportSwitcher value={airportId} onChange={setAirportId} />
      </div>

      <section>
        <h3 style={{ marginBottom: '0.5rem' }}>Arrivals</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <Th>Flight #</Th><Th>Airline</Th><Th>From</Th><Th>Scheduled</Th><Th>Gate</Th><Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              <tr><Td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No data yet</Td></tr>
            </tbody>
          </table>
        </div>
      </section>

      <section>
        <h3 style={{ marginBottom: '0.5rem' }}>Departures</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <Th>Flight #</Th><Th>Airline</Th><Th>To</Th><Th>Scheduled</Th><Th>Gate</Th><Th>Status</Th>
              </tr>
            </thead>
            <tbody>
              <tr><Td colSpan="6" style={{ textAlign: 'center', padding: '1rem' }}>No data yet</Td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function Th({ children }) {
  return <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #eee', fontWeight: 600 }}>{children}</th>
}
function Td({ children, ...rest }) {
  return <td {...rest} style={{ padding: '0.5rem', borderBottom: '1px solid #f5f5f5' }}>{children}</td>
}
