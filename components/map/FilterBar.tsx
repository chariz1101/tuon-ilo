'use client'

import { Button } from '@/components/ui/button'
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

const typeOptions: LocationType[] = ['CAFE', 'STUDY_HUB']
const amenityOptions: AmenityStatus[] = ['FREE', 'PAID', 'NONE']
const noiseOptions: NoiseLevel[] = ['QUIET', 'MODERATE', 'LIVELY']

export default function FilterBar({ filters, onChange }: FilterBarProps) {
  function toggle<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    // Clicking an already-active filter turns it off (toggle behavior)
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
    <div className="flex flex-wrap items-center gap-3 overflow-x-auto bg-white/95 px-4 py-3 shadow backdrop-blur-sm">
      <FilterGroup label="Type">
        {typeOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={filters.type === option ? 'default' : 'outline'}
            onClick={() => toggle('type', option)}
          >
            {option === 'CAFE' ? 'Cafe' : 'Study Hub'}
          </Button>
        ))}
      </FilterGroup>

      <FilterGroup label="Wi-Fi">
        {amenityOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={filters.wifi_status === option ? 'default' : 'outline'}
            onClick={() => toggle('wifi_status', option)}
          >
            {option}
          </Button>
        ))}
      </FilterGroup>

      <FilterGroup label="Charging">
        {amenityOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={filters.charging_status === option ? 'default' : 'outline'}
            onClick={() => toggle('charging_status', option)}
          >
            {option}
          </Button>
        ))}
      </FilterGroup>

      <FilterGroup label="Noise">
        {noiseOptions.map((option) => (
          <Button
            key={option}
            size="sm"
            variant={filters.noise_level === option ? 'default' : 'outline'}
            onClick={() => toggle('noise_level', option)}
          >
            {option}
          </Button>
        ))}
      </FilterGroup>

      {hasActiveFilters && (
        <Button size="sm" variant="ghost" onClick={clearAll}>
          Clear filters
        </Button>
      )}
    </div>
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
    <div className="flex items-center gap-1.5">
      <span className="text-xs font-medium text-slate-500">{label}:</span>
      <div className="flex gap-1.5">{children}</div>
    </div>
  )
}