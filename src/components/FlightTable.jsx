export default function FlightTable({ rows, mode }) {
  const emptyMsg = mode === 'arrivals' ? 'No arrivals' : 'No departures'
  return (
    <div className="table-wrap">
      <table className="table--flights">
        <colgroup>
          <col className="col-airline" />
          <col className="col-aircraft" />
          <col className="col-place" />
          <col className="col-time" />
        </colgroup>
        <thead>
          <tr>
            <th>Airline</th>
            <th>Aircraft</th>
            <th>{mode === 'arrivals' ? 'From' : 'To'}</th>
            <th>{mode === 'arrivals' ? 'ETA' : 'ETD'}</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '1rem' }}>
                {emptyMsg}
              </td>
            </tr>
          ) : (
            rows.map(r => (
              <tr key={r.id}>
                <td>{r.airline}</td>
                <td>{r.aircraft}</td>
                <td>{r.place}</td>
                <td>{fmtTime(r.time)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

function fmtTime(t) {
  if (!t) return '—'
  try {
    const d = new Date(t)
    return isNaN(d.getTime()) ? String(t) : d.toLocaleString()
  } catch { return String(t) }
}


