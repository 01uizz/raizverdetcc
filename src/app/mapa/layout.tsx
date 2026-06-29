import { PublicNav } from '@/components/layout/PublicNav'

// Mapa é público — não exige login
export default function MapaLayout({ children }) {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <main className="pt-16">{children}</main>
    </div>
  )
}
