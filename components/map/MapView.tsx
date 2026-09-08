'use client'

import { useState } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import MapPin from '@/components/map/MapPin'
import type { Location } from '@/types'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapViewProps {
  locations: Location[]
  onSelectLocation?: (location: Location) => void
}

export default function MapView({ locations, onSelectLocation }: MapViewProps) {
  const [viewState, setViewState] = useState({
    longitude: 122.5644,
    latitude: 10.7202,
    zoom: 13,
  })

  const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN

  if (!mapboxToken) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-slate-100 p-6">
        <p className="max-w-xs text-center text-sm text-slate-500">
          The map can&apos;t be shown right now — no Mapbox token is configured.
        </p>
      </div>
    )
  }

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapboxAccessToken={mapboxToken}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      // Fills the positioned parent rather than the viewport, so the map never
      // runs past the bottom of a phone screen or under the sidebar.
      style={{ width: '100%', height: '100%' }}
    >
      {locations.map((location) => (
        <Marker
          key={location.id}
          longitude={location.longitude}
          latitude={location.latitude}
          anchor="bottom"
          onClick={(e) => {
            e.originalEvent.stopPropagation()
            onSelectLocation?.(location)
          }}
        >
          <MapPin type={location.type} />
        </Marker>
      ))}
    </Map>
  )
}
