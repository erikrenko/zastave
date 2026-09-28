import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import '../cluster.css'
import { flagUrl, hasValidCoords } from '../data'

// With 200+ countries, individual flag pins would pile up on top of each
// other (Europe especially). Nearby pins are grouped into one numbered
// bubble instead; zooming in or tapping a bubble splits it apart again.
function clusterIcon(cluster) {
  const count = cluster.getChildCount()
  const size = count < 10 ? 40 : count < 50 ? 48 : 56
  return L.divIcon({
    html: `<div class="cluster-bubble" style="width:${size}px;height:${size}px">${count}</div>`,
    className: 'cluster-wrapper',
    iconSize: [size, size],
  })
}

export default function MapView({ active, countries, onSelect }) {
  const mapRef = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (mapRef.current) return
    const map = L.map(containerRef.current, {
      zoomControl: false,
      // The cluster plugin requires the map to declare a maxZoom up front.
      maxZoom: 19,
      // Leaflet's default zoom moves in whole-number steps, which reads as
      // jumpy. zoomSnap/zoomDelta below are official, documented Leaflet
      // options that give fine-grained, smooth-feeling zoom using Leaflet's
      // own built-in animation — much safer than hand-rolling it.
      zoomSnap: 0.25,
      zoomDelta: 0.5,
      wheelPxPerZoomLevel: 90,
    }).setView([25, 10], 2)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map)
    L.control.zoom({ position: 'bottomright' }).addTo(map)

    const clusterGroup = L.markerClusterGroup({
      maxClusterRadius: 60,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      spiderfyOnMaxZoom: true,
      iconCreateFunction: clusterIcon,
    })

    countries.forEach((c) => {
      // No usable coordinates -> no pin (still visible in gallery and quiz).
      if (!hasValidCoords(c)) {
        console.warn(`[map] ${c.id} has no valid coords, not shown on the map`)
        return
      }
      const icon = L.divIcon({
        className: 'custom-pin-wrapper',
        html: `<div class="custom-flag-pin"><img src="${flagUrl(c)}" alt="${c.name_sl}" /></div>`,
        iconSize: [48, 48],
        iconAnchor: [24, 24],
      })
      const marker = L.marker([c.coords.lat, c.coords.lng], { icon })
      marker.on('click', () => onSelect(c.id))
      clusterGroup.addLayer(marker)
    })

    map.addLayer(clusterGroup)
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
