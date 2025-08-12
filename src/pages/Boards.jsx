import { useEffect, useRef, useState } from 'react'
import AirportSwitcher from '../components/AirportSwitcher'
import FlightTable from '../components/FlightTable'
import { listAircraft, listFlightsForAircraft } from '../api/aircraft'
import { buildRows } from '../utils/flightRows'

const REFRESH_MS = Number(import.meta.env.VITE_REFRESH_MS ?? 30000)

export default function Boards() {
  const [airportId, setAirportId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [arrivals, setArrivals] = useState([])
  const [departures, setDepartures] = useState([])
  const [tick, setTick] = useState(0)
  const timerRef = useRef()

  useEffect(() => {
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => setTick(t => t + 1), REFRESH_MS)
    return () => clearInterval(timerRef.current)
  }, [])

  useEffect(() => {
    let ignore = false
    if (!airportId) return

    ;(async () => {
      try {
        setLoading(true); setError(null)

        const aircraft = await listAircraft()
        const aircraftById = new Map(aircraft.map(a => [a.id, a]))

        const flightLists = await Promise.all(
          aircraft.map(a => listFlightsForAircraft(a.id).catch(() => []))
        )
        const flights = flightLists.flat()
        const selectedIdNum = Number(airportId)

        const arrFlights = flights.filter(f => f.toAirportId === selectedIdNum)
        const depFlights = flights.filter(f => f.fromAirportId === selectedIdNum)

        const arrRows = buildRows(arrFlights, aircraftById, 'arrivals')
        const depRows = buildRows(depFlights, aircraftById, 'departures')

        if (ignore) return
        setArrivals(arrRows)
        setDepartures(depRows)
        setLoading(false)
      } catch (e) {
        if (!ignore) {
          setError('Failed to load flights'); setLoading(false)
          setArrivals([]); setDepartures([])
        }
      }
    })()

    return () => { ignore = true }
  }, [airportId, tick])

  return (
    <div style={{ display: 'grid', gap: '1rem' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2 style={{ margin: 0 }}>Arrivals & Departures</h2>
        <AirportSwitcher value={airportId} onChange={setAirportId} />
      </div>

      {loading && <div>Loading flights…</div>}
      {error && <div style={{ color: 'crimson' }}>{error}</div>}

      <section>
        <h3>Arrivals</h3>
        <FlightTable rows={arrivals} mode="arrivals" />
      </section>

      <section>
        <h3>Departures</h3>
        <FlightTable rows={departures} mode="departures" />
      </section>
    </div>
  )
}

