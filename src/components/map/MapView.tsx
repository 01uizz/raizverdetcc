'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import 'leaflet/dist/leaflet.css'
import { MapPin, AlertTriangle, RotateCw } from 'lucide-react'

const IRACAMBI_CENTER: [number, number] = [-20.3978, -42.2133]
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
const LOAD_TIMEOUT_MS = 12000 // se Leaflet/tiles não responderem, falha controlada

const IRACAMBI_TERRITORY: [number, number][] = [
  [-20.378, -42.230], [-20.380, -42.208], [-20.386, -42.196],
  [-20.396, -42.191], [-20.410, -42.195], [-20.420, -42.207],
  [-20.418, -42.225], [-20.410, -42.238], [-20.398, -42.241],
  [-20.386, -42.238], [-20.378, -42.230],
]

interface Area {
  id: string
  nome: string
  tamanho?: number
  status?: string
  geojson?: unknown
}

interface Props {
  areas?: Area[]
  selectedAreaId?: string
  onAreaClick?: (area: Area) => void
  height?: string
}

type Phase = 'loading' | 'ready' | 'error'

export function MapView({ areas = [], selectedAreaId, onAreaClick, height = '500px' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const areaLayersRef = useRef<any[]>([])
  const onAreaClickRef = useRef(onAreaClick)
  onAreaClickRef.current = onAreaClick

  const [phase, setPhase] = useState<Phase>('loading')
  const [attempt, setAttempt] = useState(0) // muda → força reinicialização

  const retry = useCallback(() => {
    setPhase('loading')
    setAttempt((a) => a + 1)
  }, [])

  // ── Inicialização do mapa (com timeout e tratamento de erro) ──────────
  useEffect(() => {
    if (typeof window === 'undefined' || !containerRef.current) return

    let cancelled = false
    let timeoutId: ReturnType<typeof setTimeout>

    // Garante container limpo numa nova tentativa
    if (mapRef.current) {
      try { mapRef.current.remove() } catch {}
      mapRef.current = null
    }

    timeoutId = setTimeout(() => {
      if (!cancelled && phase !== 'ready') {
        console.error('[MapView] timeout ao carregar o mapa')
        setPhase('error')
      }
    }, LOAD_TIMEOUT_MS)

    import('leaflet')
      .then((L) => {
        if (cancelled || !containerRef.current) return
        leafletRef.current = L

        const map = L.map(containerRef.current, {
          zoomControl: false,
          attributionControl: true,
          preferCanvas: true,
        }).setView(IRACAMBI_CENTER, 13)

        const tiles = L.tileLayer(TILE_URL, {
          attribution: '© OpenStreetMap © CARTO',
          subdomains: 'abcd',
          maxZoom: 19,
        })

        // Só consideramos "pronto" quando o primeiro lote de tiles carrega.
        tiles.on('load', () => {
          if (cancelled) return
          clearTimeout(timeoutId)
          setPhase('ready')
        })
        tiles.on('tileerror', () => {
          // Não derruba o mapa por um tile isolado; o timeout cobre falha total.
          console.warn('[MapView] erro em um tile')
        })
        tiles.addTo(map)

        L.control.zoom({ position: 'bottomright' }).addTo(map)

        L.polygon(IRACAMBI_TERRITORY, {
          color: '#06301f', weight: 2.5, dashArray: '8 5',
          fillColor: '#2f6b46', fillOpacity: 0.15, interactive: true,
        })
          .bindPopup(
            '<div style="font-family:Inter,sans-serif;padding:4px 6px">' +
            '<strong style="color:#06301f;font-size:13px">🌿 Reserva Iracambi</strong><br/>' +
            '<span style="color:#555;font-size:11px">Rosário da Limeira · MG · ~900 ha</span></div>'
          )
          .addTo(map)

        const icon = L.divIcon({
          className: '',
          html: '<div style="background:#06301f;color:#fff;border-radius:50%;width:42px;height:42px;display:flex;align-items:center;justify-content:center;font-size:20px;border:3px solid #fff;box-shadow:0 4px 14px rgba(0,0,0,.3)">🌿</div>',
          iconSize: [42, 42], iconAnchor: [21, 21],
        })
        L.marker(IRACAMBI_CENTER, { icon })
          .bindPopup('<div style="font-family:Inter,sans-serif;padding:4px 6px"><strong style="color:#06301f;font-size:13px">ONG Iracambi</strong><br/><span style="color:#555;font-size:11px">Rosário da Limeira · MG<br/>+25 anos de reflorestamento</span></div>')
          .addTo(map)

        mapRef.current = map

        // Fallback de segurança: se 'load' não disparar (cache, etc.),
        // o invalidateSize + um curto atraso garante exibição.
        setTimeout(() => {
          if (cancelled) return
          try { map.invalidateSize() } catch {}
          setPhase((p) => (p === 'loading' ? 'ready' : p))
        }, 1200)
      })
      .catch((err) => {
        if (cancelled) return
        clearTimeout(timeoutId)
        console.error('[MapView] falha ao importar Leaflet:', err)
        setPhase('error')
      })

    return () => {
      cancelled = true
      clearTimeout(timeoutId)
      if (mapRef.current) {
        try { mapRef.current.remove() } catch {}
        mapRef.current = null
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attempt])

  // ── Camadas das áreas (só quando o mapa está pronto) ──────────────────
  useEffect(() => {
    if (phase !== 'ready') return
    const L = leafletRef.current
    const map = mapRef.current
    if (!L || !map) return

    areaLayersRef.current.forEach((layer) => { try { map.removeLayer(layer) } catch {} })
    areaLayersRef.current = []

    areas.forEach((area) => {
      if (!area.geojson) return
      const sel = area.id === selectedAreaId
      const layer = L.geoJSON(area.geojson, {
        style: {
          color: sel ? '#06301f' : '#3c6b4a',
          fillColor: sel ? '#11402b' : '#7da981',
          fillOpacity: sel ? 0.6 : 0.35,
          weight: sel ? 3 : 1.5,
        },
      })
        .bindPopup(
          '<div style="font-family:Inter,sans-serif;padding:4px 6px"><strong style="color:#06301f;font-size:13px">' +
          area.nome + '</strong><br/><span style="color:#555;font-size:11px">' +
          (area.tamanho ?? '—') + ' ha · ' + (area.status ?? '') + '</span></div>'
        )
        .on('click', () => onAreaClickRef.current?.(area))
        .addTo(map)
      areaLayersRef.current.push(layer)
    })
  }, [areas, selectedAreaId, phase])

  return (
    <div
      className="relative rounded-2xl overflow-hidden shadow-forest border border-outline-variant bg-surface-container-low"
      style={{ height, width: '100%' }}
    >
      <div ref={containerRef} style={{ height: '100%', width: '100%' }} />

      {/* Estado: carregando */}
      {phase === 'loading' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-surface-container-low/90 backdrop-blur-sm">
          <div className="w-10 h-10 border-[3px] border-secondary border-t-transparent rounded-full animate-spin" />
          <p className="font-inter text-sm text-on-surface-variant">Carregando o mapa…</p>
        </div>
      )}

      {/* Estado: erro / timeout, com retry e fallback */}
      {phase === 'error' && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 bg-surface-container-low px-6 text-center">
          <div className="w-14 h-14 rounded-2xl bg-error-container flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-error" />
          </div>
          <div>
            <p className="font-manrope font-semibold text-primary mb-1">Não foi possível carregar o mapa</p>
            <p className="font-inter text-sm text-on-surface-variant max-w-xs">
              Pode ser uma conexão instável ou o serviço de mapas temporariamente fora do ar.
            </p>
          </div>
          <button
            onClick={retry}
            className="inline-flex items-center gap-2 bg-primary text-white font-inter font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary-container transition-colors"
          >
            <RotateCw className="w-4 h-4" /> Tentar novamente
          </button>
          <p className="inline-flex items-center gap-1.5 text-xs font-inter text-on-surface-variant">
            <MapPin className="w-3.5 h-3.5" /> Rosário da Limeira · Zona da Mata · MG
          </p>
        </div>
      )}
    </div>
  )
}
