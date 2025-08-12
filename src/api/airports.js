import client from './client'

export async function listAirports() {
  const res = await client.get('/airports')
  return Array.isArray(res.data) ? res.data : []
}
