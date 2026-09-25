import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { flagUrl } from '../data'

// Leaflet's built-in scroll-wheel zoom moves in discrete integer steps with
// a jump-animation between them — it reads as jerky rather than continuous.
// This handler replaces it with smooth, continuous zooming tied directly to
// wheel movement. Self-contained (no extra npm dependency), registered once
// below via L.Map.addInitHook.
const SmoothWheelZoom = L.Handler.extend({
  addHooks() {
    L.DomEvent.on(this._map._container, 'wheel', this._onWheelScroll, this)
  },
  removeHooks() {
    L.DomEvent.off(this._map._container, 'wheel', this._onWheelScroll, this)
  },
  _onWheelScroll(e) {
    if (!this._isWheeling) this._onWheelStart(e)
    this._onWheelChange(e)
    clearTimeout(this._timeoutId)
    this._timeoutId = setTimeout(() => this._onWheelEnd(), 200)
    L.DomEvent.preventDefault(e)
    L.DomEvent.stopPropagation(e)
  },
  _onWheelStart(e) {
    this._isWheeling = true
    this._wheelMousePosition = this._map.mouseEventToContainerPoint(e)
    this._startZoom = this._map.getZoom()
    this._goalZoom = this._startZoom
    this._moved = false
    this._map._stop()
  },
  _onWheelChange(e) {
    const delta = -e.deltaY
    this._goalZoom = Math.min(
      this._map.getMaxZoom(),
      Math.max(this._map.getMinZoom(), this._goalZoom + delta * 0.003)
    )
    const zoom = this._map.getZoom() + (this._goalZoom - this._map.getZoom()) * 0.5
    const center = this._map.unproject(
      this._map.project(this._map.containerPointToLatLng(this._wheelMousePosition), zoom).subtract(
        this._wheelMousePosition.subtract(this._map.getSize().divideBy(2))
      ),
      zoom
    )
    if (!this._moved) {
      this._map._moveStart(true, false)
      this._moved = true
    }
    L.Util.cancelAnimFrame(this._animId)
    this._animId = L.Util.requestAnimFrame(() => this._map._move(center, zoom), this, true)
  },
  _onWheelEnd() {
    this._isWheeling = false
    this._map._moveEnd(true)
  },
})
L.Map.addInitHook('addHandler', 'smoothWheelZoom', SmoothWheelZoom)

export default function MapView({ active, countries, onSelect }) {
  const mapRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (mapRef.current) return
    const map = L.map(containerRef.current, {
      zoomControl: false,
      scrollWheelZoom: false, // replaced by the smooth handler below
      smoothWheelZoom: true,
    }).setView([25, 10], 2)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    countries.forEach((c) => {
      const icon = L.divIcon({
        className: 'custom-pin-wrapper',
        html: `<div class="custom-flag-pin"><img src="${flagUrl(c)}" alt="${c.name_sl}" /></div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      })
      const marker = L.marker([c.coords.lat, c.coords.lng], { icon }).addTo(map)
      marker.on('click', () => onSelect(c.id))
    })

    mapRef.current = map
  }, [countries, onSelect])

  useEffect(() => {
    if (active && mapRef.current) {
      setTimeout(() => mapRef.current.invalidateSize(), 150)
    }
  }, [active])

  return (
    <section className={`view ${active ? 'active' : ''}`} id="map-view">
      <div id="map-container" ref={containerRef} />
    </section>
  )
}
