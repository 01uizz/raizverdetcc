import { supabase } from '@/lib/supabase'

/**
 * Relatórios de transparência por projeto/área (PDFs, links, marcos).
 * Tabela: area_reports (ver supabase/schema.sql).
 */
export async function getReportsByArea(areaId) {
  const { data, error } = await supabase
    .from('area_reports')
    .select('*')
    .eq('area_id', areaId)
    .order('data', { ascending: false })
  if (error) throw error
  return data ?? []
}

export async function createReport(report) {
  const { data, error } = await supabase.from('area_reports').insert(report).select().single()
  if (error) throw error
  return data
}

export async function deleteReport(id) {
  const { error } = await supabase.from('area_reports').delete().eq('id', id)
  if (error) throw error
}
