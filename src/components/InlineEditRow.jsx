import { useState } from 'react'

export default function InlineEditRow({ initial = {}, onSave, onCancel, labels = { name: 'Name', code: 'Code' } }) {
  const [name, setName] = useState(initial.name ?? '')
  const [code, setCode] = useState(initial.code ?? '')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSave() {
    setSaving(true); setError(null)
    try {
      await onSave({ name: name.trim(), code: code.trim() })
    } catch (e) {
      setError(e?.response?.data?.message || e?.message || 'Failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <tr>
      <Td>
        <input value={name} onChange={e=>setName(e.target.value)} placeholder={labels.name} required />
      </Td>
      <Td>
        <input value={code} onChange={e=>setCode(e.target.value)} placeholder={labels.code} required />
      </Td>
      <Td style={{whiteSpace:'nowrap'}}>
        <button onClick={handleSave} disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
        <button onClick={onCancel} style={{marginLeft:'0.5rem'}}>Cancel</button>
      </Td>
      <Td style={{color:'crimson'}}>{error}</Td>
    </tr>
  )
}

function Td({ children, ...rest }) {
  return <td {...rest} style={{ padding:'0.5rem', borderBottom:'1px solid #f5f5f5' }}>{children}</td>
}
