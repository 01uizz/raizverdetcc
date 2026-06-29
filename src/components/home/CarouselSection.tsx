'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  { src: '/carousel-1.png', title: 'Viveiro de mudas', caption: 'Mais de 80 espécies nativas cultivadas para o reflorestamento da Mata Atlântica.' },
  { src: '/carousel-2.png', title: 'Floresta restaurada', caption: 'Áreas antes degradadas transformadas em floresta densa e biodiversa.' },
  { src: '/carousel-3.png', title: 'Trilhas ecológicas', caption: 'Percursos que revelam a riqueza da Mata Atlântica em recuperação.' },
  { src: '/carousel-4.png', title: 'Plantio científico', caption: 'Cada muda catalogada e acompanhada por pesquisadores e voluntários.' },
]

export function CarouselSection() {
  const [current, setCurrent] = useState(0)
  const prev = useCallback(() => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1)), [])
  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [])

  useEffect(() => {
    const t = setInterval(next, 5500)
    return () => clearInterval(t)
  }, [next])

  return (
    <section className="py-24 bg-surface-container-high">
      <div className="container-page">
        <div className="text-center mb-12">
          <p className="eyebrow mb-3">Nossa reserva</p>
          <h2 className="font-display text-3xl md:text-5xl text-primary">A floresta que cresce com você</h2>
        </div>

        <div className="relative w-full rounded-4xl overflow-hidden shadow-forest-xl" style={{ paddingBottom: '43.75%' }}>
          <div className="absolute inset-0">
            {slides.map((s, i) => (
              <div key={s.src} aria-hidden={i !== current} className={`absolute inset-0 transition-opacity duration-700 ${i === current ? 'opacity-100' : 'opacity-0'}`}>
                <Image src={s.src} alt={s.title} fill sizes="(max-width: 768px) 100vw, 1152px" quality={90} className="object-cover object-center" priority={i === 0} />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/15 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                  <h3 className="font-display text-2xl md:text-3xl text-white mb-1">{s.title}</h3>
                  <p className="font-inter text-white/85 text-sm max-w-lg leading-relaxed">{s.caption}</p>
                </div>
              </div>
            ))}

            <button onClick={prev} aria-label="Slide anterior" className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 transition-colors flex items-center justify-center text-white z-10">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={next} aria-label="Próximo slide" className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/20 backdrop-blur hover:bg-white/40 transition-colors flex items-center justify-center text-white z-10">
              <ChevronRight className="w-5 h-5" />
            </button>

            <div className="absolute bottom-6 right-8 flex gap-1.5 z-10">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} aria-label={`Ir para slide ${i + 1}`} className={`h-2 rounded-full transition-all duration-300 ${i === current ? 'w-6 bg-white' : 'w-2 bg-white/50'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
