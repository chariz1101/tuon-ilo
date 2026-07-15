'use client'
import { useEffect, useState, useMemo } from 'react'
import MapView from '@/components/map/MapView'
import LocationCard from '@/components/location/LocationCard'
import FilterBar, { type FilterState } from '@/components/map/FilterBar'
import { supabase } from '@/lib/supabase'
import type { Location } from '@/types'
import { Plus } from 'lucide-react'
import SubmitSpotModal from '@/components/location/SubmitSpotModal'
import { Analytics } from '@vercel/analytics/react'

export default function Home() {
  const [allLocations, setAllLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null
  )
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    wifi_status: null,
    charging_status: null,
    noise_level: null,
  })
  const [submitModalOpen, setSubmitModalOpen] = useState(false)

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
      if (
        filters.search &&
        !location.name.toLowerCase().includes(filters.search.toLowerCase())
      )
        return false
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
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute left-0 top-0 z-20 w-full">
        <FilterBar filters={filters} onChange={setFilters} />
      </div>

      <div className="absolute left-4 top-20 z-10 flex flex-col gap-1.5 rounded-lg bg-white/95 px-3 py-2 text-xs shadow backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: '#92400e' }}
          />
          Cafe
        </div>
        <div className="flex items-center gap-2">
          <span
            className="inline-block h-3 w-3 rounded-full"
            style={{ backgroundColor: '#7c3aed' }}
          />
          Study Hub
        </div>
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

      <MapView
        locations={filteredLocations}
        onSelectLocation={setSelectedLocation}
      />

      {selectedLocation && (
        <div className="absolute right-0 top-0 z-20 h-full w-full max-w-sm overflow-y-auto bg-white shadow-xl sm:right-4 sm:top-20 sm:h-[calc(100%-6rem)] sm:rounded-lg">
          <LocationCard
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}

      <button
        onClick={() => setSubmitModalOpen(true)}
        className="fixed bottom-6 right-6 z-20 flex items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg hover:bg-slate-800"
      >
        <Plus className="h-4 w-4" />
        Submit a Spot
      </button>

      <SubmitSpotModal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
      />
      <Analytics />
    </div>
  )
}