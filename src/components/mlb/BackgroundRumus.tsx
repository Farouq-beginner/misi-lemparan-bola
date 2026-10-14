'use client'

// ============================================================
// BackgroundRumus — lapisan hias di latar berisi rumus & kurva
// matematika yang melayang naik-turun (bergoyang). Tujuannya
// agar layar lebar tidak terlihat kosong dan lebih menarik.
// Murni dekorasi: pointer-events-none + aria-hidden.
// ============================================================

import React from 'react'

type Hias = {
  t: string
  pos: string
  rot: number
  dur: string
  delay: string
  warna: string
  ukuran: string
}

const WARNA_LABEL = {
  putih: 'text-white/[0.09]',
  oranye: 'text-[#FDBA74]/[0.14]',
  biru: 'text-[#8FC7FF]/[0.12]',
  hijau: 'text-[#8FE0B8]/[0.12]',
} as const

// Kolom kiri & kanan masing-masing punya 4 "slot" vertikal agar
// rumus tidak saling menumpuk meski sedang bergoyang.
const RUMUS: Hias[] = [
  { t: 'y = ax² + bx + c', pos: 'left-[1.5%] top-[11%]', rot: -8, dur: '7s', delay: '0s', warna: WARNA_LABEL.putih, ukuran: 'text-3xl lg:text-4xl' },
  { t: '(x − p)²  +  q', pos: 'left-[3%] top-[30%]', rot: 11, dur: '9s', delay: '1s', warna: WARNA_LABEL.hijau, ukuran: 'text-xl lg:text-3xl' },
  { t: 'a > 0  ∪   ·   a < 0  ∩', pos: 'left-[1%] top-[51%]', rot: -6, dur: '10s', delay: '0.2s', warna: WARNA_LABEL.oranye, ukuran: 'text-xl lg:text-3xl' },
  { t: 'Δ = b² − 4ac', pos: 'left-[2%] top-[73%]', rot: 6, dur: '8s', delay: '1.4s', warna: WARNA_LABEL.biru, ukuran: 'text-3xl lg:text-4xl' },

  { t: 'f(x) = a(x − p)² + q', pos: 'right-[1%] top-[12%]', rot: 7, dur: '9.5s', delay: '0.8s', warna: WARNA_LABEL.oranye, ukuran: 'text-2xl lg:text-4xl' },
  { t: 'x = p', pos: 'right-[3%] top-[33%]', rot: -10, dur: '7.5s', delay: '0.4s', warna: WARNA_LABEL.hijau, ukuran: 'text-3xl lg:text-4xl' },
  { t: 'puncak (p ; q)', pos: 'right-[2%] top-[54%]', rot: -5, dur: '8.2s', delay: '0.6s', warna: WARNA_LABEL.putih, ukuran: 'text-[17.5px] lg:text-2xl' },
  { t: 'y = x²', pos: 'right-[3%] top-[75%]', rot: 9, dur: '8.5s', delay: '1.1s', warna: WARNA_LABEL.putih, ukuran: 'text-4xl lg:text-5xl' },
]

/** Kurva parabola samar yang ikut mengapung */
function KurvaHias({ warna, className, dur, delay }: { warna: string; className: string; dur: string; delay: string }) {
  return (
    <div className={className} style={{ '--dur': dur, animationDelay: delay } as React.CSSProperties}>
      <svg viewBox="0 0 200 120" className="animate-drift w-full h-full" aria-hidden>
        <path d="M10 112 Q100 -8 190 112" fill="none" stroke={warna} strokeWidth="3" strokeLinecap="round" />
        <line x1="100" y1="6" x2="100" y2="112" stroke={warna} strokeWidth="1.6" strokeDasharray="6 6" />
      </svg>
    </div>
  )
}

export default function BackgroundRumus() {
  return (
    <div className="pointer-events-none select-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      {/* aura lembut */}
      <div className="absolute -left-32 -top-24 size-[36rem] rounded-full bg-[#F97316]/10 blur-3xl" />
      <div className="absolute -right-32 top-1/3 size-[32rem] rounded-full bg-[#3B82F6]/10 blur-3xl" />

      {/* kurva parabola yang mengapung (di tengah, sebagian tertutup konten) */}
      <KurvaHias warna="rgba(253,186,116,0.13)" className="absolute left-[38%] -top-6 w-52 lg:w-80" dur="13s" delay="0.5s" />
      <KurvaHias warna="rgba(143,199,255,0.12)" className="absolute left-[36%] bottom-[2%] w-48 lg:w-72" dur="15s" delay="1.2s" />
      <KurvaHias warna="rgba(255,255,255,0.07)" className="absolute right-[26%] top-[42%] w-40 lg:w-64" dur="11s" delay="0s" />

      {/* rumus-rumus yang bergoyang naik-turun */}
      {RUMUS.map(r => (
        <span
          key={r.t}
          className={`absolute font-black italic whitespace-nowrap ${r.pos} ${r.ukuran} ${r.warna}`}
          style={{ rotate: `${r.rot}deg` }}
        >
          <span className="animate-float block" style={{ '--dur': r.dur, animationDelay: r.delay } as React.CSSProperties}>
            {r.t}
          </span>
        </span>
      ))}
    </div>
  )
}
