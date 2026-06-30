'use client'

import { useEffect, useState } from 'react'
import { useAreas } from '@/hooks/useAreas'
import { useAllUpdates } from '@/hooks/useUpdates'
import { supabase } from '@/lib/supabase'
import { Card, Badge, Spinner } from '@/components/ui'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import {
  TreePine,
  Users,
  Plus,
  DollarSign,
  ArrowRight,
} from 'lucide-react'

export default function AdminDashboardPage() {
  const { areas, loading: loadingAreas } = useAreas()
  const { updates, loading: loadingUpdates } = useAllUpdates()
  const [totalDoadores, setTotalDoadores] = useState<number | null>(null)

  useEffect(() => {
    const fetchDoadores = async () => {
      try {
        const { count, error } = await supabase
          .from('profiles')
          .select('id', { count: 'exact', head: true })
          .eq('tipo', 'doador')

        if (error) {
          setTotalDoadores(0)
          return
        }

        setTotalDoadores(count ?? 0)
      } catch {
        setTotalDoadores(0)
      }
    }

    fetchDoadores()
  }, [])

  const totalArvores = updates.reduce(
    (s, u) => s + (u.arvores ?? 0),
    0
  )

  const statusColor: Record<string, string> = {
    ativo: 'green',
    em_andamento: 'green',
    concluido: 'gray',
    pausado: 'amber',
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-manrope font-bold text-3xl text-primary mb-1">
            Dashboard
          </h2>
          <p className="font-inter text-on-surface-variant text-sm">
            Visão geral — Iracambi Raiz Verde
          </p>
        </div>

        <Link
          href="/admin/update"
          className="flex items-center gap-2 bg-primary text-white font-inter font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Nova Atualização
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          {
            icon: TreePine,
            label: 'Árvores Plantadas',
            value:
              totalArvores > 0
                ? totalArvores.toLocaleString('pt-BR')
                : '0',
          },
          {
            icon: TreePine,
            label: 'Áreas Cadastradas',
            value: loadingAreas ? '...' : String(areas.length),
          },
          {
            icon: TreePine,
            label: 'Áreas Ativas',
            value: loadingAreas
              ? '...'
              : String(
                  areas.filter(
                    (a) =>
                      a.status === 'ativo' ||
                      a.status === 'em_andamento'
                  ).length
                ),
          },
          {
            icon: Users,
            label: 'Doadores',
            value:
              totalDoadores === null
                ? '...'
                : String(totalDoadores),
          },
        ].map(({ icon: Icon, label, value }) => (
          <Card key={label}>
            <div className="w-9 h-9 rounded-xl bg-secondary-container flex items-center justify-center mb-3">
              <Icon className="w-5 h-5 text-secondary" />
            </div>
            <p className="font-manrope font-bold text-2xl text-primary leading-none mb-1">
              {value}
            </p>
            <p className="text-xs font-inter text-on-surface-variant">
              {label}
            </p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Projetos */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-manrope font-semibold text-primary">
              Projetos
            </h3>
            <Link
              href="/admin/areas"
              className="text-xs font-inter text-secondary hover:text-primary flex items-center gap-1"
            >
              Gerenciar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loadingAreas ? (
            <Spinner />
          ) : (
            <ul className="space-y-3">
              {areas.slice(0, 6).map((area) => (
                <li
                  key={area.id}
                  className="flex items-center justify-between"
                >
                  <span className="text-sm font-inter text-on-surface truncate mr-2">
                    {area.nome}
                  </span>
                  <Badge
                    label={area.status}
                    color={statusColor[area.status] ?? 'gray'}
                  />
                </li>
              ))}

              {areas.length === 0 && (
                <p className="text-sm font-inter text-on-surface-variant py-2">
                  Nenhum projeto cadastrado.
                </p>
              )}
            </ul>
          )}
        </Card>

        {/* Atualizações recentes */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-manrope font-semibold text-primary">
              Atualizações Recentes
            </h3>
            <Link
              href="/admin/update"
              className="text-xs font-inter text-secondary hover:text-primary flex items-center gap-1"
            >
              Adicionar <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {loadingUpdates ? (
            <Spinner />
          ) : (
            <ul className="space-y-3">
              {updates.slice(0, 5).map((u) => (
                <li
                  key={u.id}
                  className="flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-inter text-on-surface">
                      {u.arvores
                        ? `${u.arvores} árvores`
                        : u.status ?? 'Atualização'}
                    </p>
                    <p className="text-xs font-inter text-on-surface-variant">
                      {u.data
                        ? format(new Date(u.data), 'dd/MM/yyyy', {
                            locale: ptBR,
                          })
                        : format(
                            new Date(u.created_at),
                            'dd/MM/yyyy',
                            { locale: ptBR }
                          )}
                    </p>
                  </div>
                  <Badge label={u.status ?? 'ok'} color="green" />
                </li>
              ))}

              {updates.length === 0 && (
                <p className="text-sm font-inter text-on-surface-variant py-2">
                  Nenhuma atualização.
                </p>
              )}
            </ul>
          )}
        </Card>
      </div>

      {/* Ações rápidas */}
      <div>
        <h3 className="font-manrope font-semibold text-primary mb-4">
          Ações Rápidas
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { href: '/admin/areas', icon: TreePine, label: 'Novo Projeto' },
            {
              href: '/admin/update',
              icon: Plus,
              label: 'Nova Atualização',
            },
            {
              href: '/admin/usuarios',
              icon: Users,
              label: 'Ver Usuários',
            },
            {
              href: '/admin/doacoes',
              icon: DollarSign,
              label: 'Ver Doações',
            },
          ].map(({ href, icon: Icon, label }) => (
            <Link key={href} href={href}>
              <Card className="flex flex-col items-center gap-2 py-5 hover:border-secondary hover:shadow-forest cursor-pointer transition-all group">
                <Icon className="w-6 h-6 text-secondary group-hover:scale-110 transition-transform" />
                <span className="text-sm font-inter font-semibold text-on-surface group-hover:text-primary transition-colors">
                  {label}
                </span>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}