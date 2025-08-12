import { useEffect, useState } from 'react'
import client from '../api/client'

export default function ApiStatus() {
  const [status, setStatus] = useState('checking') // 'ok' | 'fail'

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

  const cls =
    status === 'ok' ? 'badge badge--ok' :
    status === 'fail' ? 'badge badge--fail' :
    'badge badge--checking'

  return (
    <span className={cls}>
      API: {status === 'checking' ? 'Checking…' : status === 'ok' ? 'Connected' : 'Unavailable'}
    </span>
  )
}

