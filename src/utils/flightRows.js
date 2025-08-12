// make display rows from flights + aircraft map
export function buildRows(flights, aircraftById, mode /* 'arrivals' | 'departures' */) {
  return flights.map(f => {
    const ac = aircraftById.get(f.aircraftId) || {}
    const airline = ac.airlineName || '—'
    const aircraftType = ac.type || ac.registrationNumber || '—'
    const when = mode === 'arrivals' ? f.arrivedAt : f.departedAt
    const placeCode = mode === 'arrivals' ? f.fromAirportCode : f.toAirportCode
    return {
      id: f.id,
      airline,
      aircraft: aircraftType,
      place: placeCode || '—',
      time: when || '—',
    }
  })
}
