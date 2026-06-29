import { PublicNav } from '@/components/layout/PublicNav'
import { FooterSection } from '@/components/home/FooterSection'

// Detalhe do projeto é PÚBLICO — qualquer visitante pode ver a transparência.
// (Antes exigia login, o que escondia os projetos de quem ainda não doou.)
export default function AreaDetailLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <PublicNav />
      <main className="flex-1 pt-16">{children}</main>
      <FooterSection />
    </div>
  )
}
