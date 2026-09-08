'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  X,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Search,
} from 'lucide-react'
import SpotSearch from '@/components/map/SpotSearch'
import FilterControls, { FilterRail } from '@/components/map/FilterControls'
import { EMPTY_FILTERS, countActiveFilters, type FilterState } from '@/types'
import type { Location } from '@/types'

export type { FilterState }

interface FilterBarProps {
  filters: FilterState
  onChange: (filters: FilterState) => void
  locations: Location[]
  matchCount: number
  onSelectLocation: (location: Location) => void
  collapsed: boolean
  onToggleCollapse: () => void
}

/**
 * Renders two layouts from one source of truth:
 * - md and up: a collapsible sidebar next to the map.
 * - below md: a floating search pill over the map plus a filter bottom sheet,
 *   so the map keeps the full width of a phone screen.
 */
export default function FilterBar({
  filters,
  onChange,
  locations,
  matchCount,
  onSelectLocation,
  collapsed,
  onToggleCollapse,
}: FilterBarProps) {
  const [sheetOpen, setSheetOpen] = useState(false)

  const activeCount = countActiveFilters(filters)
  const hasActiveFilters = filters.search !== '' || activeCount > 0

  function clearAll() {
    onChange(EMPTY_FILTERS)
  }

  function expandThenSearch() {
    if (collapsed) onToggleCollapse()
  }

  return (
    <>
      {/* ---------- Desktop sidebar ---------- */}
      <aside
        className={`relative hidden h-full shrink-0 flex-col border-r border-slate-200 bg-white transition-[width] duration-200 md:flex ${
          collapsed ? 'w-16' : 'w-72 lg:w-80'
        }`}
      >
        <div
          className={`flex items-center border-b border-slate-100 py-4 ${
            collapsed ? 'justify-center px-2' : 'justify-between px-4'
          }`}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={collapsed ? '/logo-small.svg' : '/logo.svg'}
            alt="Tuon.ILO"
            className="h-7 w-auto"
          />
          {!collapsed && (
            <button
              onClick={onToggleCollapse}
              className="rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          )}
        </div>

        {collapsed && (
          <button
            onClick={onToggleCollapse}
            className="mx-auto mt-2 flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        )}

        {collapsed ? (
          <div className="flex justify-center border-b border-slate-100 py-3">
            <button
              onClick={expandThenSearch}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
              aria-label="Search spots"
              title="Search spots"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="border-b border-slate-100 px-4 py-3">
            <SpotSearch
              value={filters.search}
              onValueChange={(search) => onChange({ ...filters, search })}
              locations={locations}
              onSelectLocation={onSelectLocation}
            />
          </div>
        )}

        <div
          className={`flex-1 overflow-y-auto ${collapsed ? 'px-2 py-3' : 'px-4 py-4'}`}
        >
          {collapsed ? (
            <FilterRail filters={filters} onChange={onChange} />
          ) : (
            <>
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

              <FilterControls filters={filters} onChange={onChange} />

              <p className="mt-4 text-xs text-slate-400">
                {matchCount} of {locations.length} spots match
              </p>
            </>
          )}
        </div>

        {hasActiveFilters &&
          (collapsed ? (
            <div className="flex justify-center border-t border-slate-100 py-3">
              <button
                onClick={clearAll}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Clear all filters"
                title="Clear all filters"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
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
          ))}
      </aside>

      {/* ---------- Mobile top bar ---------- */}
      <div className="pointer-events-none fixed inset-x-0 top-0 z-30 md:hidden">
        <div className="pointer-events-auto flex items-start gap-2 px-3 pb-3 pt-[calc(0.75rem+env(safe-area-inset-top))]">
          <div className="flex min-w-0 flex-1 items-center gap-2 rounded-full bg-white py-1 pl-3 pr-1 shadow-lg ring-1 ring-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/logo-small.svg"
              alt="Tuon.ILO"
              className="h-6 w-6 shrink-0"
            />
            <SpotSearch
              value={filters.search}
              onValueChange={(search) => onChange({ ...filters, search })}
              locations={locations}
              onSelectLocation={onSelectLocation}
              className="min-w-0 flex-1"
              inputClassName="h-10 rounded-full border-0 bg-transparent pl-9 focus:bg-transparent"
            />
          </div>

          <button
            onClick={() => setSheetOpen(true)}
            className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-slate-600 shadow-lg ring-1 ring-black/5 active:bg-slate-50"
            aria-label={`Filters${activeCount > 0 ? `, ${activeCount} active` : ''}`}
          >
            <SlidersHorizontal className="h-5 w-5" />
            {activeCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-[11px] font-semibold text-white">
                {activeCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* ---------- Mobile filter sheet ---------- */}
      {sheetOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-900/40 animate-in fade-in duration-150"
            onClick={() => setSheetOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Filters"
            className="absolute inset-x-0 bottom-0 flex max-h-[85dvh] flex-col rounded-t-2xl bg-white shadow-2xl animate-in slide-in-from-bottom duration-200"
          >
            <div className="shrink-0 px-4 pt-3">
              <div className="mx-auto h-1.5 w-10 rounded-full bg-slate-200" />
              <div className="mt-3 flex items-center justify-between">
                <h2 className="text-base font-semibold">Filters</h2>
                <button
                  onClick={() => setSheetOpen(false)}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100"
                  aria-label="Close filters"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 py-4">
              <FilterControls filters={filters} onChange={onChange} />
            </div>

            <div className="shrink-0 border-t border-slate-100 px-4 py-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]">
              <div className="flex items-center gap-3">
                <p className="flex-1 text-xs text-slate-400">
                  {matchCount} of {locations.length} spots match
                </p>
                {hasActiveFilters && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={clearAll}
                    className="text-slate-500"
                  >
                    <X className="mr-1.5 h-4 w-4" />
                    Clear all
                  </Button>
                )}
                <Button size="sm" onClick={() => setSheetOpen(false)}>
                  Show {matchCount}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
