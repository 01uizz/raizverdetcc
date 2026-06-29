import { clsx } from 'clsx'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: (e: React.MouseEvent) => void
}

export function Card({ children, className, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-white border border-outline-variant rounded-2xl p-5 transition-all',
        className
      )}
    >
      {children}
    </div>
  )
}
