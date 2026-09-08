'use client'

import { Wifi, BatteryCharging, Volume1, Volume2 } from 'lucide-react'
import type { FilterState } from '@/types'

interface FilterControlsProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
}

/**
 * The amenity / atmosphere toggles. Shared by the desktop sidebar and the
 * mobile filter sheet so both stay in sync.
 */
export default function FilterControls({ filters, onChange }: FilterControlsProps) {
  function toggle<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: filters[key] === value ? null : value })
  }

  return (
    <>
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
    </>
  )
}

/** Icon-only version for the collapsed desktop rail. */
export function FilterRail({ filters, onChange }: FilterControlsProps) {
  function toggle<K extends keyof FilterState>(key: K, value: FilterState[K]) {
    onChange({ ...filters, [key]: filters[key] === value ? null : value })
  }

  return (
    <div className="flex flex-col items-center gap-1.5">
      <RailButton
        active={filters.wifi_status === 'FREE'}
        onClick={() => toggle('wifi_status', 'FREE')}
        icon={<Wifi className="h-4 w-4" />}
        label="Free Wi-Fi"
      />
      <RailButton
        active={filters.charging_status === 'FREE'}
        onClick={() => toggle('charging_status', 'FREE')}
        icon={<BatteryCharging className="h-4 w-4" />}
        label="Free Charging"
      />
      <div className="my-1 h-px w-8 bg-slate-100" />
      <RailButton
        active={filters.noise_level === 'QUIET'}
        onClick={() => toggle('noise_level', 'QUIET')}
        icon={<Volume1 className="h-4 w-4" />}
        label="Quiet"
      />
      <RailButton
        active={filters.noise_level === 'MODERATE'}
        onClick={() => toggle('noise_level', 'MODERATE')}
        icon={<Volume1 className="h-4 w-4" />}
        label="Moderate"
      />
      <RailButton
        active={filters.noise_level === 'LIVELY'}
        onClick={() => toggle('noise_level', 'LIVELY')}
        icon={<Volume2 className="h-4 w-4" />}
        label="Lively"
      />
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
    <div className="mb-5 last:mb-0">
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
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-left text-sm transition-colors sm:py-2 ${
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

function RailButton({
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
      type="button"
      onClick={onClick}
      title={label}
      aria-label={label}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors ${
        active
          ? 'bg-blue-600 text-white shadow-sm'
          : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'
      }`}
    >
      {icon}
    </button>
  )
}
