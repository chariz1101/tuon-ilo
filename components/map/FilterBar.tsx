'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Search, Wifi, BatteryCharging, Volume1, Volume2, X, SlidersHorizontal } from 'lucide-react'
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
  open: boolean
  onClose: () => void
}

export default function FilterBar({
  filters,
  onChange,
  locations,
  onSelectLocation,
  open,
  onClose,
}: FilterBarProps) {
  const [searchFocused, setSearchFocused] = useState(false)

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

  const activeCount = Object.entries(filters).filter(
    ([k, v]) => k !== 'search' && v !== null
  ).length
  const hasActiveFilters = filters.search !== '' || activeCount > 0

  return (
    <>
      {/* Backdrop, mobile */}
      {open && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-30 bg-black/30 sm:hidden"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex h-full w-72 shrink-0 flex-col border-r border-slate-200 bg-white transition-transform duration-200 ease-out sm:static sm:z-0 sm:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-4">
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="Logo" className="h-7 w-auto" />
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:hidden"
            aria-label="Close filters"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search */}
        <div className="border-b border-slate-100 px-4 py-3">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={filters.search}
              onChange={(e) => onChange({ ...filters, search: e.target.value })}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 150)}
              placeholder="Search spots"
              className="h-9 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-8 text-sm outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white"
            />
            {filters.search && (
              <button
                onMouseDown={() => onChange({ ...filters, search: '' })}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-slate-400 hover:bg-slate-200 hover:text-slate-600"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}

            {showDropdown && (
              <div className="absolute left-0 top-11 z-30 w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg">
                {visibleMatches.length > 0 ? (
                  <div className="max-h-72 overflow-y-auto">
                    {visibleMatches.map((loc) => (
                      <button
                        key={loc.id}
                        onMouseDown={() => {
                          onSelectLocation(loc)
                          onChange({ ...filters, search: loc.name })
                          setSearchFocused(false)
                          onClose()
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
                    ))}
                  </div>
                ) : (
                  <div className="px-3 py-3 text-sm text-slate-400">
                    No spots match &quot;{filters.search}&quot;
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex-1 overflow-y-auto px-4 py-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-slate-400">
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Filters
            </div>
            {activeCount > 0 && (
              <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-700">
                {activeCount} active
              </span>
            )}
          </div>

          <FilterGroup label="Amenities">
            <FilterRow
              active={filters.wifi_status === 'FREE'}
              onClick={() => toggle('wifi_status', 'FREE')}
              icon={<Wifi className="h-4 w-4" />}
              label="Free Wi-Fi"
            />
            <FilterRow
              active={filters.charging_status === 'FREE'}
              onClick={() => toggle('charging_status', 'FREE')}
              icon={<BatteryCharging className="h-4 w-4" />}
              label="Free Charging"
            />
          </FilterGroup>

          <FilterGroup label="Atmosphere">
            <FilterRow
              active={filters.noise_level === 'QUIET'}
              onClick={() => toggle('noise_level', 'QUIET')}
              icon={<Volume1 className="h-4 w-4" />}
              label="Quiet"
            />
            <FilterRow
              active={filters.noise_level === 'MODERATE'}
              onClick={() => toggle('noise_level', 'MODERATE')}
              icon={<Volume1 className="h-4 w-4" />}
              label="Moderate"
            />
            <FilterRow
              active={filters.noise_level === 'LIVELY'}
              onClick={() => toggle('noise_level', 'LIVELY')}
              icon={<Volume2 className="h-4 w-4" />}
              label="Lively"
            />
          </FilterGroup>

          <div className="mt-2 text-xs text-slate-400">
            {matches.length} of {locations.length} spots match
          </div>
        </div>

        {/* Footer */}
        {hasActiveFilters && (
          <div className="border-t border-slate-100 px-4 py-3">
            <Button
              size="sm"
              variant="ghost"
              onClick={clearAll}
              className="w-full justify-center rounded-lg text-slate-500 hover:bg-slate-100"
            >
              <X className="mr-1.5 h-4 w-4" />
              Clear all filters
            </Button>
          </div>
        )}
      </aside>
    </>
  )
}

function FilterGroup({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="mb-5">
      <div className="mb-2 text-xs font-medium text-slate-400">{label}</div>
      <div className="flex flex-col gap-1">{children}</div>
    </div>
  )
}

function FilterRow({
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
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-700 hover:bg-slate-100'
      }`}
    >
      <span className={active ? 'text-white' : 'text-slate-400'}>{icon}</span>
      {label}
      {active && (
        <span className="ml-auto flex h-4 w-4 items-center justify-center rounded-full bg-white/20 text-[10px]">
          ✓
        </span>
      )}
    </button>
  )
}