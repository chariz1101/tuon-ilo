'use client'

import { useEffect, useState, useMemo } from 'react'
import MapView from '@/components/map/MapView'
import LocationCard from '@/components/location/LocationCard'
import FilterBar, { type FilterState } from '@/components/map/FilterBar'
import { supabase } from '@/lib/supabase'
import type { Location } from '@/types'

export default function Home() {
  const [allLocations, setAllLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )
  const [filters, setFilters] = useState<FilterState>({
    type: null,
    wifi_status: null,
    charging_status: null,
    noise_level: null,
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
        setAllLocations((data ?? []) as Location[])
      }
      setLoading(false)
    }

    fetchLocations()
  }, [])

  // Recompute the filtered list only when locations or filters actually change
  const filteredLocations = useMemo(() => {
    return allLocations.filter((location) => {
      if (filters.type && location.type !== filters.type) return false
      if (filters.wifi_status && location.wifi_status !== filters.wifi_status)
        return false
      if (
        filters.charging_status &&
        location.charging_status !== filters.charging_status
      )
        return false
      if (
        filters.noise_level &&
        location.noise_level !== filters.noise_level
      )
        return false
      return true
    })
  }, [allLocations, filters])

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 z-20 w-full">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      {loading && (
        <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2 rounded-full bg-white px-4 py-2 text-sm shadow">
          Loading spots...
        </div>
      )}
      {error && (
        <div className="absolute left-1/2 top-20 z-10 -translate-x-1/2 rounded-full bg-red-50 px-4 py-2 text-sm text-red-600 shadow">
          Failed to load spots: {error}
        </div>
      )}

      <MapView locations={filteredLocations} onSelectLocation={setSelectedLocation} />

      {selectedLocation && (
        <div className="absolute right-0 top-0 z-20 h-full w-full max-w-sm overflow-y-auto bg-white shadow-xl sm:right-4 sm:top-20 sm:h-[calc(100%-6rem)] sm:rounded-lg">
          <LocationCard
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}
    </div>
  )
}