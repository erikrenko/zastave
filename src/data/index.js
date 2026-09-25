// Auto-loads every JSON file in ./countries at build time.
// Adding a new country = adding a new JSON file here. Nothing else to touch.
const countryModules = import.meta.glob('./countries/*.json', { eager: true })

export const countries = Object.values(countryModules)
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

// Auto-loads every flag/crest file Erik has uploaded so far, keyed by
// filename (without extension), e.g. "ar" -> the built asset URL for ar.png.
// Uploading a file here makes it live automatically — no code change needed
// per file. Supports .svg and .png side by side (mixed formats are fine).
const localFlagModules = import.meta.glob('../assets/flags/*.{svg,png}', { eager: true, import: 'default' })
const localCrestModules = import.meta.glob('../assets/crests/*.{svg,png}', { eager: true, import: 'default' })

function lookupLocal(modules, key) {
  for (const path in modules) {
    const filename = path.split('/').pop().replace(/\.(svg|png)$/, '')
    if (filename === key) return modules[path]
  }
  return null
}

export function flagUrl(country) {
  // Prefer a self-hosted file, keyed by lowercase ISO2 (matches Erik's
  // upload convention, e.g. ar.png for Argentina). Falls back to the
  // flagcdn.com hotlink for any country not uploaded yet, so partial
  // progress never breaks the app.
  const key = country.iso2.toLowerCase()
  return lookupLocal(localFlagModules, key) || `https://flagcdn.com/${key}.svg`
}

export function crestUrl(country) {
  // Same local-first, hotlink-fallback pattern as flagUrl. Crests are
  // keyed by the country's own id (svn, arg, xkx...) since there's no
  // universal ISO code for a coat of arms the way there is for a flag.
  return (
    lookupLocal(localCrestModules, country.id) ||
    country.source_urls?.[1] ||
    country.source_urls?.[0] ||
    ''
  )
}
