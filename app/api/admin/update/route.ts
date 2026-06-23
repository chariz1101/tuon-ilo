import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/auth'
import { locationSchema } from '@/lib/validations'

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { id, ...fields } = body

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const parsed = locationSchema.safeParse(fields)
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid data' },
      { status: 400 }
    )
  }

  const values = parsed.data

  const { error } = await supabase
    .from('locations')
    .update({
      ...values,
      pricing_details: values.pricing_details || null,
      contact_info: values.contact_info || null,
      image_url: values.image_url || null,
      facebook_url: values.facebook_url || null,
      instagram_url: values.instagram_url || null,
      gmaps_url: values.gmaps_url || null,
      opening_time: values.is_24_hours ? null : values.opening_time,
      closing_time: values.is_24_hours ? null : values.closing_time,
    })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}