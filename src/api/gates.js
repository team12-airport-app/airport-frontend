import client from './client'

export async function listGates() {
  const res = await client.get('/manage/gates')
  return Array.isArray(res.data) ? res.data : []
}

export async function createGate(payload) {
  const res = await client.post('/manage/gates', payload)
  return res.data
}

export async function updateGate(id, payload) {
  const res = await client.put(`/manage/gates/${id}`, payload)
  return res.data
}

export async function deleteGate(id) {
  await client.delete(`/manage/gates/${id}`)
}
