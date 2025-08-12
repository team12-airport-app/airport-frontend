import client from './client'

// LIST
export async function listAirlines() {
  const res = await client.get('/manage/airlines')
  return Array.isArray(res.data) ? res.data : []
}

// Create 
export async function createAirline(payload) {
  const res = await client.post('/manage/airlines', payload)
  return res.data
}

// Update 
export async function updateAirline(id, payload) {
  const res = await client.put(`/manage/airlines/${id}`, payload)
  return res.data
}

// DELETE
export async function deleteAirline(id) {
  await client.delete(`/manage/airlines/${id}`)
}
