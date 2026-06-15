export type LocationType = 'STUDY_HUB' | 'CAFE'
export type AmenityStatus = 'FREE' | 'PAID' | 'NONE'
export type NoiseLevel = 'QUIET' | 'MODERATE' | 'LIVELY'

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
  image_url: string | null
  facebook_url: string | null
  instagram_url: string | null
  gmaps_url: string | null
  is_24_hours: boolean
  opening_time: string | null   // stored as "HH:MM:SS"
  closing_time: string | null
  noise_level: NoiseLevel | null
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

export interface LocationWithRating extends Location {
  average_rating: number | null
  review_count: number
}