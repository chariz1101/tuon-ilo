import type { LocationType } from '@/types'

interface MapPinProps {
  type: LocationType
  size?: number
}

export default function MapPin({ type, size = 58 }: MapPinProps) {
  const src = type === 'CAFE' ? '/cafe.svg' : '/studyHub.svg'

  return (
    <img
      src={src}
      alt={type === 'CAFE' ? 'Cafe' : 'Study Hub'}
      width={size}
      height={size}
      style={{ cursor: 'pointer' }}
    />
  )
}