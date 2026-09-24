export default function StatusBadge({ country }) {
  if (!country.status_badge_sl) return null
  return <span className="status-badge">{country.status_badge_sl}</span>
}
