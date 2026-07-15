'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Wifi, BatteryCharging, Volume1, Volume2, X } from 'lucide-react'
import type { AmenityStatus, NoiseLevel, Location } from '@/types'
export interface FilterState {
  search: string
  wifi_status: AmenityStatus | null
  charging_status: AmenityStatus | null
  noise_level: NoiseLevel | null
}
interface FilterBarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  locations: Location[]
  onSelectLocation: (location: Location) => void
}
export default function FilterBar({
  filters,
  onChange,
  locations,
  onSelectLocation,
}: FilterBarProps) {
  const [searchFocused, setSearchFocused] = useState(false)
  // Empty search -> show everything (capped). Typing narrows it.
  const matches =
    filters.search.trim().length > 0
      ? locations.filter((l) =>
          l.name.toLowerCase().includes(filters.search.toLowerCase())
        )
      : locations
  const visibleMatches = matches.slice(0, 8)
  const showDropdown = searchFocused && locations.length > 0
  function toggle<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    const isActive = filters[key] === value
    onChange({ ...filters, [key]: isActive ? null : value })
  }
  function clearAll() {
    onChange({
      search: '',
      wifi_status: null,
      charging_status: null,
      noise_level: null,
    })
  }
  const hasActiveFilters =
    filters.search !== '' ||
    Object.entries(filters).some(([k, v]) => k !== 'search' && v !== null)
  return (
    // The wrapper creates a seamless, map-like floating container
    <div className="w-full bg-transparent p-4">
      {/* no-scrollbar hides the scrollbar but keeps it swipeable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 drop-shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Search */}
        <div className="relative shrink-0">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onChange({ ...filters, search: e.target.value })}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
            placeholder="Search spots..."
            className="h-9 w-48 rounded-full border border-slate-200 bg-white pl-9 pr-3 text-sm shadow-sm outline-none placeholder:text-slate-400 focus:border-slate-400"
          />
          {showDropdown && (
            <div className="absolute left-0 top-11 z-30 w-64 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
              {visibleMatches.length > 0 ? (
                visibleMatches.map((loc) => (
                  <button
                    key={loc.id}
                    onMouseDown={() => {
                      onSelectLocation(loc)
                      onChange({ ...filters, search: loc.name })
                      setSearchFocused(false)
                    }}
                    className="flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-slate-50"
                  >
                    <span className="text-sm font-medium text-slate-800">
                      {loc.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {loc.type === 'CAFE' ? 'Cafe' : 'Study Hub'}
                    </span>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-slate-400">
                  No spots match &quot;{filters.search}&quot;
                </div>
              )}
            </div>
          )}
        </div>
        {/* Divider */}
        <div className="mx-1 h-6 w-px shrink-0 bg-slate-300" />
        {/* Amenity Filters - Simplified to target the most desired states */}
        <FilterPill
          active={filters.wifi_status === 'FREE'}
          onClick={() => toggle('wifi_status', 'FREE')}
          icon={<Wifi className="h-4 w-4" />}
          label="Free Wi-Fi"
        />
        <FilterPill
          active={filters.charging_status === 'FREE'}
          onClick={() => toggle('charging_status', 'FREE')}
          icon={<BatteryCharging className="h-4 w-4" />}
          label="Free Charging"
        />
        {/* Divider */}
        <div className="mx-1 h-6 w-px shrink-0 bg-slate-300" />
        {/* Noise Filters - all three levels, so Moderate isn't a dead zone between pills */}
        <FilterPill
          active={filters.noise_level === 'QUIET'}
          onClick={() => toggle('noise_level', 'QUIET')}
          icon={<Volume1 className="h-4 w-4" />}
          label="Quiet"
        />
        <FilterPill
          active={filters.noise_level === 'MODERATE'}
          onClick={() => toggle('noise_level', 'MODERATE')}
          icon={<Volume1 className="h-4 w-4" />}
          label="Moderate"
        />
        <FilterPill
          active={filters.noise_level === 'LIVELY'}
          onClick={() => toggle('noise_level', 'LIVELY')}
          icon={<Volume2 className="h-4 w-4" />}
          label="Lively"
        />
        {/* Clear Button */}
        {hasActiveFilters && (
          <Button
            size="sm"
            variant="ghost"
            onClick={clearAll}
            className="shrink-0 rounded-full text-slate-500 hover:bg-slate-200"
          >
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
// Sub-component for the Maps-style Pill
function FilterPill({
  active,
  onClick,
  icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  label: string
}) {
  return (
    <Button
      size="sm"
      variant={active ? 'default' : 'secondary'}
      onClick={onClick}
      className={`shrink-0 rounded-full transition-all ${
        active
          ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md' // Maps active state color
          : 'bg-white text-slate-700 shadow-sm hover:bg-slate-100 border border-slate-200'
      }`}
    >
      <span className="mr-1.5">{icon}</span>
      {label}
    </Button>
  )
}