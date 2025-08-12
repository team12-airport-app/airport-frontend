import { useState } from 'react'
import AdminAirlines from '../components/AdminAirlines'
import AdminGates from '../components/AdminGates'

export default function AdminQuick() {
  const [tab, setTab] = useState('airlines')

  return (
    <div style={{ padding:'1rem', display:'grid', gap:'1rem' }}>
      <h2 style={{margin:0}}>Admin</h2>

      <div role="tablist" style={{ display:'flex', gap:'0.5rem' }}>
        <button onClick={()=>setTab('airlines')} aria-selected={tab==='airlines'}>Airlines</button>
        <button onClick={()=>setTab('gates')} aria-selected={tab==='gates'}>Gates</button>
      </div>

      {tab === 'airlines' ? <AdminAirlines /> : <AdminGates />}
    </div>
  )
}
