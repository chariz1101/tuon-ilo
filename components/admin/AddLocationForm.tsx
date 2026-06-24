'use client'

import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { locationSchema, type LocationFormValues } from '@/lib/validations'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import type { Location } from '@/types'
import LocationPicker from '@/components/admin/LocationPicker'

interface AddLocationFormProps {
  // If provided, the form runs in "edit" mode instead of "add" mode
  existingLocation?: Location
  isPublicSubmission?: boolean
  onPublicSubmitSuccess?: () => void
}

export default function AddLocationForm({
  existingLocation,
  isPublicSubmission = false,
  onPublicSubmitSuccess,
}: AddLocationFormProps) {
  const isEditMode = !!existingLocation
  const router = useRouter()

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<LocationFormValues>({
    resolver: zodResolver(locationSchema),
    defaultValues: existingLocation
      ? {
          name: existingLocation.name,
          type: existingLocation.type,
          latitude: existingLocation.latitude,
          longitude: existingLocation.longitude,
          wifi_status: existingLocation.wifi_status,
          charging_status: existingLocation.charging_status,
          pricing_details: existingLocation.pricing_details ?? '',
          contact_info: existingLocation.contact_info ?? '',
          image_url: existingLocation.image_url ?? '',
          facebook_url: existingLocation.facebook_url ?? '',
          instagram_url: existingLocation.instagram_url ?? '',
          gmaps_url: existingLocation.gmaps_url ?? '',
          noise_level: existingLocation.noise_level ?? undefined,
          is_24_hours: existingLocation.is_24_hours,
          opening_time: existingLocation.opening_time ?? '',
          closing_time: existingLocation.closing_time ?? '',
        }
      : {
          type: 'CAFE',
          wifi_status: 'FREE',
          charging_status: 'FREE',
          is_24_hours: false,
        },
  })

  const is24Hours = watch('is_24_hours')

  async function onSubmit(values: LocationFormValues) {
    setSubmitting(true)
    setSubmitError('')

    if (isEditMode) {
      const res = await fetch('/api/admin/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: existingLocation.id, ...values }),
      })

      setSubmitting(false)

      if (!res.ok) {
        const body = await res.json()
        setSubmitError(body.error ?? 'Something went wrong')
        return
      }

      router.push('/admin/dashboard/manage')
      router.refresh()
      return
    }

    if (isPublicSubmission) {
    const { error } = await supabase.from('locations').insert({
      ...values,
      is_approved: false,
      pricing_details: values.pricing_details || null,
      contact_info: values.contact_info || null,
      image_url: values.image_url || null,
      facebook_url: values.facebook_url || null,
      instagram_url: values.instagram_url || null,
      gmaps_url: values.gmaps_url || null,
      opening_time: values.is_24_hours ? null : values.opening_time,
      closing_time: values.is_24_hours ? null : values.closing_time,
    })

    setSubmitting(false)

    if (error) {
      setSubmitError(error.message)
      return
    }
    
    onPublicSubmitSuccess?.()
    return
  }
}

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-xl">
      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input id="name" {...register('name')} placeholder="Kape Tambayan" />
        {errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>

      {/* Type */}
      <div className="space-y-2">
        <Label>Type</Label>
        <Controller
          name="type"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CAFE">Cafe</SelectItem>
                <SelectItem value="STUDY_HUB">Study Hub</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Location Picker */}
      <div className="space-y-2">
        <Label>Location</Label>
        <Controller
          name="latitude"
          control={control}
          render={({ field: latField }) => (
            <Controller
              name="longitude"
              control={control}
              render={({ field: lngField }) => (
                <LocationPicker
                  latitude={latField.value}
                  longitude={lngField.value}
                  onChange={(lat, lng) => {
                    latField.onChange(lat)
                    lngField.onChange(lng)
                  }}
                />
              )}
            />
          )}
        />
        <div className="flex gap-4 text-xs text-slate-500">
          <span>Lat: {watch('latitude')?.toFixed(6) ?? '—'}</span>
          <span>Lng: {watch('longitude')?.toFixed(6) ?? '—'}</span>
        </div>
        {(errors.latitude || errors.longitude) && (
          <p className="text-sm text-red-600">Please select a location on the map.</p>
        )}
      </div>

      {/* Wi-Fi / Charging */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Wi-Fi Status</Label>
          <Controller
            name="wifi_status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="NONE">None</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        <div className="space-y-2">
          <Label>Charging Status</Label>
          <Controller
            name="charging_status"
            control={control}
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="FREE">Free</SelectItem>
                  <SelectItem value="PAID">Paid</SelectItem>
                  <SelectItem value="NONE">None</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>

      {/* Noise Level */}
      <div className="space-y-2">
        <Label>Noise Level</Label>
        <Controller
          name="noise_level"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select noise level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="QUIET">Quiet</SelectItem>
                <SelectItem value="MODERATE">Moderate</SelectItem>
                <SelectItem value="LIVELY">Lively</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </div>

      {/* Pricing / Contact */}
      <div className="space-y-2">
        <Label htmlFor="pricing_details">Pricing Details</Label>
        <Input
          id="pricing_details"
          {...register('pricing_details')}
          placeholder="₱50/hr or Must buy a drink"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact_info">Contact Info</Label>
        <Input
          id="contact_info"
          {...register('contact_info')}
          placeholder="Phone number or contact person"
        />
      </div>

      {/* Links */}
      <div className="space-y-2">
        <Label htmlFor="image_url">Image URL</Label>
        <Input id="image_url" {...register('image_url')} placeholder="https://..." />
        {errors.image_url && (
          <p className="text-sm text-red-600">{errors.image_url.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="facebook_url">Facebook URL</Label>
        <Input id="facebook_url" {...register('facebook_url')} placeholder="https://facebook.com/..." />
        {errors.facebook_url && (
          <p className="text-sm text-red-600">{errors.facebook_url.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="instagram_url">Instagram URL</Label>
        <Input id="instagram_url" {...register('instagram_url')} placeholder="https://instagram.com/..." />
        {errors.instagram_url && (
          <p className="text-sm text-red-600">{errors.instagram_url.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="gmaps_url">Google Maps URL</Label>
        <Input id="gmaps_url" {...register('gmaps_url')} placeholder="https://maps.google.com/..." />
        {errors.gmaps_url && (
          <p className="text-sm text-red-600">{errors.gmaps_url.message}</p>
        )}
      </div>

      {/* 24 Hours toggle */}
      <div className="flex items-center justify-between rounded-lg border p-4">
        <div>
          <Label htmlFor="is_24_hours">Open 24 Hours</Label>
          <p className="text-sm text-slate-500">
            Toggle on if this location never closes.
          </p>
        </div>
        <Controller
          name="is_24_hours"
          control={control}
          render={({ field }) => (
            <Switch
              id="is_24_hours"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
      </div>

      {/* Opening / Closing time — hidden if 24 hours */}
      {!is24Hours && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="opening_time">Opening Time</Label>
            <Input id="opening_time" type="time" {...register('opening_time')} />
            {errors.opening_time && (
              <p className="text-sm text-red-600">{errors.opening_time.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="closing_time">Closing Time</Label>
            <Input id="closing_time" type="time" {...register('closing_time')} />
            {errors.closing_time && (
              <p className="text-sm text-red-600">{errors.closing_time.message}</p>
            )}
          </div>
        </div>
      )}

      {submitError && <p className="text-sm text-red-600">{submitError}</p>}
      {success && (
        <p className="text-sm text-green-600">Spot added successfully!</p>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
  {submitting
    ? isEditMode
      ? 'Saving...'
      : 'Adding...'
    : isEditMode
    ? 'Save Changes'
    : isPublicSubmission
    ? 'Submit for Review'
    : 'Add Spot'}
</Button>
    </form>
  )
}