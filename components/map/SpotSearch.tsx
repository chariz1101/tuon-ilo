'use client'

import { useEffect, useRef, useState } from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Location } from '@/types'

interface SpotSearchProps {
  value: string
  onValueChange: (value: string) => void
  locations: Location[]
  onSelectLocation: (location: Location) => void
  /** Focus the input as soon as it mounts — used when the mobile search opens. */
  autoFocus?: boolean
  className?: string
  inputClassName?: string
}

export default function SpotSearch({
  value,
  onValueChange,
  locations,
  onSelectLocation,
  autoFocus = false,
  className,
  inputClassName,
}: SpotSearchProps) {
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  const query = value.trim().toLowerCase()
  const matches = query
    ? locations.filter((l) => l.name.toLowerCase().includes(query))
    : locations
  const visibleMatches = matches.slice(0, 8)
  const showDropdown = focused && locations.length > 0

  return (
    <div className={cn('relative', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={(e) => onValueChange(e.target.value)}
        onFocus={() => setFocused(true)}
        // Delayed so a click on a result still registers before the list unmounts
        onBlur={() => setTimeout(() => setFocused(false), 150)}
        placeholder="Search spots"
        aria-label="Search spots"
        className={cn(
          'h-10 w-full rounded-lg border border-slate-200 bg-slate-50 pl-9 pr-9 text-base outline-none placeholder:text-slate-400 focus:border-slate-400 focus:bg-white sm:text-sm',
          inputClassName
        )}
      />
      {value && (
        <button
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            onValueChange('')
          }}
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 hover:bg-slate-200 hover:text-slate-600"
          aria-label="Clear search"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      {showDropdown && (
        <div className="absolute inset-x-0 top-[calc(100%+0.5rem)] z-40 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {visibleMatches.length > 0 ? (
            <ul className="max-h-[min(60vh,18rem)] overflow-y-auto overscroll-contain">
              {visibleMatches.map((loc) => (
                <li key={loc.id}>
                  <button
                    type="button"
                    onMouseDown={() => {
                      onSelectLocation(loc)
                      onValueChange(loc.name)
                      setFocused(false)
                    }}
                    className="flex w-full flex-col items-start gap-0.5 px-3 py-2.5 text-left hover:bg-slate-50 active:bg-slate-100"
                  >
                    <span className="w-full truncate text-sm font-medium text-slate-800">
                      {loc.name}
                    </span>
                    <span className="text-xs text-slate-400">
                      {loc.type === 'CAFE' ? 'Cafe' : 'Study Hub'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-3 py-3 text-sm text-slate-400">
              No spots match &quot;{value}&quot;
            </p>
          )}
        </div>
      )}
    </div>
  )
}
