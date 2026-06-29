'use client'
import { useState } from 'react'
import { useAreas } from '@/hooks/useAreas'
import { createArea, updateArea, deleteArea } from '@/services/areasService'
import { Card, Badge, Button, Spinner, EmptyState, ErrorState } from '@/components/ui'
import { Pencil, Trash2, Check, X, Trees } from 'lucide-react'

const STATUS_OPTIONS = ['ativo', 'em_andamento', 'concluido', 'pausado'] as const
const STATUS_LABEL: Record<string, string> = { ativo: 'Ativo', em_andamento: 'Em andamento', concluido: 'Concluído', pausado: 'Pausado' }
const STATUS_COLOR: Record<string, string> = { ativo: 'green', em_andamento: 'green', concluido: 'gray', pausado: 'amber' }

interface AreaForm {
  nome: string
  descricao: string
  objetivo: string
  tamanho: string
  meta_arvores: string
  capa_url: string
  status: string
}

const EMPTY: AreaForm = { nome: '', descricao: '', objetivo: '', tamanho: '', meta_arvores: '', capa_url: '', status: 'ativo' }

function toPayload(f: AreaForm) {
  const p: Record<string, unknown> = { nome: f.nome, descricao: f.descricao, objetivo: f.objetivo, capa_url: f.capa_url || null, status: f.status }
  if (f.tamanho) p.tamanho = Number(f.tamanho)
  if (f.meta_arvores) p.meta_arvores = Number(f.meta_arvores)
  return p
}

export default function AdminAreasPage() {
  const { areas, loading, error, refetch } = useAreas()
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<AreaForm>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<AreaForm>(EMPTY)
  const [formError, setFormError] = useState<string | null>(null)

  const set = (k: keyof AreaForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((s) => ({ ...s, [k]: e.target.value }))
  const setEdit = (k: keyof AreaForm) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setEditForm((s) => ({ ...s, [k]: e.target.value }))

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setFormError(null)
    try {
      await createArea(toPayload(form))
      setForm(EMPTY); setShowForm(false)
      await refetch()
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally { setSaving(false) }
  }

  function startEdit(area: any) {
    setEditingId(area.id)
    setEditForm({
      nome: area.nome ?? '', descricao: area.descricao ?? '', objetivo: area.objetivo ?? '',
      tamanho: area.tamanho ? String(area.tamanho) : '', meta_arvores: area.meta_arvores ? String(area.meta_arvores) : '',
      capa_url: area.capa_url ?? '', status: area.status ?? 'ativo',
    })
  }

  async function handleSaveEdit(id: string) {
    setSaving(true); setFormError(null)
    try {
      await updateArea(id, toPayload(editForm))
      setEditingId(null)
      await refetch()
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally { setSaving(false) }
  }

  async function handleDelete(id: string) {
    if (!confirm('Remover esta área permanentemente?')) return
    try { await deleteArea(id); await refetch() }
    catch (err) { alert(err instanceof Error ? err.message : 'Erro ao remover') }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-3xl text-primary">Gerenciar Projetos</h2>
        <Button onClick={() => setShowForm(!showForm)}>{showForm ? 'Cancelar' : '+ Novo Projeto'}</Button>
      </div>

      {showForm && (
        <Card className="border-secondary/40">
          <h3 className="font-manrope font-semibold text-primary mb-4">Cadastrar Projeto</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <FieldText label="Nome *" value={form.nome} onChange={set('nome')} required placeholder="Ex: Reserva Norte" />
              <FieldText label="Tamanho (ha)" type="number" value={form.tamanho} onChange={set('tamanho')} placeholder="Ex: 45.5" />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Status</Label>
                <select value={form.status} onChange={set('status')} className={selectCls}>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                </select>
              </div>
              <FieldText label="Meta de mudas" type="number" value={form.meta_arvores} onChange={set('meta_arvores')} placeholder="Ex: 5000" />
            </div>
            <div>
              <Label>Descrição</Label>
              <textarea value={form.descricao} onChange={set('descricao')} rows={2} className={inputCls} placeholder="Breve descrição do projeto…" />
            </div>
            <div>
              <Label>Objetivo (transparência)</Label>
              <textarea value={form.objetivo} onChange={set('objetivo')} rows={2} className={inputCls} placeholder="O que este projeto pretende alcançar…" />
            </div>
            <FieldText label="URL da imagem de capa (opcional)" value={form.capa_url} onChange={set('capa_url')} placeholder="https://… (do Storage do Supabase)" />
            {formError && <p className="text-xs font-inter text-error bg-error-container px-3 py-2 rounded-lg">{formError}</p>}
            <Button type="submit" disabled={saving}>{saving ? 'Salvando…' : 'Cadastrar Projeto'}</Button>
          </form>
        </Card>
      )}

      {loading ? <Spinner /> : error ? <ErrorState message={error} onRetry={refetch} /> : (
        <div className="space-y-2">
          {areas.length === 0 && <EmptyState icon={Trees} title="Nenhum projeto cadastrado" message="Crie o primeiro projeto para começar a publicar transparência." />}
          {areas.map((area: any) => (
            <Card key={area.id} className="flex items-center gap-4">
              {editingId === area.id ? (
                <div className="flex-1 grid md:grid-cols-3 gap-3">
                  <input value={editForm.nome} onChange={setEdit('nome')} className={inlineCls} placeholder="Nome" />
                  <select value={editForm.status} onChange={setEdit('status')} className={inlineCls}>
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                  </select>
                  <input type="number" value={editForm.tamanho} onChange={setEdit('tamanho')} placeholder="Tamanho (ha)" className={inlineCls} />
                  <input type="number" value={editForm.meta_arvores} onChange={setEdit('meta_arvores')} placeholder="Meta de mudas" className={inlineCls} />
                  <input value={editForm.capa_url} onChange={setEdit('capa_url')} placeholder="URL da capa" className={`${inlineCls} md:col-span-2`} />
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-between">
                  <div>
                    <p className="font-inter font-semibold text-primary">{area.nome}</p>
                    <p className="text-xs font-inter text-on-surface-variant mt-0.5">
                      {area.tamanho ? `${area.tamanho} ha` : 'Tamanho não informado'}
                      {area.meta_arvores ? ` · meta ${Number(area.meta_arvores).toLocaleString('pt-BR')} mudas` : ''}
                    </p>
                  </div>
                  <Badge label={STATUS_LABEL[area.status] ?? area.status} color={STATUS_COLOR[area.status] ?? 'gray'} />
                </div>
              )}

              <div className="flex items-center gap-2 shrink-0">
                {editingId === area.id ? (
                  <>
                    <IconBtn onClick={() => handleSaveEdit(area.id)} title="Salvar" tone="ok"><Check className="w-4 h-4" /></IconBtn>
                    <IconBtn onClick={() => setEditingId(null)} title="Cancelar"><X className="w-4 h-4" /></IconBtn>
                  </>
                ) : (
                  <>
                    <IconBtn onClick={() => startEdit(area)} title="Editar"><Pencil className="w-3.5 h-3.5" /></IconBtn>
                    <IconBtn onClick={() => handleDelete(area.id)} title="Excluir" tone="danger"><Trash2 className="w-3.5 h-3.5" /></IconBtn>
                  </>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

const inputCls = 'w-full border border-outline-variant rounded-xl px-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-1 focus:ring-secondary'
const selectCls = inputCls + ' bg-white'
const inlineCls = 'border border-outline-variant rounded-xl px-3 py-2 text-sm font-inter bg-white focus:outline-none focus:ring-1 focus:ring-secondary'

function Label({ children }: { children: React.ReactNode }) {
  return <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1">{children}</label>
}
function FieldText({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (<div><Label>{label}</Label><input {...props} className={inputCls} /></div>)
}
function IconBtn({ children, onClick, title, tone }: { children: React.ReactNode; onClick: () => void; title: string; tone?: 'ok' | 'danger' }) {
  const base = 'w-8 h-8 rounded-lg flex items-center justify-center transition-colors'
  const cls = tone === 'ok' ? 'bg-secondary-container text-secondary hover:bg-secondary hover:text-white'
    : tone === 'danger' ? 'bg-surface-container text-on-surface-variant hover:bg-error-container hover:text-error'
    : 'bg-surface-container text-on-surface-variant hover:bg-secondary-container hover:text-secondary'
  return <button onClick={onClick} title={title} aria-label={title} className={`${base} ${cls}`}>{children}</button>
}
