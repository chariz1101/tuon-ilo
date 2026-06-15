export type LocationType = 'STUDY_HUB' | 'CAFE'
export type AmenityStatus = 'FREE' | 'PAID' | 'NONE'

export interface Location {
  id: string
  name: string
  type: LocationType
  latitude: number
  longitude: number
  wifi_status: AmenityStatus
  charging_status: AmenityStatus
  pricing_details: string | null
  contact_info: string | null
  is_approved: boolean
  created_at: string
}

export interface Review {
  id: string
  location_id: string
  rating: number
  comment: string | null
  session_id: string
  created_at: string
}

// Used when displaying a location card — includes the computed average
export interface LocationWithRating extends Location {
  average_rating: number | null
  review_count: number
}