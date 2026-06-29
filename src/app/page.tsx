import { PublicNav } from '@/components/layout/PublicNav'
import { HeroSection } from '@/components/home/HeroSection'
import { StatsSection } from '@/components/home/StatsSection'
import { CarouselSection } from '@/components/home/CarouselSection'
import { ProjectsSection } from '@/components/home/ProjectsSection'
import { DonateSection } from '@/components/home/DonateSection'
import { FooterSection } from '@/components/home/FooterSection'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <PublicNav />
      <HeroSection />
      <StatsSection />
      <CarouselSection />
      <ProjectsSection />
      <DonateSection />
      <FooterSection />
    </div>
  )
}
