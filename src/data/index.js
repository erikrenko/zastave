// Auto-loads every JSON file in ./countries at build time.
// Adding a new country = adding a new JSON file here. Nothing else to touch.
const countryModules = import.meta.glob('./countries/*.json', { eager: true })

// Fields the app can't work without (gallery card, flag lookup, filters).
const REQUIRED_FIELDS = ['id', 'iso2', 'name_sl', 'capital_sl', 'region']

// One broken file must never take the whole site down. A country missing a
// required field is skipped, and the browser console says exactly which file
// and which fields (open DevTools -> Console and look for "[countries]").
export const countries = Object.entries(countryModules)
  .map(([path, mod]) => ({ path, data: mod.default }))
  .filter(({ path, data }) => {
    const missing = REQUIRED_FIELDS.filter((k) => !data || !data[k])
    if (missing.length) {
      console.warn(`[countries] ${path} skipped, missing: ${missing.join(', ')}`)
      return false
    }
    return true
  })
  .map(({ data }) => data)
  .sort((a, b) => a.name_sl.localeCompare(b.name_sl, 'sl'))

// The map needs real numbers for coordinates. A country without them still
// shows in the gallery and quiz, it just gets no pin on the map.
export function hasValidCoords(country) {
  return Number.isFinite(country?.coords?.lat) && Number.isFinite(country?.coords?.lng)
}

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
  // Prefer a self-hosted file, keyed by ISO2. Falls back to the
  // flagcdn.com hotlink for any country not uploaded yet, so partial
  // progress never breaks the app.
  const key = country.iso2.toLowerCase()
  return lookupLocal(localFlagModules, key) || `https://flagcdn.com/${key}.svg`
}

export function crestUrl(country) {
  // Same local-first, hotlink-fallback pattern as flagUrl. Crests may be
  // named by ISO2 (Erik's actual upload convention, e.g. AD.webp for
  // Andorra) or by the country's own id (used for entities without a real
  // ISO2, like Kosovo/England) — both are checked.
  return (
    lookupLocal(localCrestModules, country.iso2) ||
    lookupLocal(localCrestModules, country.id) ||
    country.source_urls?.[1] ||
    country.source_urls?.[0] ||
    ''
  )
}
