import { useState } from 'react'

const NAV = [
  { id: 'gallery', icon: '🌍', label: 'Galerija' },
  { id: 'map', icon: '🗺️', label: 'Zemljevid' },
  { id: 'trivia', icon: '🏆', label: 'Kviz' },
]

export default function Header({ view, setView, uppercase, setUppercase }) {
  const [menuOpen, setMenuOpen] = useState(false)

  function go(id) {
    setView(id)
    setMenuOpen(false)
  }

  function renderCaseToggle() {
    return (
      <div className="case-toggle" onClick={() => setUppercase(!uppercase)} title="Spremeni velikost črk">
        <button className={`case-btn ${!uppercase ? 'active' : ''}`}>abc</button>
        <button className={`case-btn ${uppercase ? 'active' : ''}`}>ABC</button>
      </div>
    )
  }

  return (
    <header>
      <div className="logo">
        <span className="logo-icon">🗺️</span>
        <span className="logo-text">Države sveta</span>
      </div>

      {/* Desktop / tablet: tabs + case toggle in the bar */}
      <div className="nav-tabs">
        {NAV.map((n) => (
          <button key={n.id} className={`nav-btn ${view === n.id ? 'active' : ''}`} onClick={() => go(n.id)}>
            {n.icon} <span className="nav-label">{n.label}</span>
          </button>
        ))}
      </div>
      <div className="header-actions">{renderCaseToggle()}</div>

      {/* Mobile: everything lives behind one hamburger button */}
      <button
        className="hamburger"
        aria-label="Meni"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((o) => !o)}
      >
        {menuOpen ? '✕' : '☰'}
      </button>

      {menuOpen && (
        <>
          <div className="menu-backdrop" onClick={() => setMenuOpen(false)} />
          <nav className="mobile-menu">
            {NAV.map((n) => (
              <button
                key={n.id}
                className={`mobile-menu-item ${view === n.id ? 'active' : ''}`}
                onClick={() => go(n.id)}
              >
                <span className="mobile-menu-icon">{n.icon}</span> {n.label}
              </button>
            ))}
            <div className="mobile-menu-row">
              <span>Velikost črk</span>
              {renderCaseToggle()}
            </div>
          </nav>
        </>
      )}
    </header>
  )
}
