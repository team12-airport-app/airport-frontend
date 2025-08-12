import { describe, it, expect } from 'vitest'
import { buildRows } from './flightRows'

describe('buildRows', () => {
  const aircraft = [{ id: 1, airlineName: 'TestAir', type: 'A320' }]
  const aircraftById = new Map(aircraft.map(a => [a.id, a]))

  const flights = [
    { id: 11, aircraftId: 1, fromAirportId: 10, fromAirportCode: 'YYZ', toAirportId: 20, toAirportCode: 'YYT', departedAt: '2025-08-12T10:00:00Z', arrivedAt: '2025-08-12T12:00:00Z' },
  ]

  it('maps arrivals correctly', () => {
    const rows = buildRows(flights, aircraftById, 'arrivals')
    expect(rows).toHaveLength(1)
    expect(rows[0]).toMatchObject({ airline: 'TestAir', aircraft: 'A320', place: 'YYZ', time: '2025-08-12T12:00:00Z' })
  })

  it('maps departures correctly', () => {
    const rows = buildRows(flights, aircraftById, 'departures')
    expect(rows[0]).toMatchObject({ place: 'YYT', time: '2025-08-12T10:00:00Z' })
  })
})
