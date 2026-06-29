import Link from 'next/link'
import Image from 'next/image'
import { Heart, MapPin, ArrowDown, Sprout } from 'lucide-react'
import { FallingLeaves } from '@/components/home/FallingLeaves'

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden pt-16">
      {/* Fundo */}
      <div className="absolute inset-0 z-0">
        <Image src="/carousel-2.png" alt="Mata Atlântica Iracambi" fill sizes="100vw" quality={90} className="object-cover object-center" priority />
      </div>

      {/* Gradientes de contraste */}
      <div className="absolute inset-0 z-10 bg-gradient-to-r from-[#08291b]/95 via-[#08291b]/82 to-[#08291b]/35" />
      <div className="absolute inset-0 z-10 bg-gradient-to-t from-[#08291b]/70 via-transparent to-[#08291b]/20" />

      {/* Formas orgânicas + silhueta de árvores */}
      <div className="absolute inset-0 z-10 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 -right-32 w-[600px] h-[600px] rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #7bb38b 0%, transparent 70%)' }} />
        <div className="absolute -bottom-24 -left-24 w-[420px] h-[420px] rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #2f8f58 0%, transparent 70%)' }} />
        <svg className="absolute bottom-0 left-0 right-0 w-full opacity-25" viewBox="0 0 1440 180" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 180V120L60 80L90 100L120 60L160 90L200 40L240 70L280 30L320 60L360 20L400 55L440 15L480 50L520 10L560 45L600 25L640 60L680 35L720 70L760 30L800 65L840 20L880 55L920 15L960 50L1000 30L1040 65L1080 25L1120 60L1160 20L1200 55L1240 35L1280 70L1320 40L1360 75L1400 50L1440 80V180H0Z" fill="#2f8f58" />
          <path d="M0 180V140L80 110L120 125L160 95L210 115L260 80L300 100L350 70L400 90L450 65L500 85L550 55L600 75L650 50L700 70L750 45L800 68L850 40L900 62L950 38L1000 60L1050 42L1100 65L1150 45L1200 68L1250 48L1300 72L1350 52L1400 75L1440 90V180H0Z" fill="#0c3220" />
        </svg>
      </div>

      {/* Assinatura: curvas de nível (terreno mapeado) */}
      <div className="absolute inset-0 z-10 pattern-topo-light opacity-70 pointer-events-none" />

      <FallingLeaves />

      {/* Conteúdo */}
      <div className="relative z-20 container-page py-24">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm border border-white/25 rounded-full px-4 py-2 mb-7 animate-fade-up">
            <MapPin className="w-3.5 h-3.5 text-[#bfe7cb]" />
            <span className="text-xs font-inter font-medium text-[#bfe7cb] tracking-wide">Rosário da Limeira · Zona da Mata · MG</span>
          </div>

          <h1 className="font-display text-5xl md:text-7xl text-white leading-[1.05] mb-6 drop-shadow-lg animate-fade-up reveal-1">
            Transparência no<br />
            <span className="relative inline-block text-[#bfe7cb] italic">
              reflorestamento
              <span className="absolute -bottom-1 left-0 right-0 h-1 rounded-full bg-sap-gradient" />
            </span>
          </h1>

          <p className="font-inter text-white/90 text-lg mb-9 leading-relaxed max-w-lg drop-shadow-sm animate-fade-up reveal-2">
            A ONG Iracambi restaura a Mata Atlântica há mais de 25 anos.
            Acompanhe, em dados reais, como cada doação vira floresta.
          </p>

          <div className="flex flex-wrap gap-4 animate-fade-up reveal-3">
            <Link href="/#doe" className="inline-flex items-center gap-2 bg-white text-[#08291b] font-inter font-bold px-7 py-3.5 rounded-full hover:bg-[#bfe7cb] transition-colors shadow-forest-lg">
              <Heart className="w-4 h-4" /> Faça uma doação
            </Link>
            <Link href="/mapa" className="inline-flex items-center gap-2 bg-white/12 backdrop-blur-sm border border-white/35 text-white font-inter font-semibold px-7 py-3.5 rounded-full hover:bg-white/25 transition-colors">
              <Sprout className="w-4 h-4" /> Ver o mapa
            </Link>
          </div>

          <div className="flex items-center gap-6 mt-12 animate-fade-up reveal-4">
            <Stat dot label="+25 anos de atuação" />
            <div className="w-px h-4 bg-white/20" />
            <Stat dot label="Mata Atlântica · Brasil" />
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 animate-bounce">
        <ArrowDown className="w-5 h-5 text-white/50" />
      </div>
    </section>
  )
}

function Stat({ label }: { dot?: boolean; label: string }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-[#bfe7cb] animate-pulse" />
      <span className="text-xs font-inter text-white/75">{label}</span>
    </div>
  )
}
