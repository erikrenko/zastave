export default function Header({ view, setView, uppercase, setUppercase, search, setSearch }) {
  return (
    <header>
      <div className="logo">
        <span className="logo-icon">🗺️</span>
        <span className="logo-text">Države sveta</span>
      </div>

      <div className="nav-tabs">
        <button className={`nav-btn ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')}>🗺️ <span className="nav-label">Zemljevid</span></button>
        <button className={`nav-btn ${view === 'gallery' ? 'active' : ''}`} onClick={() => setView('gallery')}>🌍 <span className="nav-label">Galerija</span></button>
        <button className={`nav-btn ${view === 'trivia' ? 'active' : ''}`} onClick={() => setView('trivia')}>🏆 <span className="nav-label">Kviz</span></button>
      </div>

      <div className="header-actions">
        <div className="case-toggle" onClick={() => setUppercase(!uppercase)} title="Spremeni velikost črk">
          <button className={`case-btn ${!uppercase ? 'active' : ''}`}>abc</button>
          <button className={`case-btn ${uppercase ? 'active' : ''}`}>ABC</button>
        </div>
        <div className="search-bar">
          🔍
          <input
            type="text"
            placeholder="Išči državo..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              if (e.target.value && view !== 'gallery') setView('gallery')
            }}
          />
        </div>
      </div>
    </header>
  )
}
