'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const slides = [
  {
    src: '/carousel-1.png',
    title: 'Viveiro de Mudas',
    caption: 'Mais de 80 espécies nativas cultivadas para o reflorestamento da Mata Atlântica.',
  },
  {
    src: '/carousel-2.png',
    title: 'Floresta Restaurada',
    caption: 'Áreas antes degradadas transformadas em floresta densa e biodiversa.',
  },
  {
    src: '/carousel-3.png',
    title: 'Trilhas Ecológicas',
    caption: 'Percursos que revelam a riqueza da Mata Atlântica em recuperação.',
  },
  {
    src: '/carousel-4.png',
    title: 'Plantio Científico',
    caption: 'Cada muda catalogada e acompanhada por pesquisadores e voluntários.',
  },
]

export function DashboardCarousel() {
  const [current, setCurrent] = useState(0)
  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), [])
  const prev = useCallback(() => setCurrent((c) => (c === 0 ? slides.length - 1 : c - 1)), [])

  useEffect(() => {
    const t = setInterval(next, 6000)
    return () => clearInterval(t)
  }, [next])

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-lg"
      style={{ height: 320, position: 'relative' }}
    >
      {slides.map((s, i) => (
        <div
          key={s.src}
          aria-hidden={i !== current}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={s.src}
            alt={s.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 75vw, 900px"
            quality={90}
            className="object-cover object-center"
            priority={i === 0}
          />
          {/* Gradiente */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />

          {/* Legenda */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-5">
            <p className="font-manrope font-bold text-lg text-white leading-tight mb-0.5">
              {s.title}
            </p>
            <p className="text-xs font-inter text-white/75 max-w-md leading-relaxed">
              {s.caption}
            </p>
          </div>
        </div>
      ))}

      {/* Controles */}
      <button
        onClick={prev}
        aria-label="Slide anterior"
        className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/55 text-white flex items-center justify-center transition-colors z-10"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      <button
        onClick={next}
        aria-label="Próximo slide"
        className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 hover:bg-black/55 text-white flex items-center justify-center transition-colors z-10"
      >
        <ChevronRight className="w-4 h-4" />
      </button>

      {/* Indicadores */}
      <div className="absolute bottom-5 right-6 flex gap-1.5 z-10">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            aria-label={`Ir para slide ${i + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              i === current ? 'w-6 bg-white' : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
