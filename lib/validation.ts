import { z } from 'zod'

// Reusable enums matching the database
export const locationTypeEnum = z.enum(['STUDY_HUB', 'CAFE'])
export const amenityStatusEnum = z.enum(['FREE', 'PAID', 'NONE'])
export const noiseLevelEnum = z.enum(['QUIET', 'MODERATE', 'LIVELY'])

// Time string in HH:MM format (24-hour)
const timeStringSchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Use HH:MM format, e.g. 08:00')

export const locationSchema = z
  .object({
    name: z
      .string()
      .min(2, 'Name must be at least 2 characters')
      .max(100, 'Name is too long'),

    type: locationTypeEnum,

    latitude: z
      .number()
      .min(-90, 'Invalid latitude')
      .max(90, 'Invalid latitude'),

    longitude: z
      .number()
      .min(-180, 'Invalid longitude')
      .max(180, 'Invalid longitude'),

    wifi_status: amenityStatusEnum,
    charging_status: amenityStatusEnum,

    pricing_details: z.string().max(200).optional().or(z.literal('')),
    contact_info: z.string().max(200).optional().or(z.literal('')),

    image_url: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),
    facebook_url: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),
    instagram_url: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),
    gmaps_url: z
      .string()
      .url('Must be a valid URL')
      .optional()
      .or(z.literal('')),

    noise_level: noiseLevelEnum.optional(),

    is_24_hours: z.boolean().default(false),
    opening_time: timeStringSchema.optional().or(z.literal('')),
    closing_time: timeStringSchema.optional().or(z.literal('')),
  })
  // Cross-field rule: if not 24 hours, opening and closing time are required
  .refine(
    (data) =>
      data.is_24_hours ||
      (data.opening_time && data.opening_time.length > 0),
    {
      message: 'Opening time is required unless the spot is open 24 hours',
      path: ['opening_time'],
    }
  )
  .refine(
    (data) =>
      data.is_24_hours ||
      (data.closing_time && data.closing_time.length > 0),
    {
      message: 'Closing time is required unless the spot is open 24 hours',
      path: ['closing_time'],
    }
  )

export type LocationFormValues = z.infer<typeof locationSchema>

export const reviewSchema = z.object({
  location_id: z.string().uuid('Invalid location'),
  rating: z
    .number()
    .int('Rating must be a whole number')
    .min(1, 'Rating must be at least 1')
    .max(5, 'Rating cannot exceed 5'),
  comment: z.string().max(500, 'Comment is too long').optional().or(z.literal('')),
  session_id: z.string().min(1, 'Missing session ID'),
})

export type ReviewFormValues = z.infer<typeof reviewSchema>