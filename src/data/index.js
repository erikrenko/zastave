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

// Auto-loads every flag/crest file Erik has uploaded so far. Uploading a
// file here makes it live automatically — no code change needed per file.
// Supports .svg, .png and .webp side by side (mixed formats are fine).
const localFlagModules = import.meta.glob('../assets/flags/*.{svg,png,webp}', { eager: true, import: 'default' })
const localCrestModules = import.meta.glob('../assets/crests/*.{svg,png,webp}', { eager: true, import: 'default' })

// Matches a file by name regardless of extension or case, so "AD.webp",
// "ad.png" and "ad.svg" are all found by looking up "ad".
function lookupLocal(modules, key) {
  if (!key) return null
  const target = key.toLowerCase()
  for (const path in modules) {
    const filename = path.split('/').pop().replace(/\.(svg|png|webp)$/i, '')
    if (filename.toLowerCase() === target) return modules[path]
  }
  return null
}

export function flagUrl(country) {
  const key = country.iso2.toLowerCase()
  return lookupLocal(localFlagModules, key) || `https://flagcdn.com/${key}.svg`
}

export function crestUrl(country) {
  return (
    lookupLocal(localCrestModules, country.iso2) ||
    lookupLocal(localCrestModules, country.id) ||
    country.source_urls?.[1] ||
    country.source_urls?.[0] ||
    ''
  )
}
