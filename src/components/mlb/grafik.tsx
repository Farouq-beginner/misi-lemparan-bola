'use client'

// ============================================================
// grafik — komponen SVG khusus Misi Lemparan Bebas.
// Grafik statis/ringan (pengganti GeoGebra tertanam); GeoGebra
// asli hanya dibuka lewat tombol tautan (src/config/links.ts).
// ============================================================

import React, { useState } from 'react'
import Graph, { curvePath } from './Graph'
import { CARDS, fxCard, fxVal, type CardId } from '@/lib/mlb/data'
import { fmt } from '@/lib/mlb/util'

const WARNA: Record<CardId, string> = { A: '#E8702A', B: '#3D6DB5', C: '#2E9E6B' }
// sampai-x tiap lintasan di Gambar 1 (A berhenti di ring)
const SAMPAI: Record<CardId, number> = { A: 5, B: 5.27, C: 6.9 }

// ------------------------------------------------------------
// Gambar 1 — tiga lemparan bebas + ring (5 ; 3). Dapat diketuk.
// ------------------------------------------------------------
export function SceneLemparan({ sorot, onSorot }: { sorot: CardId | null; onSorot: (k: CardId | null) => void }) {
  return (
    <Graph
      xMin={-0.7} xMax={7.6} yMin={-0.6} yMax={4.7} H={330}
      xLabel="x — jarak (m)" yLabel="y — tinggi (m)"
      ariaLabel="Gambar 1 — tiga lintasan lemparan bebas menuju ring di titik (5 ; 3)"
    >
      {m => (
        <>
          {/* zona ring 2,9–3,1 m */}
          <rect
            x={m.px(4.72)} y={m.py(3.1)} width={m.px(5.42) - m.px(4.72)} height={m.py(2.9) - m.py(3.1)}
            rx="4" fill="#F2B705" opacity="0.2" stroke="#F2B705" strokeWidth="1.5" strokeDasharray="5 4"
          />
          {/* tiang + papan pantul */}
          <line x1={m.px(5.62)} y1={m.py(0)} x2={m.px(5.62)} y2={m.py(3.9)} stroke="#8A94A6" strokeWidth="5" strokeLinecap="round" />
          <rect
            x={m.px(5.5)} y={m.py(4.15)} width={m.px(5.74) - m.px(5.5)} height={m.py(3.35) - m.py(4.15)}
            rx="2" fill="#EDF2F8" stroke="#8A94A6" strokeWidth="1.5"
          />
          {/* ring + jaring */}
          <line x1={m.px(4.98)} y1={m.py(3)} x2={m.px(5.5)} y2={m.py(3)} stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
          {[5.02, 5.12, 5.22, 5.32].map((x, i) => (
            <line key={i} x1={m.px(x)} y1={m.py(2.97)} x2={m.px(x + 0.045 * (4 - i))} y2={m.py(2.55)} stroke="#8A94A6" strokeWidth="1.3" opacity="0.7" />
          ))}
          <text x={m.px(5.02)} y={m.py(3.26)} fontSize="12.5" fontWeight="800" fill="#B45309">ring (5 ; 3)</text>
          {/* titik lepas */}
          <circle cx={m.px(0)} cy={m.py(2)} r="9" fill="#F97316" stroke="#17345A" strokeWidth="2.5" />
          <text x={m.px(0.1)} y={m.py(1.58)} fontSize="12.5" fontWeight="800" fill="#17345A">lepas (0 ; 2)</text>
          {/* tiga lintasan */}
          {(['A', 'B', 'C'] as const).map(k => {
            const c = CARDS[k]
            const aktif = sorot === k
            const op = sorot && !aktif ? 0.15 : 1
            return (
              <g key={k} onPointerDown={() => onSorot(aktif ? null : k)} style={{ cursor: 'pointer' }}>
                <path
                  d={curvePath(x => fxCard(c, x), m, 0, SAMPAI[k])}
                  fill="none" stroke={WARNA[k]} strokeWidth={aktif ? 7 : 4.5} opacity={op} strokeLinecap="round"
                />
                <circle cx={m.px(c.peak.x)} cy={m.py(c.peak.y)} r={aktif ? 9 : 7} fill={aktif ? WARNA[k] : '#FFFDF9'} stroke={WARNA[k]} strokeWidth="3" opacity={op} />
                <text
                  x={m.px(c.peak.x)} y={m.py(c.peak.y) - 13} fontSize={aktif ? 14 : 12.5} fontWeight="900"
                  fill={WARNA[k]} textAnchor="middle" opacity={op}
                >
                  {aktif ? `Lemparan ${k}` : k}
                </text>
              </g>
            )
          })}
        </>
      )}
    </Graph>
  )
}

// ------------------------------------------------------------
// Mini grafik statis satu fungsi + pembanding y = x² (layar 6)
// ------------------------------------------------------------
export function MiniKurva({ a, p, q, bandingkan = false }: { a: number; p: number; q: number; bandingkan?: boolean }) {
  return (
    <Graph
      xMin={-1.5} xMax={7.5} yMin={-2} yMax={9.5} H={300}
      xLabel="x" yLabel="y"
      ariaLabel={`Grafik statis fungsi kuadrat dengan puncak (${p} ; ${q})${a < 0 ? ', terbuka ke bawah' : ', terbuka ke atas'}`}
    >
      {m => (
        <>
          {bandingkan && <path d={curvePath(x => x * x, m)} fill="none" stroke="#8A94A6" strokeWidth="2.5" strokeDasharray="7 6" opacity="0.55" />}
          <path d={curvePath(x => fxVal({ a, p, q }, x), m)} fill="none" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
          <line x1={m.px(p)} y1={m.py(q)} x2={m.px(p)} y2={m.py(0)} stroke="#8A94A6" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1={m.px(p)} y1={m.py(q)} x2={m.px(0)} y2={m.py(q)} stroke="#8A94A6" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx={m.px(p)} cy={m.py(q)} r="8" fill="#F97316" stroke="#17345A" strokeWidth="2.5" />
          <text x={m.px(p)} y={m.py(q) - 14} fontSize="13" fontWeight="900" fill="#17345A" textAnchor="middle">
            puncak ({fmt(p)} ; {fmt(q)})
          </text>
          {bandingkan && <text x={m.px(6.6)} y={m.py(6.2)} fontSize="12" fontWeight="700" fill="#8A94A6">y = x²</text>}
        </>
      )}
    </Graph>
  )
}

// ------------------------------------------------------------
// Grid plot — ketuk kolom x untuk memplot titik kartu (layar 8)
// ------------------------------------------------------------
export function GridTap({
  points, terplot, onTap, flash, warna = '#E8702A',
}: {
  points: { x: number; y: number }[]
  terplot: number[]
  onTap: (x: number) => void
  flash: number | null
  warna?: string
}) {
  return (
    <Graph
      xMin={-0.7} xMax={7.6} yMin={-0.7} yMax={5} H={340}
      xLabel="x (m)" yLabel="y (m)"
      ariaLabel="Bidang koordinat — ketuk kolom untuk memplot titik data kartumu"
    >
      {m => (
        <>
          {/* penanda ring */}
          <circle cx={m.px(5)} cy={m.py(3)} r="11" fill="none" stroke="#F2B705" strokeWidth="2.5" strokeDasharray="5 4" />
          <text x={m.px(5) + 15} y={m.py(3) - 12} fontSize="12" fontWeight="800" fill="#B98900">ring (5 ; 3)</text>
          {/* kilatan kolom salah */}
          {flash !== null && (
            <rect x={m.px(flash - 0.5)} y={0} width={m.px(flash + 0.5) - m.px(flash - 0.5)} height={m.H} fill="#D1495B" opacity="0.16" />
          )}
          {/* titik terplot */}
          {points.filter(p => terplot.includes(p.x)).map(p => (
            <g key={`p${p.x}`}>
              <circle cx={m.px(p.x)} cy={m.py(p.y)} r="9" fill={warna} stroke="#17345A" strokeWidth="2.5" />
              <text x={m.px(p.x)} y={m.py(p.y) - 15} fontSize="12.5" fontWeight="800" fill="#17345A" textAnchor="middle">
                ({p.x} ; {fmt(p.y)})
              </text>
            </g>
          ))}
          {/* area ketuk per kolom */}
          {[0, 1, 2, 3, 4, 5, 6, 7].map(x => (
            <rect
              key={`tap${x}`}
              x={m.px(x - 0.5)} y={0} width={m.px(x + 0.5) - m.px(x - 0.5)} height={m.H}
              fill="transparent" style={{ cursor: 'pointer' }}
              onPointerDown={e => { e.preventDefault(); onTap(x) }}
            >
              <title>{`Ketuk untuk kolom x = ${x}`}</title>
            </rect>
          ))}
        </>
      )}
    </Graph>
  )
}

// ------------------------------------------------------------
// Anatomi parabola f(x) = a(x − p)² + q (layar 7 & 13)
// ------------------------------------------------------------
export function AnatomiParabola({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 380 244" className={className} role="img" aria-label="Anatomi parabola f(x) = a(x − p)² + q">
      {/* sumbu */}
      <line x1="30" y1="205" x2="360" y2="205" stroke="#8A94A6" strokeWidth="2" />
      <line x1="30" y1="205" x2="30" y2="22" stroke="#8A94A6" strokeWidth="2" />
      <text x="352" y="222" fontSize="13" fontWeight="800" fill="#8A94A6">x</text>
      <text x="14" y="30" fontSize="13" fontWeight="800" fill="#8A94A6">y</text>
      {/* panah geser kanan p */}
      <line x1="34" y1="226" x2="168" y2="226" stroke="#3D6DB5" strokeWidth="3" />
      <polygon points="168,220 180,226 168,232" fill="#3D6DB5" />
      <text x="104" y="240" fontSize="12" fontWeight="800" fill="#3D6DB5" textAnchor="middle">geser kanan p</text>
      {/* panah geser atas q */}
      <line x1="190" y1="201" x2="190" y2="126" stroke="#2E9E6B" strokeWidth="3" />
      <polygon points="184,126 190,114 196,126" fill="#2E9E6B" />
      <text x="200" y="168" fontSize="12" fontWeight="800" fill="#2E9E6B">geser atas q</text>
      {/* parabola terbuka ke bawah */}
      <path d="M 60,205 Q 190,15 320,205" fill="none" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
      {/* sumbu simetri */}
      <line x1="190" y1="112" x2="190" y2="205" stroke="#8A94A6" strokeWidth="2" strokeDasharray="6 5" />
      <text x="190" y="199" fontSize="12" fontWeight="700" fill="#6B7A90" textAnchor="middle">x = p (sumbu simetri)</text>
      {/* puncak */}
      <circle cx="190" cy="112" r="8" fill="#F97316" stroke="#7C2D12" strokeWidth="2" />
      <text x="190" y="94" fontSize="13.5" fontWeight="900" fill="#17345A" textAnchor="middle">puncak (p ; q)</text>
      {/* arah buka */}
      <text x="54" y="188" fontSize="22" fill="#F97316" fontWeight="900">↘</text>
      <text x="306" y="188" fontSize="22" fill="#F97316" fontWeight="900">↙</text>
      {/* keterangan arah buka — diberi jarak kiri/kanan agar tidak tumpang tindih */}
      <text x="34" y="18" fontSize="12" fontWeight="800" fill="#1F7A4D" textAnchor="start">ke atas bila a &gt; 0</text>
      <text x="346" y="18" fontSize="12" fontWeight="800" fill="#B45309" textAnchor="end">terbuka ke bawah bila a &lt; 0</text>
    </svg>
  )
}

// ------------------------------------------------------------
// Animasi bola masuk ring untuk sampul (CSS/SVG ringan)
// ------------------------------------------------------------
export function AnimasiBola({ className }: { className?: string }) {
  const [go] = useState(true)
  return (
    <svg viewBox="0 0 420 250" className={className} role="img" aria-label="Animasi bola basket memasuki ring">
      {/* lantai lapangan */}
      <line x1="0" y1="222" x2="420" y2="222" stroke="#3A5F8F" strokeWidth="3" strokeLinecap="round" />
      {[30, 90, 150, 210, 270, 330, 390].map(x => (
        <line key={x} x1={x} y1="222" x2={x - 12} y2="233" stroke="#3A5F8F" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
      ))}
      {/* tiang & papan pantul */}
      <rect x="392" y="60" width="7" height="162" rx="3" fill="#3A5F8F" />
      <rect x="368" y="52" width="12" height="84" rx="3" fill="#E8EEF6" stroke="#9DB4CE" strokeWidth="2" />
      <rect x="371" y="90" width="6" height="16" fill="#C3D2E4" />
      {/* bola (di bawah ring & jaring agar terlihat masuk) */}
      {go && (
        <g>
          <circle r="14" fill="#F97316" stroke="#7C2D12" strokeWidth="2.5" />
          <line x1="-14" y1="0" x2="14" y2="0" stroke="#7C2D12" strokeWidth="1.8" />
          <path d="M0,-14 C 6,-5 6,5 0,14" fill="none" stroke="#7C2D12" strokeWidth="1.8" />
          <path d="M-11,-8 C -4,-2 -4,2 -11,8" fill="none" stroke="#7C2D12" strokeWidth="1.8" />
          <path d="M11,-8 C 4,-2 4,2 11,8" fill="none" stroke="#7C2D12" strokeWidth="1.8" />
          <animateMotion dur="2.8s" repeatCount="indefinite" path="M 45,205 C 130,40 260,8 352,90 C 356,116 354,150 352,198" />
        </g>
      )}
      {/* ring + jaring */}
      <line x1="330" y1="98" x2="370" y2="98" stroke="#F97316" strokeWidth="5" strokeLinecap="round" />
      {[335, 344, 353, 362].map((x, i) => (
        <line key={i} x1={x} y1="101" x2={x + 5} y2="128" stroke="#E8EEF6" strokeWidth="1.6" opacity="0.85" />
      ))}
      {[335, 344, 353, 362].map((x, i) => (
        <line key={`h${i}`} x1={x + 5} y1="107" x2={x} y2="119" stroke="#E8EEF6" strokeWidth="1.2" opacity="0.55" />
      ))}
    </svg>
  )
}
