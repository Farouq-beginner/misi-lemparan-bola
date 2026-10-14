'use client'

// ============================================================
// MisiApp — kerangka aplikasi 16 layar:
// header sticky (judul + progres), layar aktif, navigasi bawah
// (Kembali · Peta · Lanjut), dan toast.
// ============================================================

import { useEffect } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { useMLB } from '@/lib/mlb/store'
import { LAYAR } from '@/lib/mlb/data'
import { Tombol } from './bits'
import Layar0 from './layar/Layar0'
import Layar1 from './layar/Layar1'
import Layar2 from './layar/Layar2'
import Layar3 from './layar/Layar3'
import Layar4 from './layar/Layar4'
import Layar5 from './layar/Layar5'
import Layar6 from './layar/Layar6'
import Layar7 from './layar/Layar7'
import Layar8 from './layar/Layar8'
import Layar9 from './layar/Layar9'
import Layar10 from './layar/Layar10'
import Layar11 from './layar/Layar11'
import Layar12 from './layar/Layar12'
import Layar13 from './layar/Layar13'
import Layar14 from './layar/Layar14'
import Layar15 from './layar/Layar15'

const SCREENS = [
  Layar0, Layar1, Layar2, Layar3, Layar4, Layar5, Layar6, Layar7,
  Layar8, Layar9, Layar10, Layar11, Layar12, Layar13, Layar14, Layar15,
]

function Header({ layar, goto }: { layar: number; goto: (n: number) => void }) {
  const meta = LAYAR[layar]
  return (
    <header className="sticky top-0 z-40 bg-[#0D2440]/95 backdrop-blur text-white shadow-lg">
      <div className="max-w-2xl mx-auto flex items-center gap-3 px-4 h-14">
        <span className="text-xl" aria-hidden>🏀</span>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-[13.5px] leading-tight truncate">Misi Lemparan Bebas</p>
          <p className="text-[11px] text-white/60 font-semibold leading-tight">
            {meta.judul} · Layar {layar + 1}/16
          </p>
        </div>
        <button
          onClick={() => goto(1)}
          className="rounded-full bg-white/10 ring-1 ring-white/25 px-3.5 h-9 text-[13px] font-extrabold hover:bg-white/20 transition-colors active:scale-95"
          aria-label="Buka Peta Alur"
        >
          🗺️ Peta
        </button>
      </div>
      <div className="h-1.5 bg-white/10" role="progressbar" aria-valuenow={layar + 1} aria-valuemin={1} aria-valuemax={16} aria-label="Progres misi">
        <div
          className="h-full bg-gradient-to-r from-[#FB923C] to-[#F97316] transition-all duration-300"
          style={{ width: `${((layar + 1) / 16) * 100}%` }}
        />
      </div>
    </header>
  )
}

function NavigasiBawah({ layar, goto }: { layar: number; goto: (n: number) => void }) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-40 bg-[#0D2440]/95 backdrop-blur border-t border-white/10 shadow-2xl shadow-black/40"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Navigasi layar"
    >
      <div className="max-w-2xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-3">
        <Tombol varian="lembut" className="w-full" onClick={() => goto(layar - 1)} disabled={layar <= 1}>
          ← Kembali
        </Tombol>
        <button
          onClick={() => goto(1)}
          aria-label="Buka Peta Alur"
          className="size-11 rounded-full bg-white/10 ring-1 ring-white/25 grid place-items-center text-lg hover:bg-white/20 transition-colors active:scale-95"
        >
          🗺️
        </button>
        <Tombol className="w-full" onClick={() => goto(layar >= 15 ? 1 : layar + 1)}>
          {layar >= 15 ? 'Peta 🗺️' : 'Lanjut →'}
        </Tombol>
      </div>
    </nav>
  )
}

export default function MisiApp() {
  const { s, goto, hydrated } = useMLB()
  const layar = s.layar

  useEffect(() => {
    try { document.title = `${LAYAR[layar].judul} · Misi Lemparan Bebas` } catch { /* abaikan */ }
  }, [layar])

  if (!hydrated) {
    return (
      <div className="min-h-dvh grid place-items-center bg-[#0D2440]">
        <span className="text-5xl animate-bounce-soft" role="img" aria-label="Memuat misi">🏀</span>
      </div>
    )
  }

  const LayarAktif = SCREENS[layar] ?? Layar0

  return (
    <div className="min-h-dvh flex flex-col bg-[#0D2440]">
      <Toaster position="top-center" richColors closeButton />
      {layar > 0 && <Header layar={layar} goto={goto} />}
      <main key={layar} className="flex-1 w-full max-w-2xl mx-auto px-3 sm:px-5 pt-4 sm:pt-6 pb-32 animate-fadein">
        <LayarAktif />
      </main>
      {layar > 0 && <NavigasiBawah layar={layar} goto={goto} />}
    </div>
  )
}
