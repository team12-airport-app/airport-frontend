import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ApiStatus from './components/ApiStatus'
import Boards from './pages/Boards'
import AdminQuick from './pages/AdminQuick'

export default function App() {
  return (
    <BrowserRouter>
      <header style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '1rem', borderBottom: '1px solid #ddd'
      }}>
        <nav style={{ display: 'flex', gap: '1rem' }}>
          <Link to="/">Boards</Link>
          <Link to="/admin">Admin</Link>
        </nav>
        <ApiStatus />
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Boards />} />
          <Route path="/admin" element={<AdminQuick />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}


