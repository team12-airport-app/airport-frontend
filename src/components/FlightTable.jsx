export default function FlightTable({ rows, mode }) {
  const emptyMsg = mode === 'arrivals' ? 'No arrivals' : 'No departures'
  return (
    <div style={{ overflowX: 'auto' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <Th>Airline</Th>
            <Th>Aircraft</Th>
            <Th>{mode === 'arrivals' ? 'From' : 'To'}</Th>
            <Th>{mode === 'arrivals' ? 'ETA' : 'ETD'}</Th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr><Td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>{emptyMsg}</Td></tr>
          ) : rows.map(r => (
            <tr key={r.id}>
              <Td>{r.airline}</Td>
              <Td>{r.aircraft}</Td>
              <Td>{r.place}</Td>
              <Td>{fmtTime(r.time)}</Td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Th({ children }) {
  return <th style={{ textAlign: 'left', padding: '0.5rem', borderBottom: '1px solid #eee', fontWeight: 600 }}>{children}</th>
}
function Td({ children, ...rest }) {
  return <td {...rest} style={{ padding: '0.5rem', borderBottom: '1px solid #f5f5f5' }}>{children}</td>
}
function fmtTime(t) {
  if (!t) return '—'
  try {
    const d = new Date(t)
    return isNaN(d.getTime()) ? String(t) : d.toLocaleString()
  } catch { return String(t) }
}
