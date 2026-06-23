'use client'

import { useState } from 'react'
import MapView from '@/components/map/MapView'
import LocationCard from '@/components/location/LocationCard'
import type { Location } from '@/types'

export default function Home() {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )

  return (
    <div className="relative">
      <MapView onSelectLocation={setSelectedLocation} />

      {selectedLocation && (
        <div className="absolute right-0 top-0 z-20 h-full w-full max-w-sm overflow-y-auto bg-white shadow-xl sm:right-4 sm:top-4 sm:h-[calc(100%-2rem)] sm:rounded-lg">
          <LocationCard
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}
    </div>
  )
}