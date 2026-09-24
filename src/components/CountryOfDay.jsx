import { useMemo } from 'react'
import { flagUrl } from '../data'
import StatusBadge from './StatusBadge'

export default function CountryOfDay({ countries, onSelect }) {
  // Random on every load, per Erik's spec — no persistence, no backend.
  const country = useMemo(() => countries[Math.floor(Math.random() * countries.length)], [countries])
  if (!country) return null

  return (
    <div className="cod-banner" onClick={() => onSelect(country.id)}>
      <img src={flagUrl(country)} alt={country.name_sl} />
      <div>
        <div className="cod-label">Država dneva</div>
        <div className="cod-name">
          {country.name_sl}
          <StatusBadge country={country} />
        </div>
      </div>
    </div>
  )
}
