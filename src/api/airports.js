import client from './client'

export async function listAirports() {
  const res = await client.get('/manage/airports') 
  return res.data
}
