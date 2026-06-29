'use client'
import { useEffect, useRef } from 'react'

// Animação de folhas caindo — canvas 2D, sem dependências externas
// Performance: requestAnimationFrame + canvas offscreen, sem DOM por folha
// Quantidade reduzida para não poluir visualmente

interface Leaf {
  x: number
  y: number
  size: number
  speedY: number
  speedX: number
  rotation: number
  rotSpeed: number
  opacity: number
  color: string
  shape: number // 0=oval, 1=lanceolada, 2=redonda
}

const COLORS = [
  'rgba(191,231,203,COLOR)', // menta
  'rgba(123,179,139,COLOR)', // musgo
  'rgba(47,143,88,COLOR)',   // samambaia
  'rgba(140,203,78,COLOR)',  // seiva/lima
  'rgba(12,50,32,COLOR)',    // canopy
]

const LEAF_COUNT = 18

function makeLeaf(canvasW: number, canvasH: number): Leaf {
  const color = COLORS[Math.floor(Math.random() * COLORS.length)]
  return {
    x: Math.random() * canvasW,
    y: -20 - Math.random() * canvasH * 0.5,
    size: 6 + Math.random() * 10,
    speedY: 0.4 + Math.random() * 0.8,
    speedX: (Math.random() - 0.5) * 0.6,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.025,
    opacity: 0.25 + Math.random() * 0.45,
    color,
    shape: Math.floor(Math.random() * 3),
  }
}

function drawLeaf(ctx: CanvasRenderingContext2D, leaf: Leaf) {
  ctx.save()
  ctx.translate(leaf.x, leaf.y)
  ctx.rotate(leaf.rotation)

  const alpha = leaf.opacity
  const c = leaf.color.replace('COLOR', String(alpha))
  ctx.fillStyle = c

  ctx.beginPath()
  if (leaf.shape === 0) {
    // Oval
    ctx.ellipse(0, 0, leaf.size * 0.5, leaf.size, 0, 0, Math.PI * 2)
  } else if (leaf.shape === 1) {
    // Lanceolada (ponta fina)
    ctx.moveTo(0, -leaf.size)
    ctx.bezierCurveTo(leaf.size * 0.6, -leaf.size * 0.3, leaf.size * 0.6, leaf.size * 0.3, 0, leaf.size)
    ctx.bezierCurveTo(-leaf.size * 0.6, leaf.size * 0.3, -leaf.size * 0.6, -leaf.size * 0.3, 0, -leaf.size)
  } else {
    // Redonda com pequena saliência
    ctx.arc(0, 0, leaf.size * 0.6, 0, Math.PI * 2)
  }
  ctx.fill()

  // Nervura central sutil
  ctx.strokeStyle = c.replace(String(alpha), String(alpha * 0.4))
  ctx.lineWidth = 0.5
  ctx.beginPath()
  ctx.moveTo(0, -leaf.size * 0.7)
  ctx.lineTo(0, leaf.size * 0.7)
  ctx.stroke()

  ctx.restore()
}

export function FallingLeaves() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let leaves: Leaf[] = []
    let W = 0
    let H = 0

    function resize() {
      W = canvas.offsetWidth
      H = canvas.offsetHeight
      canvas.width = W
      canvas.height = H
      // Reinicializa folhas respeitando novo tamanho
      leaves = Array.from({ length: LEAF_COUNT }, () => makeLeaf(W, H))
    }

    function tick() {
      ctx.clearRect(0, 0, W, H)

      leaves.forEach((leaf, i) => {
        // Movimento ondulante suave (lissajous simples)
        leaf.x += leaf.speedX + Math.sin(leaf.y * 0.012 + i) * 0.35
        leaf.y += leaf.speedY
        leaf.rotation += leaf.rotSpeed

        // Reseta ao sair pela base
        if (leaf.y > H + 30) {
          leaves[i] = makeLeaf(W, H)
          leaves[i].y = -20
        }
        // Corrige laterais
        if (leaf.x < -30) leaf.x = W + 20
        if (leaf.x > W + 30) leaf.x = -20

        drawLeaf(ctx, leaf)
      })

      animId = requestAnimationFrame(tick)
    }

    resize()
    animId = requestAnimationFrame(tick)

    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    return () => {
      cancelAnimationFrame(animId)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-10 w-full h-full pointer-events-none"
      aria-hidden="true"
    />
  )
}
