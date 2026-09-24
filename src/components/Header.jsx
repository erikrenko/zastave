export default function Header({ view, setView, uppercase, setUppercase, search, setSearch }) {
  return (
    <header>
      <div className="logo">
        <span className="logo-icon">🗺️</span>
        <span>Države sveta</span>
      </div>

      <div className="nav-tabs">
        <button className={`nav-btn ${view === 'map' ? 'active' : ''}`} onClick={() => setView('map')}>🗺️ Zemljevid</button>
        <button className={`nav-btn ${view === 'gallery' ? 'active' : ''}`} onClick={() => setView('gallery')}>🌍 Galerija</button>
        <button className={`nav-btn ${view === 'trivia' ? 'active' : ''}`} onClick={() => setView('trivia')}>🏆 Kviz</button>
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
