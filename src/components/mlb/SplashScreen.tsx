'use client'

// ============================================================
// SplashScreen — layar pembuka penuh layar. Muncul saat pertama
// dibuka dan setiap kali halaman di-refresh, lalu memudar.
// ============================================================

import React from 'react'
import { PENYUSUN } from '@/config/links'

const RUMUS_SPLASH = [
  { t: 'y = ax² + bx + c', pos: 'left-[4%] top-[16%]', rot: -8, dur: '7s', delay: '0s' },
  { t: 'f(x) = a(x − p)² + q', pos: 'right-[4%] top-[20%]', rot: 7, dur: '9s', delay: '0.7s' },
  { t: 'Δ = b² − 4ac', pos: 'left-[6%] bottom-[20%]', rot: 6, dur: '8s', delay: '1.2s' },
  { t: 'x = p', pos: 'right-[7%] bottom-[24%]', rot: -9, dur: '7.5s', delay: '0.3s' },
  { t: 'y = x²', pos: 'left-[16%] top-[58%]', rot: 10, dur: '9.5s', delay: '1s' },
  { t: 'f(5) = 3', pos: 'right-[14%] top-[60%]', rot: -6, dur: '8.5s', delay: '0.5s' },
]

export default function SplashScreen({ keluar }: { keluar: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-[100] grid place-items-center overflow-hidden transition-opacity duration-700 ${
        keluar ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{ background: 'radial-gradient(900px 500px at 50% -10%, rgba(249,115,22,0.28), transparent 62%), linear-gradient(165deg, #0B2136 0%, #123458 55%, #1A4570 100%)' }}
      role="status"
      aria-live="polite"
      aria-label="Memuat Misi Lemparan Bebas"
    >
      {/* rumus yang bergoyang di latar splash */}
      <div className="pointer-events-none select-none absolute inset-0" aria-hidden>
        {RUMUS_SPLASH.map(r => (
          <span
            key={r.t}
            className={`absolute font-black italic whitespace-nowrap text-white/[0.10] text-xl sm:text-3xl lg:text-4xl ${r.pos}`}
            style={{ rotate: `${r.rot}deg` }}
          >
            <span className="animate-float block" style={{ '--dur': r.dur, animationDelay: r.delay } as React.CSSProperties}>
              {r.t}
            </span>
          </span>
        ))}
      </div>

      <div className="relative flex flex-col items-center text-center gap-5 px-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur px-3.5 py-1.5 text-[13.5px] sm:text-[16px] font-bold">
          🏀 Matematika · Fungsi Kuadrat
        </span>

        {/* bola memantul */}
        <div className="relative grid place-items-center size-28 sm:size-36">
          <span className="absolute inset-0 rounded-full bg-[#F97316]/25 blur-2xl" />
          <span className="animate-bounce-soft text-6xl sm:text-7xl drop-shadow-2xl" role="img" aria-label="Bola basket">
            🏀
          </span>
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-lg">
          Misi <span className="text-[#FDBA74]">Lemparan Bebas</span>
        </h1>

        <p className="text-white/75 text-[16px] sm:text-xl font-semibold max-w-md leading-relaxed">
          Menyiapkan 16 layar petualangan fungsi kuadrat…
        </p>

        {/* bilah memuat */}
        <div className="w-56 sm:w-72 h-2.5 rounded-full bg-white/15 overflow-hidden ring-1 ring-white/15">
          <div className="h-full rounded-full bg-gradient-to-r from-[#FB923C] to-[#F97316] animate-muat" />
        </div>

        <p className="mt-1 rounded-full bg-white/10 px-4 py-1.5 text-[13.5px] sm:text-[16px] font-extrabold text-[#FFE4C7] ring-1 ring-white/20 backdrop-blur-sm">
          Penyusun: {PENYUSUN}
        </p>
      </div>
    </div>
  )
}
