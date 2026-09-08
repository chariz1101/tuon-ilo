'use client'
import { useEffect, useState, useMemo } from 'react'
import MapView from '@/components/map/MapView'
import LocationCard from '@/components/location/LocationCard'
import FilterBar from '@/components/map/FilterBar'
import { supabase } from '@/lib/supabase'
import { EMPTY_FILTERS, type FilterState, type Location } from '@/types'
import { Plus } from 'lucide-react'
import SubmitSpotModal from '@/components/location/SubmitSpotModal'
import { Analytics } from '@vercel/analytics/react'

export default function Home() {
  const [allLocations, setAllLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null)
  const [collapsed, setCollapsed] = useState(false)
  const [filters, setFilters] = useState<FilterState>(EMPTY_FILTERS)
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
      if (filters.noise_level && location.noise_level !== filters.noise_level)
        return false
      return true
    })
  }, [allLocations, filters])

  return (
    <div className="relative flex h-dvh w-full overflow-hidden">
      <FilterBar
        filters={filters}
        onChange={setFilters}
        locations={allLocations}
        matchCount={filteredLocations.length}
        onSelectLocation={setSelectedLocation}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((v) => !v)}
      />

      <div className="relative h-full min-w-0 flex-1 overflow-hidden">
        {(loading || error) && (
          <div className="pointer-events-none absolute inset-x-0 top-20 z-20 flex justify-center px-4 md:top-4">
            {loading && (
              <p className="rounded-full bg-white px-4 py-2 text-sm shadow-md">
                Loading spots...
              </p>
            )}
            {error && (
              <p className="max-w-full truncate rounded-full bg-red-50 px-4 py-2 text-sm text-red-600 shadow-md">
                Failed to load spots: {error}
              </p>
            )}
          </div>
        )}

        <MapView
          locations={filteredLocations}
          onSelectLocation={setSelectedLocation}
        />

        <button
          onClick={() => setSubmitModalOpen(true)}
          className={`fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-4 z-30 items-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg transition-colors hover:bg-slate-800 md:absolute md:bottom-6 md:right-6 ${
            selectedLocation ? 'hidden xl:inline-flex' : 'inline-flex'
          }`}
        >
          <Plus className="h-4 w-4" />
          Submit a Spot
        </button>
      </div>

      {selectedLocation && (
        // Three treatments, so the map always keeps usable width:
        // phone — bottom sheet; tablet — floating panel over the map;
        // xl and up — a docked third column beside the map.
        <div className="fixed inset-x-0 bottom-0 z-40 flex max-h-[85dvh] flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-200 md:absolute md:inset-x-auto md:bottom-4 md:right-4 md:top-4 md:z-20 md:max-h-none md:w-80 md:rounded-xl md:animate-none lg:w-[22rem] xl:static xl:z-auto xl:h-full xl:w-96 xl:shrink-0 xl:rounded-none xl:border-l xl:border-slate-200 xl:shadow-none">
          <LocationCard
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        </div>
      )}

      <SubmitSpotModal
        open={submitModalOpen}
        onClose={() => setSubmitModalOpen(false)}
      />
      <Analytics />
    </div>
  )
}
