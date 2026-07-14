'use client'

import { Button } from '@/components/ui/button'
import { Coffee, BookOpen, Wifi, BatteryCharging, Volume1, Volume2, X } from 'lucide-react'
import type { LocationType, AmenityStatus, NoiseLevel } from '@/types'

export interface FilterState {
  type: LocationType | null
  wifi_status: AmenityStatus | null
  charging_status: AmenityStatus | null
  noise_level: NoiseLevel | null
}

interface FilterBarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  function toggle<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    const isActive = filters[key] === value
    onChange({ ...filters, [key]: isActive ? null : value })
  }

  function clearAll() {
    onChange({
      type: null,
      wifi_status: null,
      charging_status: null,
      noise_level: null,
    })
  }

  const hasActiveFilters = Object.values(filters).some((v) => v !== null)

  return (
    // The wrapper creates a seamless, map-like floating container
    <div className="w-full bg-transparent p-4">
      {/* no-scrollbar hides the scrollbar but keeps it swipeable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 drop-shadow-sm [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Type Filters */}
        <FilterPill
          active={filters.type === 'CAFE'}
          onClick={() => toggle('type', 'CAFE')}
          icon={<Coffee className="h-4 w-4" />}
          label="Cafe"
        />
        <FilterPill
          active={filters.type === 'STUDY_HUB'}
          onClick={() => toggle('type', 'STUDY_HUB')}
          icon={<BookOpen className="h-4 w-4" />}
          label="Study Hub"
        />

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