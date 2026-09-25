import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { flagUrl } from '../data'

export default function MapView({ active, countries, onSelect }) {
  const mapRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (mapRef.current) return
    const map = L.map(containerRef.current, { zoomControl: false }).setView([25, 10], 2)
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
