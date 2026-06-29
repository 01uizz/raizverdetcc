'use client'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Card, Spinner } from '@/components/ui'
import { Search, Mail, User, Filter } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface Profile {
  id: string
  nome?: string
  tipo?: string
  created_at: string
  email?: string
}

export default function AdminUsuariosPage() {
  const [profiles, setProfiles]   = useState<Profile[]>([])
  const [filtered, setFiltered]   = useState<Profile[]>([])
  const [loading, setLoading]     = useState(true)
  const [search, setSearch]       = useState('')
  const [tipoFilter, setTipoFilter] = useState('todos')
  const [emailTarget, setEmailTarget] = useState<Profile | null>(null)
  const [emailMsg, setEmailMsg]   = useState('')
  const [sending, setSending]     = useState(false)
  const [sendResult, setSendResult] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      setLoading(true)
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, nome, tipo, created_at')
          .order('created_at', { ascending: false })

        if (error) throw error
        setProfiles(data ?? [])
        setFiltered(data ?? [])
      } catch (e) {
        console.error('[usuarios]', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const applyFilters = useCallback(() => {
    let list = [...profiles]
    if (tipoFilter !== 'todos') list = list.filter((p) => p.tipo === tipoFilter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (p) =>
          p.nome?.toLowerCase().includes(q) ||
          p.tipo?.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q)
      )
    }
    setFiltered(list)
  }, [profiles, search, tipoFilter])

  useEffect(() => { applyFilters() }, [applyFilters])

  async function handleSendEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!emailTarget || !emailMsg.trim()) return
    setSending(true)
    setSendResult(null)
    // Integração futura com serviço de e-mail (SendGrid, Resend etc.)
    // Por ora registra no console e simula envio
    await new Promise((r) => setTimeout(r, 800))
    console.log('[Admin] E-mail para', emailTarget.id, ':', emailMsg)
    setSendResult('E-mail enviado com sucesso.')
    setSending(false)
    setEmailMsg('')
    setTimeout(() => { setEmailTarget(null); setSendResult(null) }, 2000)
  }

  const badgeColor: Record<string, string> = {
    admin: 'bg-primary/10 text-primary',
    doador: 'bg-secondary-container text-on-secondary-container',
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-manrope font-bold text-3xl text-primary">Usuários</h2>
          <p className="font-inter text-on-surface-variant text-sm mt-1">
            {filtered.length} de {profiles.length} usuários
          </p>
        </div>
      </div>

      {/* Filtros */}
      <Card>
        <div className="flex gap-4 flex-wrap">
          <div className="relative flex-1 min-w-48">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar por nome, tipo ou ID..."
              className="w-full border border-outline-variant rounded-xl pl-9 pr-4 py-2.5 text-sm font-inter focus:outline-none focus:ring-1 focus:ring-secondary"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-on-surface-variant" />
            <select
              value={tipoFilter}
              onChange={(e) => setTipoFilter(e.target.value)}
              className="border border-outline-variant rounded-xl px-3 py-2.5 text-sm font-inter bg-white focus:outline-none focus:ring-1 focus:ring-secondary"
            >
              <option value="todos">Todos os tipos</option>
              <option value="doador">Doadores</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Lista */}
      {loading ? (
        <Spinner />
      ) : filtered.length === 0 ? (
        <Card>
          <p className="text-sm font-inter text-on-surface-variant text-center py-8">
            Nenhum usuário encontrado.
          </p>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((p) => (
            <Card key={p.id} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center shrink-0">
                  <User className="w-4 h-4 text-secondary" />
                </div>
                <div className="min-w-0">
                  <p className="font-inter font-semibold text-sm text-primary truncate">
                    {p.nome ?? 'Sem nome'}
                  </p>
                  <p className="text-xs font-inter text-on-surface-variant truncate">
                    ID: {p.id.slice(0, 8)}…
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className={`text-xs font-inter font-semibold px-2.5 py-1 rounded-full ${badgeColor[p.tipo ?? ''] ?? 'bg-surface-container text-on-surface-variant'}`}>
                  {p.tipo ?? '—'}
                </span>
                <span className="text-xs font-inter text-on-surface-variant hidden md:block">
                  {format(new Date(p.created_at), 'dd/MM/yyyy', { locale: ptBR })}
                </span>
                <button
                  onClick={() => setEmailTarget(p)}
                  className="flex items-center gap-1.5 text-xs font-inter text-secondary hover:text-primary border border-secondary/30 hover:border-primary/30 rounded-lg px-3 py-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  E-mail
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Modal envio de e-mail */}
      {emailTarget && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-4" onClick={() => setEmailTarget(null)}>
          <Card className="w-full max-w-md" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <h3 className="font-manrope font-semibold text-primary mb-1">Enviar e-mail</h3>
            <p className="text-xs font-inter text-on-surface-variant mb-4">
              Para: <strong>{emailTarget.nome ?? emailTarget.id}</strong>
            </p>
            <form onSubmit={handleSendEmail} className="space-y-4">
              <textarea
                value={emailMsg}
                onChange={(e) => setEmailMsg(e.target.value)}
                required
                rows={4}
                placeholder="Escreva sua mensagem..."
                className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm font-inter focus:outline-none focus:ring-1 focus:ring-secondary resize-none"
              />
              {sendResult && (
                <p className="text-xs font-inter text-secondary">{sendResult}</p>
              )}
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={sending}
                  className="flex-1 bg-primary text-white font-inter font-semibold py-2.5 rounded-xl text-sm hover:bg-primary/90 disabled:opacity-60"
                >
                  {sending ? 'Enviando...' : 'Enviar'}
                </button>
                <button
                  type="button"
                  onClick={() => setEmailTarget(null)}
                  className="px-4 py-2.5 border border-outline-variant rounded-xl text-sm font-inter text-on-surface-variant hover:bg-surface-container"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  )
}
