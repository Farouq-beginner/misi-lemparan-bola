'use client'

// ============================================================
// Graph — kanvas koordinat SVG bersama untuk semua applet.
// Ringan, tanpa dependensi eksternal (pengganti andalan GeoGebra
// agar tetap jalan walau tanpa internet).
// ============================================================

import React, { useMemo, useRef } from 'react'

export const NAVY = '#1F3A5F'
export const ORANGE = '#E8702A'
export const GREEN = '#2E9E6B'
export const YELLOW = '#F2B705'
export const RED = '#D1495B'
export const GRAY = '#8A94A6'
export const CREAM = '#FFF8EF'
export const GRID = '#EFE3D0'

export interface Mapper {
  W: number
  H: number
  xMin: number
  xMax: number
  yMin: number
  yMax: number
  px: (x: number) => number
  py: (y: number) => number
  toMath: (clientX: number, clientY: number, rect: DOMRect) => { x: number; y: number }
}

export interface GraphProps {
  xMin?: number
  xMax?: number
  yMin?: number
  yMax?: number
  H?: number
  xLabel?: string
  yLabel?: string
  className?: string
  children?: (m: Mapper) => React.ReactNode
  svgRef?: React.RefObject<SVGSVGElement | null>
  onPointerDown?: (e: React.PointerEvent<SVGSVGElement>, m: Mapper) => void
  onPointerMove?: (e: React.PointerEvent<SVGSVGElement>, m: Mapper) => void
  onPointerUp?: (e: React.PointerEvent<SVGSVGElement>, m: Mapper) => void
  ariaLabel?: string
}

export default function Graph({
  xMin = -1, xMax = 7, yMin = -1, yMax = 6,
  H = 480, xLabel, yLabel, className, children,
  svgRef, onPointerDown, onPointerMove, onPointerUp,
  ariaLabel = 'Grafik koordinat',
}: GraphProps) {
  const W = 640
  const localRef = useRef<SVGSVGElement | null>(null)
  const ref = svgRef ?? localRef

  const m: Mapper = useMemo(() => {
    const px = (x: number) => ((x - xMin) / (xMax - xMin)) * W
    const py = (y: number) => H - ((y - yMin) / (yMax - yMin)) * H
    return {
      W, H, xMin, xMax, yMin, yMax, px, py,
      toMath: (clientX, clientY, rect) => ({
        x: xMin + ((clientX - rect.left) / rect.width) * (xMax - xMin),
        y: yMax - ((clientY - rect.top) / rect.height) * (yMax - yMin),
      }),
    }
  }, [xMin, xMax, yMin, yMax, H])

  const tickStep = (range: number) => (range > 9 ? 2 : range > 5 ? 1 : 0.5)

  const handleDown = (e: React.PointerEvent<SVGSVGElement>) => {
    onPointerDown?.(e, m)
  }
  const handleMove = (e: React.PointerEvent<SVGSVGElement>) => {
    onPointerMove?.(e, m)
  }
  const handleUp = (e: React.PointerEvent<SVGSVGElement>) => {
    onPointerUp?.(e, m)
  }

  const xTicks: number[] = []
  for (let v = Math.ceil(xMin / tickStep(xMax - xMin)) * tickStep(xMax - xMin); v <= xMax + 1e-9; v += tickStep(xMax - xMin)) xTicks.push(Math.round(v * 10) / 10)
  const yTicks: number[] = []
  for (let v = Math.ceil(yMin / tickStep(yMax - yMin)) * tickStep(yMax - yMin); v <= yMax + 1e-9; v += tickStep(yMax - yMin)) yTicks.push(Math.round(v * 10) / 10)

  const axisY = Math.min(Math.max(0, yMin), yMax) // posisi sumbu-x
  const axisX = Math.min(Math.max(0, xMin), xMax) // posisi sumbu-y

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className={`w-full h-auto select-none touch-none rounded-2xl ${className ?? ''}`}
      role="img"
      aria-label={ariaLabel}
      onPointerDown={handleDown}
      onPointerMove={handleMove}
      onPointerUp={handleUp}
      onPointerLeave={handleUp}
      onPointerCancel={handleUp}
    >
      <rect x={0} y={0} width={W} height={H} rx={16} fill="#FFFDF9" />
      {/* grid */}
      {xTicks.map(v => (
        <line key={`gx${v}`} x1={m.px(v)} y1={0} x2={m.px(v)} y2={H} stroke={GRID} strokeWidth={1} />
      ))}
      {yTicks.map(v => (
        <line key={`gy${v}`} x1={0} y1={m.py(v)} x2={W} y2={m.py(v)} stroke={GRID} strokeWidth={1} />
      ))}
      {/* sumbu */}
      <line x1={0} y1={m.py(axisY)} x2={W} y2={m.py(axisY)} stroke={NAVY} strokeWidth={2} />
      <line x1={m.px(axisX)} y1={0} x2={m.px(axisX)} y2={H} stroke={NAVY} strokeWidth={2} />
      {/* label angka */}
      {xTicks.map(v => (
        <text key={`tx${v}`} x={m.px(v)} y={Math.min(H - 6, m.py(axisY) + 16)} textAnchor="middle" fontSize={13} fill={NAVY} opacity={0.75}>
          {v === 0 ? '' : v}
        </text>
      ))}
      {yTicks.map(v => (
        <text key={`ty${v}`} x={Math.max(4, m.px(axisX) - 8)} y={m.py(v) + 4} textAnchor="end" fontSize={13} fill={NAVY} opacity={0.75}>
          {v === 0 ? '' : v}
        </text>
      ))}
      {/* label sumbu */}
      {xLabel && (
        <text x={W - 8} y={m.py(axisY) - 10} textAnchor="end" fontSize={14} fill={NAVY} opacity={0.9} fontWeight={700}>
          {xLabel}
        </text>
      )}
      {yLabel && (
        <text x={10} y={18} textAnchor="start" fontSize={14} fill={NAVY} opacity={0.9} fontWeight={700}>
          {yLabel}
        </text>
      )}
      {children?.(m)}
    </svg>
  )
}

/** Path kurva y=f(x) dengan pemenggalan segmen di luar jangkauan */
export function curvePath(f: (x: number) => number, m: Mapper, from?: number, to?: number): string {
  const a = from ?? m.xMin
  const b = to ?? m.xMax
  const N = 260
  const lo = m.yMin - 1
  const hi = m.yMax + 1
  let d = ''
  let pen = false
  for (let i = 0; i <= N; i++) {
    const x = a + ((b - a) * i) / N
    const y = f(x)
    if (!isFinite(y) || y < lo || y > hi) {
      pen = false
      continue
    }
    const X = m.px(x).toFixed(2)
    const Y = m.py(y).toFixed(2)
    d += `${pen ? 'L' : 'M'}${X},${Y}`
    pen = true
  }
  return d
}

/** Titik data dengan bentuk (lingkaran / kotak / segitiga) */
export function DataPoint({
  m, x, y, color, shape = 'circle', r = 9, filled = true, opacity = 1, label, labelDx = 12, labelDy = -10,
  onPointerDown, cursor = 'pointer',
}: {
  m: Mapper
  x: number
  y: number
  color: string
  shape?: 'circle' | 'square' | 'triangle'
  r?: number
  filled?: boolean
  opacity?: number
  label?: string
  labelDx?: number
  labelDy?: number
  onPointerDown?: (e: React.PointerEvent) => void
  cursor?: string
}) {
  const cx = m.px(x)
  const cy = m.py(y)
  const common = {
    fill: filled ? color : '#FFFDF9',
    stroke: color,
    strokeWidth: Math.max(2.5, r / 3),
    opacity,
    onPointerDown,
    style: { cursor },
  }
  let node: React.ReactNode
  if (shape === 'square') {
    const s = r * 1.55
    node = <rect x={cx - s / 2} y={cy - s / 2} width={s} height={s} rx={2.5} {...common} transform={`rotate(45 ${cx} ${cy})`} />
  } else if (shape === 'triangle') {
    const s = r * 1.9
    node = <polygon points={`${cx},${cy - s / 1.45} ${cx - s / 1.7},${cy + s / 2.6} ${cx + s / 1.7},${cy + s / 2.6}`} {...common} strokeLinejoin="round" />
  } else {
    node = <circle cx={cx} cy={cy} r={r} {...common} />
  }
  return (
    <g>
      {node}
      {label && (
        <text x={cx + labelDx} y={cy + labelDy} fontSize={13.5} fontWeight={700} fill={color} style={{ pointerEvents: 'none' }}>
          {label}
        </text>
      )}
    </g>
  )
}
