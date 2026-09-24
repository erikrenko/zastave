# Države sveta

Kids' flags/crests/geography site in Slovenian, built the same way as `nogometni-grbi`: Vite + React, static data, GitHub + Vercel. No backend.

Repo name on GitHub: **zastave**.

## Pushing this to GitHub — no local npm needed

You don't need to run `npm install` or `npm run build` yourself — Vercel runs both automatically the moment you push. Drag-and-drop this whole folder's contents into the `zastave` repo via GitHub's web UI (browser-only, works on the locked-down laptop), then connect the repo to Vercel exactly like `nogometni-grbi`. That's the entire deploy step.

`npm run dev` locally is only for previewing on your own machine before pushing — entirely optional, skip it if you don't want the local loop.

## Adding a country

Drop a new JSON file into `src/data/countries/` following the shape of the existing ones (see `svn.json` for a fully-filled example). It's picked up automatically — nothing else to wire up.

For a non-sovereign or partially-recognized entity (Kosovo, England, etc. — see `xkx.json` and `eng.json` for examples), add:
```json
"entity_type": "partially_recognized",   // or: fifa_member_non_sovereign, observer_state
"status_badge_sl": "Delno priznana država"
```
This renders as a small amber badge next to the name everywhere (gallery, passport modal, country-of-the-day).

## Before this goes live — do not skip

1. **Self-host flags and crests.** `src/data/index.js` currently pulls flags from `flagcdn.com` and crests straight from Wikimedia Commons URLs for prototyping speed. Before launch: download the real files into `src/assets/flags/` and `src/assets/crests/` (named `{id}.svg` to match each country's `flag_file`/`crest_file`), swap `flagUrl()`/`crestUrl()` to read from there, and keep the original source URL in `source_urls` for attribution/licensing.
2. **26 of ~211 countries exist.** Scaling to the full FIFA-member list is the real remaining work.
3. **Historical flags and subdivision galleries** (USA states, UK nations, Germany, Spain) are not built yet — additive phases, deliberately deferred.

## Structure

```
src/data/countries/*.json   one file per country/entity
src/data/index.js           auto-loader + continent labels + asset URL helpers
src/components/             Header, CountryOfDay, MapView (Leaflet), Gallery,
                             PassportModal, TriviaView, StatusBadge
src/assets/flags/           self-hosted flag SVGs go here (not yet populated)
src/assets/crests/          self-hosted crest SVGs go here (not yet populated)
```

