import client from './client'

export async function listAircraft() {
  const res = await client.get('/aircraft')
  return Array.isArray(res.data) ? res.data : []
}

export async function listFlightsForAircraft(aircraftId) {
  const res = await client.get(`/aircraft/${aircraftId}/flights`)
  return Array.isArray(res.data) ? res.data : []
}
