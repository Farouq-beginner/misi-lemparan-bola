'use client'

// ============================================================
// State global Misi Lemparan Bebas (16 layar) + persistensi
// localStorage + navigasi hash (#/layar-N) agar tombol back
// browser tetap berfungsi dan posisi layar terakhir diingat.
// Semua akses localStorage dibungkus try/catch — bila gagal,
// web tetap jalan tanpa menyimpan.
// ============================================================

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import type { CardId } from './data'

export interface Tebakan {
  p: string
  q: string
  arah: '' | 'atas' | 'bawah'
}

export interface Cek3 {
  f5: string
  keputusan: '' | 'masuk' | 'tidak'
  dicek: boolean
}

// Jawaban yang khusus dimiliki satu kartu data (A/B/C).
// Dipisah per kartu supaya jawaban Kartu A tidak ikut terbawa
// saat murid berganti ke Kartu B atau C.
export interface JawabanKartu {
  plot: number[] // x yang sudah terplot (layar 8)
  simetri: { duo: number[]; sumbu: string; q: string; coba: { sumbu: number; q: number } }
  aCari: { a: string; coba: number }
  f5: { s: string[]; coba: number[]; keputusan: '' | 'masuk' | 'tidak' }
}

export function jawabanKosong(): JawabanKartu {
  return {
    plot: [],
    simetri: { duo: [], sumbu: '', q: '', coba: { sumbu: 0, q: 0 } },
    aCari: { a: '', coba: 0 },
    f5: { s: ['', '', '', ''], coba: [0, 0, 0, 0], keputusan: '' },
  }
}

/** Gabungkan jawaban tersimpan (bisa sebagian/rusak) dengan bentuk baku. */
export function gabungJawaban(v?: Partial<JawabanKartu> | null): JawabanKartu {
  const d = jawabanKosong()
  if (!v) return d
  const arr = <T,>(nilai: unknown, fallback: T[], panjang: number): T[] =>
    Array.isArray(nilai) && nilai.length === panjang ? (nilai as T[]) : fallback
  return {
    plot: Array.isArray(v.plot) ? v.plot.filter(n => typeof n === 'number') : d.plot,
    simetri: {
      ...d.simetri,
      ...(v.simetri ?? {}),
      duo: Array.isArray(v.simetri?.duo) ? v.simetri.duo.filter(n => typeof n === 'number') : d.simetri.duo,
      coba: { ...d.simetri.coba, ...(v.simetri?.coba ?? {}) },
    },
    aCari: { ...d.aCari, ...(v.aCari ?? {}) },
    f5: {
      ...d.f5,
      ...(v.f5 ?? {}),
      s: arr<string>(v.f5?.s, d.f5.s, 4),
      coba: arr<number>(v.f5?.coba, d.f5.coba, 4),
    },
  }
}

export interface MLBState {
  v: number
  layar: number // 0..15
  progres: number[] // layar yang sudah dikunjungi
  kartu: CardId | null
  /** Jawaban tersimpan per kartu — diisi otomatis saat murid berganti kartu. */
  perKartu: Record<CardId, JawabanKartu>
  pemantik: { q1: string; q2: string }
  dugaan: { lemparan: '' | CardId; alasan: string }
  tebak: Tebakan[] // 3 fungsi
  kesimpulan: string
  penguat: boolean
  plot: number[] // x yang sudah terplot (layar 8)
  simetri: { duo: number[]; sumbu: string; q: string; coba: { sumbu: number; q: number } }
  aCari: { a: string; coba: number }
  f5: { s: string[]; coba: number[]; keputusan: '' | 'masuk' | 'tidak' }
  cek3: Record<CardId, Cek3>
  rekapTulis: string
  formalCatatan: string
  refleksi: { tp1: number; tp2: number; tulis: string; lanjut: string }
  kuis: { pilih: (number | null)[]; coba: number[] }
  transfer: string
}

export const STATE_KEY = 'mlb2.v1.state'
export const LAYAR_TERAKHIR = 15

function defaultState(): MLBState {
  return {
    v: 2,
    layar: 0,
    progres: [],
    kartu: null,
    perKartu: { A: jawabanKosong(), B: jawabanKosong(), C: jawabanKosong() },
    pemantik: { q1: '', q2: '' },
    dugaan: { lemparan: '', alasan: '' },
    tebak: [
      { p: '', q: '', arah: '' },
      { p: '', q: '', arah: '' },
      { p: '', q: '', arah: '' },
    ],
    kesimpulan: '',
    penguat: false,
    plot: [],
    simetri: { duo: [], sumbu: '', q: '', coba: { sumbu: 0, q: 0 } },
    aCari: { a: '', coba: 0 },
    f5: { s: ['', '', '', ''], coba: [0, 0, 0, 0], keputusan: '' },
    cek3: {
      A: { f5: '', keputusan: '', dicek: false },
      B: { f5: '', keputusan: '', dicek: false },
      C: { f5: '', keputusan: '', dicek: false },
    },
    rekapTulis: '',
    formalCatatan: '',
    refleksi: { tp1: 0, tp2: 0, tulis: '', lanjut: '' },
    kuis: { pilih: [null, null, null], coba: [0, 0, 0] },
    transfer: '',
  }
}

function loadState(): MLBState {
  const d = defaultState()
  try {
    const raw = window.localStorage.getItem(STATE_KEY)
    if (!raw) return d
    const p = JSON.parse(raw) as Partial<MLBState>
    const arr = <T,>(v: unknown, fallback: T[]): T[] => (Array.isArray(v) && v.length === fallback.length ? (v as T[]) : fallback)
    return {
      ...d,
      ...p,
      layar: typeof p.layar === 'number' ? Math.min(LAYAR_TERAKHIR, Math.max(0, p.layar)) : d.layar,
      progres: Array.isArray(p.progres) ? p.progres.filter(n => typeof n === 'number' && n >= 0 && n <= LAYAR_TERAKHIR) : d.progres,
      kartu: p.kartu === 'A' || p.kartu === 'B' || p.kartu === 'C' ? p.kartu : null,
      perKartu: {
        A: gabungJawaban(p.perKartu?.A),
        B: gabungJawaban(p.perKartu?.B),
        C: gabungJawaban(p.perKartu?.C),
      },
      pemantik: { ...d.pemantik, ...(p.pemantik ?? {}) },
      dugaan: { ...d.dugaan, ...(p.dugaan ?? {}) },
      tebak: d.tebak.map((t, i) => ({ ...t, ...(p.tebak?.[i] ?? {}) })),
      plot: Array.isArray(p.plot) ? p.plot.filter(n => typeof n === 'number') : d.plot,
      simetri: {
        ...d.simetri, ...(p.simetri ?? {}),
        duo: arr<number>(p.simetri?.duo, d.simetri.duo),
        coba: { ...d.simetri.coba, ...(p.simetri?.coba ?? {}) },
      },
      aCari: { ...d.aCari, ...(p.aCari ?? {}) },
      f5: {
        ...d.f5, ...(p.f5 ?? {}),
        s: arr<string>(p.f5?.s, d.f5.s),
        coba: arr<number>(p.f5?.coba, d.f5.coba),
      },
      cek3: {
        A: { ...d.cek3.A, ...(p.cek3?.A ?? {}) },
        B: { ...d.cek3.B, ...(p.cek3?.B ?? {}) },
        C: { ...d.cek3.C, ...(p.cek3?.C ?? {}) },
      },
      refleksi: { ...d.refleksi, ...(p.refleksi ?? {}) },
      kuis: {
        pilih: arr<number | null>(p.kuis?.pilih, d.kuis.pilih),
        coba: arr<number>(p.kuis?.coba, d.kuis.coba),
      },
    }
  } catch {
    return d
  }
}

interface Ctx {
  s: MLBState
  upd: (fn: (d: MLBState) => void) => void
  /** Ganti kartu data: simpan jawaban kartu lama, muat jawaban kartu baru. */
  gantiKartu: (k: CardId) => void
  goto: (layar: number, replace?: boolean) => void
  resetAll: () => void
  hydrated: boolean
}

const MlbContext = createContext<Ctx | null>(null)

export function MlbProvider({ children }: { children: React.ReactNode }) {
  const [s, setS] = useState<MLBState>(defaultState)
  const [hydrated, setHydrated] = useState(false)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const layarRef = useRef(0)

  useEffect(() => {
    layarRef.current = s.layar
  }, [s.layar])

  // Muat state tersimpan + tentukan layar awal (hash menang atas layar tersimpan)
  useEffect(() => {
    const st = loadState()
    let awal = st.layar
    try {
      const m = /^#\/layar-(\d{1,2})$/.exec(window.location.hash)
      if (m) {
        const n = Number(m[1])
        if (Number.isInteger(n) && n >= 0 && n <= LAYAR_TERAKHIR) awal = n
      }
    } catch { /* abaikan */ }
    st.layar = awal
    if (!st.progres.includes(awal)) st.progres = [...st.progres, awal]
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setS(st)
    setHydrated(true)
    try {
      const h = `#/layar-${awal}`
      if (window.location.hash !== h) window.history.replaceState(null, '', h)
    } catch { /* abaikan */ }
  }, [])

  // Simpan dengan debounce
  useEffect(() => {
    if (!hydrated) return
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => {
      try {
        window.localStorage.setItem(STATE_KEY, JSON.stringify(s))
      } catch { /* bila gagal, jalan tanpa menyimpan */ }
    }, 250)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [s, hydrated])

  const upd = useCallback((fn: (d: MLBState) => void) => {
    setS(prev => {
      const d: MLBState = JSON.parse(JSON.stringify(prev))
      fn(d)
      return d
    })
  }, [])

  /** Ganti kartu data: jawaban kartu lama disimpan, jawaban kartu baru dimuat.
   *  Jadi jawaban Kartu A tidak terbawa saat murid pindah ke Kartu B/C. */
  const gantiKartu = useCallback((k: CardId) => {
    setS(prev => {
      if (prev.kartu === k) return prev
      const d: MLBState = JSON.parse(JSON.stringify(prev))
      if (d.kartu) {
        d.perKartu[d.kartu] = {
          plot: d.plot,
          simetri: d.simetri,
          aCari: d.aCari,
          f5: d.f5,
        }
      }
      const jaw = d.perKartu[k] ?? jawabanKosong()
      d.plot = jaw.plot
      d.simetri = jaw.simetri
      d.aCari = jaw.aCari
      d.f5 = jaw.f5
      d.kartu = k
      return d
    })
  }, [])

  const goto = useCallback((layar: number, replace = false) => {
    const t = Math.min(LAYAR_TERAKHIR, Math.max(0, layar))
    upd(d => {
      d.layar = t
      if (!d.progres.includes(t)) d.progres.push(t)
    })
    try { window.scrollTo({ top: 0, behavior: 'auto' }) } catch { /* abaikan */ }
    try {
      const h = `#/layar-${t}`
      if (window.location.hash !== h) {
        if (replace) window.history.replaceState(null, '', h)
        else window.location.hash = h
      }
    } catch { /* abaikan */ }
  }, [upd])

  // Sinkron dengan tombol back/forward browser
  useEffect(() => {
    const onHash = () => {
      const m = /^#\/layar-(\d{1,2})$/.exec(window.location.hash)
      if (!m) return
      const n = Number(m[1])
      if (!Number.isInteger(n) || n < 0 || n > LAYAR_TERAKHIR) return
      if (layarRef.current !== n) goto(n)
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [goto])

  const resetAll = useCallback(() => {
    try { window.localStorage.removeItem(STATE_KEY) } catch { /* abaikan */ }
    setS(defaultState())
    try { window.history.replaceState(null, '', '#/layar-0') } catch { /* abaikan */ }
    try { window.scrollTo({ top: 0, behavior: 'auto' }) } catch { /* abaikan */ }
  }, [])

  return (
    <MlbContext.Provider value={{ s, upd, gantiKartu, goto, resetAll, hydrated }}>
      {children}
    </MlbContext.Provider>
  )
}

export function useMLB(): Ctx {
  const ctx = useContext(MlbContext)
  if (!ctx) throw new Error('useMLB harus dipakai di dalam MlbProvider')
  return ctx
}
