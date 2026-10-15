'use client'

// ============================================================
// MisiApp — kerangka aplikasi 15 layar:
// splash pembuka, latar rumus melayang, header sticky (judul +
// progres + layar penuh), layar aktif, navigasi bawah
// (Kembali · Peta · Lanjut), dan toast.
// ============================================================

import { useEffect, useState } from 'react'
import { Toaster } from '@/components/ui/sonner'
import { useMLB } from '@/lib/mlb/store'
import { LAYAR } from '@/lib/mlb/data'
import { Tombol, TombolLayarPenuh, toggleLayarPenuhFS } from './bits'
import BackgroundRumus from './BackgroundRumus'
import SplashScreen from './SplashScreen'
import Layar0 from './layar/Layar0'
import Layar1 from './layar/Layar1'
import Layar2 from './layar/Layar2'
import Layar3 from './layar/Layar3'
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
  Layar0, Layar1, Layar2, Layar3, Layar5, Layar6, Layar7,
  Layar8, Layar9, Layar10, Layar11, Layar12, Layar13, Layar14, Layar15,
]

function Header({ layar, goto }: { layar: number; goto: (n: number) => void }) {
  const meta = LAYAR[layar]
  return (
    <header className="sticky top-0 z-40 bg-[#0D2440]/95 backdrop-blur text-white shadow-lg">
      <div className="w-full max-w-2xl lg:max-w-4xl mx-auto flex items-center gap-3 px-4 h-14">
        <span className="text-2xl" aria-hidden>🏀</span>
        <div className="min-w-0 flex-1">
          <p className="font-extrabold text-[14px] leading-tight truncate">Misi Lemparan Bebas</p>
          <p className="text-[12px] text-white/60 font-semibold leading-tight">
            {meta.judul} · Layar {layar + 1}/15
          </p>
        </div>
        <TombolLayarPenuh />
        <button
          onClick={() => goto(1)}
          className="rounded-full bg-white/10 ring-1 ring-white/25 px-3 h-9 text-[13.5px] font-extrabold hover:bg-white/20 transition-colors active:scale-95"
          aria-label="Buka Peta Alur"
        >
          🗺️ Peta
        </button>
      </div>
      <div className="h-1.5 bg-white/10" role="progressbar" aria-valuenow={layar + 1} aria-valuemin={1} aria-valuemax={15} aria-label="Progres misi">
        <div
          className="h-full bg-gradient-to-r from-[#FB923C] to-[#F97316] transition-all duration-300"
          style={{ width: `${((layar + 1) / 15) * 100}%` }}
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
      <div className="w-full max-w-2xl lg:max-w-4xl mx-auto grid grid-cols-[1fr_auto_1fr] items-center gap-2 p-3">
        <Tombol varian="lembut" className="w-full" onClick={() => goto(layar - 1)} disabled={layar <= 1}>
          ← Kembali
        </Tombol>
        <button
          onClick={() => goto(1)}
          aria-label="Buka Peta Alur"
          className="size-11 rounded-full bg-white/10 ring-1 ring-white/25 grid place-items-center text-xl hover:bg-white/20 transition-colors active:scale-95"
        >
          🗺️
        </button>
        <Tombol className="w-full" onClick={() => goto(layar >= 14 ? 1 : layar + 1)}>
          {layar >= 14 ? 'Peta 🗺️' : 'Lanjut →'}
        </Tombol>
      </div>
    </nav>
  )
}

export default function MisiApp() {
  const { s, goto, hydrated } = useMLB()
  const layar = s.layar

  // Splash pembuka: tampil sekali setiap halaman dibuka / di-refresh
  const [splash, setSplash] = useState(true)
  const [splashKeluar, setSplashKeluar] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setSplashKeluar(true), 1700)
    const t2 = setTimeout(() => setSplash(false), 2450)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  // Pintasan F untuk masuk/keluar layar penuh
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = e.target as HTMLElement | null
      if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return
      if (e.key === 'f' || e.key === 'F') toggleLayarPenuhFS()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  useEffect(() => {
    try { document.title = `${LAYAR[layar].judul} · Misi Lemparan Bebas` } catch { /* abaikan */ }
  }, [layar])

  const tampilSplash = splash || !hydrated
  const LayarAktif = SCREENS[layar] ?? Layar0

  return (
    <div
      className="mlb-app relative flex flex-col bg-[#0D2440]"
      style={{ minHeight: 'calc(100dvh / var(--mlb-zoom, 1))' }}
    >
      <BackgroundRumus />
      <Toaster position="top-center" richColors closeButton />

      {hydrated && layar > 0 && <Header layar={layar} goto={goto} />}

      {hydrated && layar === 0 && (
        <div className="fixed top-3 right-3 z-50">
          <TombolLayarPenuh denganLabel />
        </div>
      )}

      {hydrated && (
        <main key={layar} className="relative z-10 flex-1 w-full max-w-2xl lg:max-w-4xl mx-auto px-3 sm:px-5 pt-4 sm:pt-6 pb-32 animate-fadein">
          <LayarAktif />
        </main>
      )}

      {hydrated && layar > 0 && <NavigasiBawah layar={layar} goto={goto} />}

      {tampilSplash && <SplashScreen keluar={!hydrated ? false : splashKeluar} />}
    </div>
  )
}
