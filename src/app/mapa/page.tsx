'use client'
import { useState, useCallback } from 'react'
import { MapView } from '@/components/map/MapView'
import { AreaCard } from '@/components/map/AreaCard'
import { useAreas } from '@/hooks/useAreas'
import { Spinner } from '@/components/ui'
import { MapPin } from 'lucide-react'

export default function MapaPage() {
  const { areas, loading } = useAreas()
  const [selectedArea, setSelectedArea] = useState(null)

  // useCallback evita nova referência a cada render (que causaria loop no MapView)
  const handleAreaClick = useCallback((area) => {
    setSelectedArea(area)
  }, [])

  return (
    <div className="px-6 py-8 max-w-[1400px] mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <MapPin className="w-4 h-4 text-secondary" />
          <p className="text-xs font-inter font-semibold uppercase tracking-widest text-secondary">
            Rosário da Limeira · MG
          </p>
        </div>
        <h2 className="font-manrope font-bold text-3xl text-primary mb-1">
          Mapa Interativo
        </h2>
        <p className="font-inter text-on-surface-variant text-sm">
          Explore as áreas de reflorestamento da ONG Iracambi. Clique em uma área para ver detalhes.
        </p>
      </div>

      {loading ? (
        <Spinner />
      ) : (
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-4 space-y-3 max-h-[640px] overflow-y-auto pr-1">
            {areas.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-sm font-inter text-on-surface-variant">
                  Nenhuma área cadastrada ainda.
                </p>
              </div>
            ) : (
              areas.map((area) => (
                <AreaCard
                  key={area.id}
                  area={area}
                  selected={selectedArea?.id === area.id}
                  onClick={() => handleAreaClick(area)}
                />
              ))
            )}
          </div>

          <div className="col-span-8">
            <MapView
              areas={areas}
              selectedAreaId={selectedArea?.id}
              onAreaClick={handleAreaClick}
              height="640px"
            />
          </div>
        </div>
      )}
    </div>
  )
}
