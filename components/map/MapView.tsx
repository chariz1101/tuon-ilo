'use client'

import { useEffect, useState } from 'react'
import Map, { Marker } from 'react-map-gl/mapbox'
import { supabase } from '@/lib/supabase'
import { pinColor } from '@/lib/utils'
import type { Location } from '@/types'
import 'mapbox-gl/dist/mapbox-gl.css'
import MapPin from '@/components/map/MapPin'

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
            <MapPin type={location.type} />
          </Marker>
        ))}
      </Map>
    </div>
  )
}