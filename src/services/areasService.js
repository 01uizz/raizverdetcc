import { supabase } from '@/lib/supabase'

export async function getAreas() {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .order('created_at', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function getAreaById(id) {
  const { data, error } = await supabase
    .from('areas')
    .select('*')
    .eq('id', id)
    .single()
  if (error) throw error
  return data
}

export async function createArea(area) {
  const { data, error } = await supabase
    .from('areas')
    .insert(area)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateArea(id, area) {
  const { data, error } = await supabase
    .from('areas')
    .update({ ...area, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteArea(id) {
  const { error } = await supabase.from('areas').delete().eq('id', id)
  if (error) throw error
}
