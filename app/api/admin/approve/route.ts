import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { isAdminRequest } from '@/lib/auth'

export async function POST(request: NextRequest) {
  if (!isAdminRequest(request)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { id } = await request.json()

  if (!id) {
    return NextResponse.json({ error: 'Missing id' }, { status: 400 })
  }

  const { error } = await supabase
    .from('locations')
    .update({ is_approved: true })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true }, { status: 200 })
}