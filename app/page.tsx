'use client'

import { useState } from 'react'
import MapView from '@/components/map/MapView'
import LocationCard from '@/components/location/LocationCard'
import FilterBar, { type FilterState } from '@/components/map/FilterBar'
import type { Location } from '@/types'

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )
  const [filters, setFilters] = useState<FilterState>({
    type: null,
    wifi_status: null,
    charging_status: null,
    noise_level: null,
  })

  return (
    <div className="relative">
      <div className="absolute left-0 top-0 z-20 w-full">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      <MapView onSelectLocation={setSelectedLocation} filters={filters} />

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