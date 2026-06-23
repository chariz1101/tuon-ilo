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

  return (
    <Map
      {...viewState}
      onMove={(evt) => setViewState(evt.viewState)}
      mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
      mapStyle="mapbox://styles/mapbox/streets-v12"
      style={{ width: '100%', height: '100vh' }}
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