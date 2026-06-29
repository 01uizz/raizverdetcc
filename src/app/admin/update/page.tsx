'use client'
import { useState, useRef } from 'react'
import { useAreas } from '@/hooks/useAreas'
import { createUpdate } from '@/services/updatesService'
import { uploadPhoto } from '@/services/storageService'
import { useAuth } from '@/context/AuthContext'
import { Card, Button, Spinner } from '@/components/ui'
import { useRouter } from 'next/navigation'

export default function AdminUpdatePage() {
  const router = useRouter()
  const { session } = useAuth()
  const { areas, loading: loadingAreas } = useAreas()

  const [areaId, setAreaId] = useState('')
  const [data, setData] = useState(new Date().toISOString().split('T')[0])
  const [arvores, setArvores] = useState('')
  const [especies, setEspecies] = useState('')
  const [observacao, setObservacao] = useState('')
  const [status, setStatus] = useState('plantio')
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  function handleFile(e) {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!areaId) return setError('Selecione uma área.')
    setSaving(true)
    setError(null)
    try {
      let foto_url: string | undefined
      if (file) {
        foto_url = await uploadPhoto(file, areaId)
      }

      await createUpdate({
        area_id: areaId,
        data,
        arvores: arvores ? Number(arvores) : undefined,
        especies: especies ? especies.split(',').map((s) => s.trim()).filter(Boolean) : [],
        observacao,
        status,
        foto_url,
        created_by: session?.user?.id,
      })

      router.push('/admin/dashboard')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar')
    } finally {
      setSaving(false)
    }
  }

  if (loadingAreas) return <Spinner />

  return (
    <div className="max-w-2xl">
      <h2 className="font-manrope font-bold text-3xl text-primary mb-8">Nova Atualização</h2>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Area selector */}
          <div>
            <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1">
              Área *
            </label>
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              required
              className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-secondary bg-white"
            >
              <option value="">Selecione uma área...</option>
              {areas.map((a) => (
                <option key={a.id} value={a.id}>{a.nome}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1">
                Data *
              </label>
              <input
                type="date"
                value={data}
                onChange={(e) => setData(e.target.value)}
                required
                className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-secondary"
              />
            </div>
            <div>
              <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-secondary bg-white"
              >
                <option value="preparacao">Preparação</option>
                <option value="plantio">Plantio</option>
                <option value="manutencao">Manutenção</option>
                <option value="monitoramento">Monitoramento</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1">
                Árvores Plantadas
              </label>
              <input
                type="number"
                value={arvores}
                onChange={(e) => setArvores(e.target.value)}
                className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-secondary"
                placeholder="Ex: 120"
              />
            </div>
            <div>
              <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1">
                Espécies (separadas por vírgula)
              </label>
              <input
                type="text"
                value={especies}
                onChange={(e) => setEspecies(e.target.value)}
                className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-secondary"
                placeholder="Ex: Jatobá, Cedro, Ipê"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-1">
              Observação
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
              className="w-full border border-outline-variant rounded-lg px-4 py-2.5 text-sm font-inter focus:outline-none focus:border-secondary resize-none"
              placeholder="Descreva o que foi realizado nesta atualização..."
            />
          </div>

          {/* Photo upload */}
          <div>
            <label className="block text-xs font-inter font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
              Foto
            </label>
            {preview ? (
              <div className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preview} alt="Preview" className="w-full h-48 object-cover rounded-lg" />
                <button
                  type="button"
                  onClick={() => { setFile(null); setPreview(null) }}
                  className="absolute top-2 right-2 bg-white/90 text-on-surface rounded-full w-7 h-7 flex items-center justify-center text-sm"
                >
                  ✕
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-outline-variant rounded-lg p-8 text-center text-on-surface-variant hover:border-secondary transition-colors"
              >
                <span className="text-3xl mb-2 block">📷</span>
                <span className="text-sm font-inter">Clique para selecionar uma foto</span>
              </button>
            )}
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFile} className="hidden" />
          </div>

          {error && (
            <p className="text-xs font-inter text-error bg-error-container px-3 py-2 rounded-lg">
              {error}
            </p>
          )}

          <div className="flex gap-3">
            <Button type="submit" disabled={saving}>
              {saving ? 'Salvando...' : 'Publicar Atualização'}
            </Button>
            <Button type="button" variant="secondary" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
