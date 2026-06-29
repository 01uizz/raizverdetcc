import { supabase } from '@/lib/supabase'

export async function getUpdatesByArea(areaId) {
  const { data, error } = await supabase
    .from('area_updates')
    .select('*')
    .eq('area_id', areaId)
    .order('data', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getAllUpdates() {
  const { data, error } = await supabase
    .from('area_updates')
    .select('*, areas(nome)')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createUpdate(update) {
  const { data, error } = await supabase
    .from('area_updates')
    .insert(update)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteUpdate(id) {
  const { error } = await supabase.from('area_updates').delete().eq('id', id)
  if (error) throw error
}
