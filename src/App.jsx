import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import ApiStatus from './components/ApiStatus'
import Boards from './pages/Boards'
import AdminQuick from './pages/AdminQuick'

export default function App() {
  return (
    <BrowserRouter>
      <header className="site-header">
        <nav className="site-nav">
          <Link to="/">Boards</Link>
          <Link to="/admin">Admin</Link>
        </nav>
        <ApiStatus />
      </header>

      <main className="site-main">
        <Routes>
          <Route path="/" element={<Boards />} />
          <Route path="/admin" element={<AdminQuick />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}


