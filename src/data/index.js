// Auto-loads every JSON file in ./countries at build time.
// Adding a new country = adding a new JSON file here. Nothing else to touch.
const modules = import.meta.glob('./countries/*.json', { eager: true })

export const countries = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.name_sl.localeCompare(b.name_sl, 'sl'))

export const continentLabels = {
  europe: 'Evropa',
  asia: 'Azija',
  africa: 'Afrika',
  north_america: 'S. Amerika',
  south_america: 'J. Amerika',
  oceania: 'Avstralija in Oceanija',
}

export function flagUrl(country) {
  // Placeholder during prototyping: flagcdn.com by ISO2 code.
  // TODO before launch: swap to self-hosted /assets/flags/{flag_file}
  // per spec.md §4 — do not ship to production hotlinking flagcdn.com.
  return `https://flagcdn.com/${country.iso2.toLowerCase()}.svg`
}

export function crestUrl(country) {
  // Placeholder during prototyping — same caveat as flagUrl above.
  // Real build: self-hosted /assets/crests/{crest_file}, sourced per
  // spec.md §4 with license/attribution tracked in source_urls.
  return country.source_urls?.[1] || country.source_urls?.[0] || ''
}
