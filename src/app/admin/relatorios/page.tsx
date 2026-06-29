'use client'
import { useState, useRef } from 'react'
import { useAreas } from '@/hooks/useAreas'
import { useReports } from '@/hooks/useReports'
import { createReport, deleteReport } from '@/services/reportsService'
import { uploadPhoto } from '@/services/storageService'
import { Card, Button, Spinner, EmptyState } from '@/components/ui'
import { FileText, Trash2, Upload, Calendar } from 'lucide-react'

export default function AdminRelatoriosPage() {
  const { areas, loading: loadingAreas } = useAreas()
  const [areaId, setAreaId] = useState('')
  const { reports, loading: loadingReports, refetch } = useReports(areaId)

  const [titulo, setTitulo] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [arquivoUrl, setArquivoUrl] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!areaId) return setError('Selecione um projeto.')
    if (!titulo.trim()) return setError('Informe o título do relatório.')
    setSaving(true); setError(null)
    try {
      let url = arquivoUrl.trim() || undefined
      if (file) url = await uploadPhoto(file, areaId) // reaproveita o bucket area-photos
      await createReport({ area_id: areaId, titulo: titulo.trim(), data, arquivo_url: url ?? null })
      setTitulo(''); setArquivoUrl(''); setFile(null)
      if (fileRef.current) fileRef.current.value = ''
      await refetch()
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover este relatório?')) return
    try { await deleteReport(id); await refetch() }
    catch (err) { alert(err instanceof Error ? err.message : 'Erro ao remover') }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-3xl text-primary">Relatórios de Transparência</h2>
        <p className="font-inter text-on-surface-variant text-sm mt-1">Publique relatórios e marcos de cada projeto. Aparecem na página pública do projeto.</p>
      </div>

      <Card>
        <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Projeto</label>
        {loadingAreas ? <Spinner /> : (
          <select value={areaId} onChange={(e) => setAreaId(e.target.value)} className="w-full md:max-w-sm border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-inter bg-white focus:outline-none focus:ring-1 focus:ring-secondary">
            <option value="">Selecione um projeto…</option>
            {areas.map((a: any) => <option key={a.id} value={a.id}>{a.nome}</option>)}
          </select>
        )}
      </Card>

      {areaId && (
        <>
          <Card className="border-secondary/40">
            <h3 className="font-manrope font-semibold text-primary mb-4">Novo relatório</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Título *</label>
                  <input value={titulo} onChange={(e) => setTitulo(e.target.value)} placeholder="Ex: Relatório anual 2025"
                    className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-1 focus:ring-secondary" />
                </div>
                <div>
                  <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Data</label>
                  <input type="date" value={data} onChange={(e) => setData(e.target.value)}
                    className="w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-1 focus:ring-secondary" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1">Arquivo (PDF/imagem) — opcional</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="button" onClick={() => fileRef.current?.click()}
                    className="inline-flex items-center gap-2 border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-inter text-on-surface-variant hover:border-secondary transition-colors">
                    <Upload className="w-4 h-4" /> {file ? file.name : 'Selecionar arquivo'}
                  </button>
                  <input ref={fileRef} type="file" accept="application/pdf,image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} className="hidden" />
                  <input value={arquivoUrl} onChange={(e) => setArquivoUrl(e.target.value)} placeholder="…ou cole uma URL"
                    className="flex-1 border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-1 focus:ring-secondary" />
                </div>
              </div>

              {error && <p className="text-xs font-inter text-error bg-error-container px-3 py-2 rounded-lg">{error}</p>}
              <Button type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Publicar relatório'}</Button>
            </form>
          </Card>

          <Card>
            <h3 className="font-manrope font-semibold text-primary mb-4">Relatórios publicados</h3>
            {loadingReports ? <Spinner /> : reports.length === 0 ? (
              <EmptyState icon={FileText} title="Nenhum relatório" message="Publique o primeiro relatório deste projeto." />
            ) : (
              <ul className="divide-y divide-outline-variant">
                {reports.map((r: any) => (
                  <li key={r.id} className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-surface-container flex items-center justify-center shrink-0"><FileText className="w-4 h-4 text-secondary" /></div>
                      <div className="min-w-0">
                        <p className="font-inter text-sm font-semibold text-on-surface truncate">{r.titulo}</p>
                        {r.data && <p className="text-xs font-inter text-on-surface-variant flex items-center gap-1"><Calendar className="w-3 h-3" /> {r.data}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      {r.arquivo_url && <a href={r.arquivo_url} target="_blank" rel="noopener noreferrer" className="text-xs font-inter font-semibold text-secondary hover:text-primary">Abrir</a>}
                      <button onClick={() => handleDelete(r.id)} aria-label="Excluir" className="w-8 h-8 rounded-lg bg-surface-container text-on-surface-variant hover:bg-error-container hover:text-error flex items-center justify-center transition-colors">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </>
      )}
    </div>
  )
}
