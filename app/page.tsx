import { supabase } from '@/lib/supabase'

export default async function Home() {
  const { data, error } = await supabase
    .from('locations')
    .select('*')
    .limit(3)

  console.log('data:', data)
  console.log('error:', error)

  return (
    <main>
      <h1>Tuon.ILO</h1>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </main>
  )
}