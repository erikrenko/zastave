import { useState, useMemo } from 'react'
import { continentLabels, flagUrl } from '../data'
import StatusBadge from './StatusBadge'

export default function Gallery({ active, countries, search, onSelect }) {
  const [continent, setContinent] = useState('Vse')

  const filtered = useMemo(() => {
    let list = countries
    if (continent !== 'Vse') list = list.filter((c) => c.region === continent)
    if (search) {
      const q = search.toLowerCase()
      list = list.filter((c) => c.name_sl.toLowerCase().includes(q) || c.capital_sl.toLowerCase().includes(q))
    }
    return list
  }, [countries, continent, search])

  return (
    <section className={`view ${active ? 'active' : ''}`} id="gallery-view" style={{ flexDirection: 'column' }}>
      <div className="continent-filters">
        <button className={`filter-chip ${continent === 'Vse' ? 'active' : ''}`} onClick={() => setContinent('Vse')}>Vse države</button>
        {Object.entries(continentLabels).map(([key, label]) => (
          <button key={key} className={`filter-chip ${continent === key ? 'active' : ''}`} onClick={() => setContinent(key)}>
            {label}
          </button>
        ))}
      </div>
      <div className="countries-grid">
        {filtered.map((c) => (
          <div className="country-card" key={c.id} onClick={() => onSelect(c.id)}>
            <img className="card-flag" src={flagUrl(c)} alt={c.name_sl} />
            <h3>{c.name_sl}<StatusBadge country={c} /></h3>
            <p>🏛️ {c.capital_sl}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
