'use client'

import { useState } from 'react'
import Map, { Marker, MapMouseEvent } from 'react-map-gl/mapbox'

interface LocationPickerProps {
  latitude: number
  longitude: number
  onChange: (lat: number, lng: number) => void
}

export default function LocationPicker({
  latitude,
  longitude,
  onChange,
}: LocationPickerProps) {
  const [viewState, setViewState] = useState({
    longitude: longitude || 122.5644, // default: Iloilo City center
    latitude: latitude || 10.7202,
    zoom: 13,
  })

  function handleMapClick(event: MapMouseEvent) {
    const { lng, lat } = event.lngLat
    onChange(lat, lng)
    setViewState((prev) => ({ ...prev, latitude: lat, longitude: lng }))
  }

  function handleMarkerDrag(event: { lngLat: { lat: number; lng: number } }) {
    const { lng, lat } = event.lngLat
    onChange(lat, lng)
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <Map
        {...viewState}
        onMove={(evt: { viewState: typeof viewState }) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        style={{ width: '100%', height: '300px' }}
      >
        {latitude && longitude && (
          <Marker
            longitude={longitude}
            latitude={latitude}
            draggable
            onDragEnd={handleMarkerDrag}
          />
        )}
      </Map>
      <p className="bg-slate-50 px-3 py-2 text-xs text-slate-500">
        Click anywhere on the map to drop a pin, or drag the pin to fine-tune its position.
      </p>
    </div>
  )
}