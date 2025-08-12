import { useEffect, useState } from 'react'
import { listAirlines, createAirline, updateAirline, deleteAirline } from '../api/airlines'
import InlineEditRow from './InlineEditRow'

export default function AdminAirlines() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [creating, setCreating] = useState(false)
  const [editingId, setEditingId] = useState(null)

  async function refresh() {
    setLoading(true); setError(null)
    try {
      setRows(await listAirlines())
    } catch (e) {
      setError('Failed to load airlines')
    } finally { setLoading(false) }
  }

  useEffect(() => { refresh() }, [])

  return (
    <section style={{ display:'grid', gap:'0.5rem' }}>
      <h3 style={{margin:'0.5rem 0'}}>Airlines</h3>
      {loading && <div>Loading…</div>}
      {error && <div style={{color:'crimson'}}>{error}</div>}

      <div style={{ overflowX:'auto' }}>
        <table style={{ width:'100%', borderCollapse:'collapse' }}>
          <thead>
            <tr><Th>ID</Th><Th>Name</Th><Th>Code</Th><Th>Actions</Th><Th>Msg</Th></tr>
          </thead>
          <tbody>
            {creating && (
              <InlineEditRow
                onSave={async (payload) => { await createAirline(payload); setCreating(false); await refresh() }}
                onCancel={()=>setCreating(false)}
                labels={{name:'Airline name', code:'Airline code'}}
              />
            )}

            {rows.map(r => (
              editingId === r.id ? (
                <InlineEditRow key={r.id}
                  initial={{ name:r.name, code:r.code }}
                  onSave={async (payload)=>{ await updateAirline(r.id, payload); setEditingId(null); await refresh() }}
                  onCancel={()=>setEditingId(null)}
                  labels={{name:'Airline name', code:'Airline code'}}
                />
              ) : (
                <tr key={r.id}>
                  <Td>{r.id}</Td>
                  <Td>{r.name}</Td>
                  <Td>{r.code}</Td>
                  <Td style={{whiteSpace:'nowrap'}}>
                    <button onClick={()=>setEditingId(r.id)}>Edit</button>
                    <button onClick={async ()=>{
                      if (!confirm(`Delete airline "${r.name}"?`)) return
                      try { await deleteAirline(r.id); await refresh() }
                      catch(e){ alert(e?.response?.data?.message || e.message) }
                    }} style={{marginLeft:'0.5rem'}}>Delete</button>
                  </Td>
                  <Td />
                </tr>
              )
            ))}

            {!creating && (
              <tr>
                <Td colSpan="5">
                  <button onClick={()=>setCreating(true)}>+ Add Airline</button>
                </Td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

function Th({ children }) {
  return <th style={{ textAlign:'left', padding:'0.5rem', borderBottom:'1px solid #eee', fontWeight:600 }}>{children}</th>
}
function Td({ children, ...rest }) {
  return <td {...rest} style={{ padding:'0.5rem', borderBottom:'1px solid #f5f5f5' }}>{children}</td>
}
