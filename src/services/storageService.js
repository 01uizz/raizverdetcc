import { supabase } from '@/lib/supabase'

const BUCKET = 'area-photos'

export async function uploadPhoto(file, areaId) {
  const ext = file.name.split('.').pop()
  const path = `${areaId}/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}

export async function deletePhoto(url) {
  const path = url.split(`${BUCKET}/`)[1]
  if (!path) return
  const { error } = await supabase.storage.from(BUCKET).remove([path])
  if (error) throw error
}
