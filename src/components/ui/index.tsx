export { Card } from './Card'
export { Button } from './Button'
export { CoverImage } from './CoverImage'

import { clsx } from 'clsx'
import type { ElementType, ReactNode } from 'react'

const colorMap: Record<string, string> = {
  green: 'bg-secondary-container text-on-secondary-container',
  amber: 'bg-warning-container text-warning',
  red: 'bg-error-container text-error',
  gray: 'bg-surface-container text-on-surface-variant',
}

export function Badge({ label, color = 'green' }: { label: string; color?: string }) {
  return (
    <span className={clsx('inline-block text-xs font-semibold font-inter uppercase tracking-wider px-2.5 py-0.5 rounded-full', colorMap[color] ?? colorMap.gray)}>
      {label}
    </span>
  )
}

export function ProgressBar({ value, label }: { value: number; label?: string }) {
  const clamped = Math.min(100, Math.max(0, value))
  return (
    <div className="w-full">
      {label && <p className="text-xs font-inter text-on-surface-variant mb-1">{label}</p>}
      <div className="w-full bg-surface-container-high rounded-full h-2 overflow-hidden">
        <div className="bg-secondary h-2 rounded-full transition-all duration-700" style={{ width: `${clamped}%` }} />
      </div>
      <p className="text-xs text-on-surface-variant mt-1 text-right">{clamped}%</p>
    </div>
  )
}

export function Spinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="w-8 h-8 border-[3px] border-secondary border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={clsx('skeleton', className)} />
}

export function Section({ id, className, children }: { id?: string; className?: string; children: ReactNode }) {
  return (
    <section id={id} className={clsx('py-20', className)}>
      <div className="container-page">{children}</div>
    </section>
  )
}

export function SectionHeading({ eyebrow, title, description, align = 'left' }: {
  eyebrow?: string; title: string; description?: string; align?: 'left' | 'center'
}) {
  return (
    <div className={clsx('mb-12', align === 'center' && 'text-center')}>
      {eyebrow && <p className="text-xs font-inter font-semibold uppercase tracking-widest text-secondary mb-2">{eyebrow}</p>}
      <h2 className="font-display text-3xl md:text-4xl text-primary">{title}</h2>
      {description && <p className={clsx('font-inter text-on-surface-variant mt-2 max-w-lg', align === 'center' && 'mx-auto')}>{description}</p>}
    </div>
  )
}

export function EmptyState({ icon: Icon, title, message, action }: {
  icon: ElementType; title: string; message?: string; action?: ReactNode
}) {
  return (
    <div className="text-center py-16 bg-surface-container-low rounded-2xl border border-outline-variant/60">
      <div className="w-12 h-12 rounded-2xl bg-secondary-container flex items-center justify-center mx-auto mb-4">
        <Icon className="w-6 h-6 text-secondary" />
      </div>
      <p className="font-manrope font-semibold text-primary mb-1">{title}</p>
      {message && <p className="font-inter text-sm text-on-surface-variant max-w-sm mx-auto">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function ErrorState({ message, onRetry }: { message?: string; onRetry?: () => void }) {
  return (
    <div className="text-center py-12 bg-error-container/40 rounded-2xl border border-error/20">
      <p className="font-manrope font-semibold text-error mb-1">Não foi possível carregar</p>
      <p className="font-inter text-sm text-on-surface-variant mb-4">{message ?? 'Tente novamente em instantes.'}</p>
      {onRetry && (
        <button onClick={onRetry} className="inline-flex items-center gap-2 bg-primary text-white text-sm font-inter font-semibold px-4 py-2 rounded-xl hover:bg-primary-container transition-colors">
          Tentar novamente
        </button>
      )}
    </div>
  )
}
