import { useEffect, useState } from 'react'
import client from '../api/client'

export default function ApiStatus() {
  const [status, setStatus] = useState('checking') 

  useEffect(() => {
    let ignore = false
    ;(async () => {
      try {
        const res = await client.get('/manage/airlines')
        if (!ignore) setStatus(res.status === 200 ? 'ok' : 'fail')
      } catch {
        if (!ignore) setStatus('fail')
      }
    })()
    return () => { ignore = true }
  }, [])

  const color = status === 'ok' ? 'green' : status === 'fail' ? 'crimson' : 'gray'

  return (
    <span style={{
      padding: '0.25rem 0.5rem',
      borderRadius: '0.5rem',
      background: color,
      color: 'white',
      fontSize: '0.9rem'
    }}>
      API: {status === 'checking' ? 'Checking…' : status === 'ok' ? 'Connected' : 'Unavailable'}
    </span>
  )
}
