'use client'

import { useEffect, useState } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import { supabase } from '@/lib/supabase'
import { pinColor } from '@/lib/utils'
import type { Location } from '@/types'
import 'mapbox-gl/dist/mapbox-gl.css'

interface MapViewProps {
  onSelectLocation?: (location: Location) => void
}

export default function MapView({ onSelectLocation }: MapViewProps) {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [viewState, setViewState] = useState({
    longitude: 122.5644,
    latitude: 10.7202,
    zoom: 13,
  })

  useEffect(() => {
    async function fetchLocations() {
      const { data, error } = await supabase
        .from('locations')
        .select('*')
        .eq('is_approved', true)

      if (error) {
        setError(error.message)
      } else {
        setLocations((data ?? []) as Location[])
      }
      setLoading(false)
    }

    fetchLocations()
  }, [])

  return (
    <div className="relative h-screen w-full">
      {loading && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm shadow">
          Loading spots...
        </div>
      )}
      {error && (
        <div className="absolute left-1/2 top-4 z-10 -translate-x-1/2 rounded-full bg-red-50 px-4 py-2 text-sm text-red-600 shadow">
          Failed to load spots: {error}
        </div>
      )}

      <Map
        {...viewState}
        onMove={(evt) => setViewState(evt.viewState)}
        mapboxAccessToken={process.env.NEXT_PUBLIC_MAPBOX_TOKEN}
        mapStyle="mapbox://styles/mapbox/streets-v12"
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
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill={pinColor(location.type)}
              stroke="white"
              strokeWidth="1"
              style={{ cursor: 'pointer' }}
            >
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
            </svg>
          </Marker>
        ))}
      </Map>
    </div>
  )
}