'use client'

// ============================================================
// State global Misi Lemparan Bebas (15 layar) + persistensi
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

/** Kata pilihan pada kesimpulan LKPD (Bagian C & G). */
export type KataGeser = '' | 'kanan' | 'kiri' | 'atas' | 'bawah'
export const KATA_GESER = ['kanan', 'kiri', 'atas', 'bawah'] as const

/** Kata pilihan pada Kesimpulan Bagian G LKPD. */
export type KataG = '' | 'tanda a' | 'tinggi maksimum' | 'tengah-tengah' | 'a'
export const KATA_G = ['tanda a', 'tinggi maksimum', 'tengah-tengah', 'a'] as const

/** Rangkaian 4 kesimpulan (LKPD Bagian C — layar 7). */
export interface KesimpulanC {
  puncakP: string; puncakQ: string // 1. puncak di ( p ; q )
  aPos: KataGeser; aNeg: KataGeser // 2. arah buka a+/a−
  geserP: KataGeser; geserQ: KataGeser // 3–4. geser (x − p) dan +q
  coba: number[] // percobaan salah per nomor (1..4)
}

export function kesimpulanCKosong(): KesimpulanC {
  return { puncakP: '', puncakQ: '', aPos: '', aNeg: '', geserP: '', geserQ: '', coba: [0, 0, 0, 0] }
}

const kataGeser = (x: unknown): KataGeser =>
  (KATA_GESER as readonly string[]).includes(String(x)) ? (x as KataGeser) : ''
const kataG = (x: unknown): KataG => (KATA_G as readonly string[]).includes(String(x)) ? (x as KataG) : ''

/** Gabungkan jawaban kesimpulan Bagian C (aman untuk skema lama). */
export function gabungKesimpC(v?: Partial<KesimpulanC> | null): KesimpulanC {
  const d = kesimpulanCKosong()
  if (!v) return d
  const str = (x: unknown, fb: string) => (typeof x === 'string' ? x : fb)
  return {
    puncakP: str(v.puncakP, d.puncakP), puncakQ: str(v.puncakQ, d.puncakQ),
    aPos: kataGeser(v.aPos), aNeg: kataGeser(v.aNeg),
    geserP: kataGeser(v.geserP), geserQ: kataGeser(v.geserQ),
    coba: Array.isArray(v.coba) && v.coba.length === 4 ? v.coba.map(n => (typeof n === 'number' ? n : 0)) : d.coba,
  }
}

// Jawaban yang khusus dimiliki satu kartu data (A/B/C).
// Dipisah per kartu supaya jawaban Kartu A tidak ikut terbawa
// saat murid berganti ke Kartu B atau C.
export interface JawabanKartu {
  plot: number[] // x yang sudah terplot (layar 8)
  simetri: {
    duo: number[]
    duo2: number[] // Pasangan 2 (LKPD D Langkah 2 — hanya Kartu B)
    x1: string; x2: string // dua nilai x titik setinggi (Langkah 3)
    tengah: string        // (x1 + x2) ÷ 2 (Langkah 3)
    sumbu: string         // garis x = … (Langkah 3)
    p: string; q: string  // titik puncak (p ; q) (Langkah 4)
    coba: { tengah: number; sumbu: number; p: number; q: number }
    /** Jawaban Langkah 5: 'x' = jarak mendatar, 'y' = tinggi maksimum bola. */
    arti: { p: '' | 'x' | 'y'; q: '' | 'x' | 'y' }
  }
  /** Kegiatan 2 (LKPD Bagian E, layar 10) — 5 langkah mencari a. */
  aCari: {
    p: string; q: string   // Langkah 1–2: isi bentuk puncak
    kuadrat: string        // Langkah 3: (0 − p)²
    a: string              // Langkah 3
    fungsi: string         // Langkah 4: f(x) = …
    uji: { x: string; fx: string; y: string; cocok: '' | 'ya' | 'belum' } // Langkah 5
    coba: { p: number; q: number; kuadrat: number; a: number; fungsi: number; uji: number }
  }
  /** Kegiatan 3 (LKPD Bagian F, layar 11) — selisih, alasan, saran. */
  f5: {
    s: string[]; coba: number[]
    keputusan: '' | 'masuk' | 'tidak'
    selisih: string // f(5) − 3
    alasan: string  // “…sehingga …”
    saran: { mendatar: '' | 'kiri' | 'kanan'; vertikal: '' | 'turun' | 'naik'; tulis: string }
    cobaSaran: number
  }
}

const ACARI_KOSONG: JawabanKartu['aCari'] = {
  p: '', q: '', kuadrat: '', a: '', fungsi: '',
  uji: { x: '', fx: '', y: '', cocok: '' },
  coba: { p: 0, q: 0, kuadrat: 0, a: 0, fungsi: 0, uji: 0 },
}
const F5_KOSONG: JawabanKartu['f5'] = {
  s: ['', '', '', ''], coba: [0, 0, 0, 0], keputusan: '',
  selisih: '', alasan: '',
  saran: { mendatar: '', vertikal: '', tulis: '' }, cobaSaran: 0,
}

export function jawabanKosong(): JawabanKartu {
  return {
    plot: [],
    simetri: { duo: [], duo2: [], x1: '', x2: '', tengah: '', sumbu: '', p: '', q: '', coba: { tengah: 0, sumbu: 0, p: 0, q: 0 }, arti: { p: '', q: '' } },
    aCari: { ...ACARI_KOSONG, uji: { ...ACARI_KOSONG.uji }, coba: { ...ACARI_KOSONG.coba } },
    f5: { ...F5_KOSONG, s: [...F5_KOSONG.s], coba: [...F5_KOSONG.coba], saran: { ...F5_KOSONG.saran } },
  }
}

/** Gabungkan jawaban sumbu simetri (bisa dari skema lama tanpa field baru) dengan bentuk baku. */
export function gabungSimetri(v?: Partial<JawabanKartu['simetri']> | null): JawabanKartu['simetri'] {
  const d = jawabanKosong().simetri
  if (!v) return d
  const str = (x: unknown, fb: string) => (typeof x === 'string' ? x : fb)
  return {
    duo: Array.isArray(v.duo) ? v.duo.filter(n => typeof n === 'number') : d.duo,
    duo2: Array.isArray(v.duo2) ? v.duo2.filter(n => typeof n === 'number') : d.duo2,
    x1: str(v.x1, d.x1), x2: str(v.x2, d.x2), tengah: str(v.tengah, d.tengah),
    sumbu: str(v.sumbu, d.sumbu), p: str(v.p, d.p), q: str(v.q, d.q),
    coba: { ...d.coba, ...(v.coba ?? {}) },
    arti: {
      p: v.arti?.p === 'x' || v.arti?.p === 'y' ? v.arti.p : d.arti.p,
      q: v.arti?.q === 'x' || v.arti?.q === 'y' ? v.arti.q : d.arti.q,
    },
  }
}

/** Gabungkan jawaban tersimpan (bisa sebagian/rusak) dengan bentuk baku. */
export function gabungJawaban(v?: Partial<JawabanKartu> | null): JawabanKartu {
  const d = jawabanKosong()
  if (!v) return d
  const arr = <T,>(nilai: unknown, fallback: T[], panjang: number): T[] =>
    Array.isArray(nilai) && nilai.length === panjang ? (nilai as T[]) : fallback
  // Skema lama aCari: { a, coba: number } — coba lama dianggap percobaan salah mencari a.
  const av = (v.aCari ?? {}) as Record<string, unknown>
  const aUji = (av.uji ?? {}) as Record<string, unknown>
  const aCobaLama = av.coba
  const aCobaBaru = (typeof aCobaLama === 'object' && aCobaLama !== null ? aCobaLama : {}) as Record<string, unknown>
  const n0 = (x: unknown) => (typeof x === 'number' && isFinite(x) ? x : 0)
  const s0 = (x: unknown) => (typeof x === 'string' ? x : '')
  return {
    plot: Array.isArray(v.plot) ? v.plot.filter(n => typeof n === 'number') : d.plot,
    simetri: gabungSimetri(v.simetri),
    aCari: {
      p: s0(av.p), q: s0(av.q), kuadrat: s0(av.kuadrat), a: s0(av.a), fungsi: s0(av.fungsi),
      uji: {
        x: s0(aUji.x), fx: s0(aUji.fx), y: s0(aUji.y),
        cocok: aUji.cocok === 'ya' || aUji.cocok === 'belum' ? aUji.cocok : '',
      },
      coba: {
        p: n0(aCobaBaru.p), q: n0(aCobaBaru.q), kuadrat: n0(aCobaBaru.kuadrat),
        a: n0(aCobaBaru.a) || (typeof aCobaLama === 'number' ? aCobaLama : 0),
        fungsi: n0(aCobaBaru.fungsi), uji: n0(aCobaBaru.uji),
      },
    },
    f5: {
      ...d.f5,
      ...(v.f5 ?? {}),
      s: arr<string>(v.f5?.s, d.f5.s, 4),
      coba: arr<number>(v.f5?.coba, d.f5.coba, 4),
      selisih: typeof v.f5?.selisih === 'string' ? v.f5.selisih : '',
      alasan: typeof v.f5?.alasan === 'string' ? v.f5.alasan : '',
      saran: { ...d.f5.saran, ...(v.f5?.saran ?? {}) },
      cobaSaran: typeof v.f5?.cobaSaran === 'number' ? v.f5.cobaSaran : 0,
    },
  }
}

export interface MLBState {
  v: number
  layar: number // 0..14 (15 layar)
  progres: number[] // layar yang sudah dikunjungi
  kartu: "" | CardId | null
  /** Jawaban tersimpan per kartu — diisi otomatis saat murid berganti kartu. */
  perKartu: Record<CardId, JawabanKartu>
  pemantik: { q1: string; q2: string }
  tebak: Tebakan[] // 3 fungsi
  /** Ayo Mengingat (LKPD Bagian C, layar 5) — hitungan prasyarat
   *  (soal bentuk grafik diarahkan ke GeoGebra, tidak diisi). */
  ingat: { hitung: string; cobaHitung: number }
  /** Rangkaian 4 kesimpulan (LKPD Bagian C, layar 7). */
  kesimpC: KesimpulanC
  penguat: boolean
  /** Kesimpulan akhir (LKPD Bagian G, layar 13) — 4 isian pilihan kata. */
  kesimpG: string[]
  plot: number[] // x yang sudah terplot (layar 8)
  simetri: JawabanKartu['simetri']
  aCari: JawabanKartu['aCari']
  f5: JawabanKartu['f5']
  cek3: Record<CardId, Cek3>
  rekapTulis: string
  formalCatatan: string
  refleksi: { tp1: number; tp2: number; tulis: string; lanjut: string }
  kuis: { pilih: (number | null)[]; coba: number[] }
  transfer: string
}

// Kunci lama dipertahankan agar progres murid lama tetap terbaca;
// perubahan skema dimigrasi lewat field `v` di dalam state.
export const STATE_KEY = 'mlb2.v1.state'
export const LAYAR_TERAKHIR = 14 // 15 layar (indeks 0..14)

function defaultState(): MLBState {
  return {
    v: 3,
    layar: 0,
    progres: [],
    kartu: null,
    perKartu: { A: jawabanKosong(), B: jawabanKosong(), C: jawabanKosong() },
    pemantik: { q1: '', q2: '' },
    tebak: [
      { p: '', q: '', arah: '' },
      { p: '', q: '', arah: '' },
      { p: '', q: '', arah: '' },
    ],
    ingat: { hitung: '', cobaHitung: 0 },
    kesimpC: kesimpulanCKosong(),
    penguat: false,
    kesimpG: ['', '', '', ''],
    plot: [],
    simetri: { duo: [], duo2: [], x1: '', x2: '', tengah: '', sumbu: '', p: '', q: '', coba: { tengah: 0, sumbu: 0, p: 0, q: 0 }, arti: { p: '', q: '' } },
    aCari: { ...ACARI_KOSONG, uji: { ...ACARI_KOSONG.uji }, coba: { ...ACARI_KOSONG.coba } },
    f5: { ...F5_KOSONG, s: [...F5_KOSONG.s], coba: [...F5_KOSONG.coba], saran: { ...F5_KOSONG.saran } },
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

/** Muat state tersimpan. Menghasilkan juga penanda skema lama (v < 3:
 *  masih 16 layar dengan Layar "Dugaan Pertama") supaya posisi layar,
 *  progres, dan hash lama bisa digeser ke skema 15 layar. */
function loadState(): { st: MLBState; skemaLama: boolean } {
  const d = defaultState()
  try {
    const raw = window.localStorage.getItem(STATE_KEY)
    if (!raw) return { st: d, skemaLama: false }
    const p = JSON.parse(raw) as Partial<MLBState>
    const skemaLama = typeof p.v === 'number' && p.v < 3
    const arr = <T,>(v: unknown, fallback: T[]): T[] => (Array.isArray(v) && v.length === fallback.length ? (v as T[]) : fallback)
    const str = (v: unknown, fallback: string) => (typeof v === 'string' ? v : fallback)
    const bool = (v: unknown, fallback: boolean) => (typeof v === 'boolean' ? v : fallback)
    // Skema v3: Layar "Dugaan Pertama" (indeks 4) dihapus → 15 layar.
    // State lama digeser: indeks ≥5 turun 1. Di progres, indeks 4
    // (layar yang sudah tidak ada) dibuang; di posisi layar, indeks 4
    // jatuh ke layar berikutnya (Tebak Dulu) — bukan ke layar usang.
    const layar = typeof p.layar === 'number'
      ? Math.min(LAYAR_TERAKHIR, Math.max(0, skemaLama && p.layar >= 5 ? p.layar - 1 : p.layar))
      : d.layar
    const progres = Array.isArray(p.progres)
      ? [...new Set(
          p.progres
            .filter((n): n is number => typeof n === 'number')
            .filter(n => !(skemaLama && n === 4))
            .map(n => (skemaLama && n >= 5 ? n - 1 : n))
            .filter(n => n >= 0 && n <= LAYAR_TERAKHIR),
        )]
      : d.progres
    return {
      st: {
        v: 3,
        layar,
        progres,
        kartu: p.kartu === 'A' || p.kartu === 'B' || p.kartu === 'C' ? p.kartu : null,
        perKartu: {
          A: gabungJawaban(p.perKartu?.A),
          B: gabungJawaban(p.perKartu?.B),
          C: gabungJawaban(p.perKartu?.C),
        },
        pemantik: { ...d.pemantik, ...(p.pemantik ?? {}) },
        tebak: d.tebak.map((t, i) => ({ ...t, ...(p.tebak?.[i] ?? {}) })),
        ingat: {
          hitung: str(p.ingat?.hitung, ''),
          cobaHitung: typeof p.ingat?.cobaHitung === 'number' ? p.ingat.cobaHitung : 0,
        },
        kesimpC: gabungKesimpC(p.kesimpC),
        penguat: bool(p.penguat, d.penguat),
        kesimpG: Array.isArray(p.kesimpG) && p.kesimpG.length === 4
          ? p.kesimpG.map(kataG)
          : d.kesimpG,
        plot: Array.isArray(p.plot) ? p.plot.filter(n => typeof n === 'number') : d.plot,
        simetri: gabungSimetri(p.simetri),
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
        rekapTulis: str(p.rekapTulis, d.rekapTulis),
        formalCatatan: str(p.formalCatatan, d.formalCatatan),
        refleksi: { ...d.refleksi, ...(p.refleksi ?? {}) },
        kuis: {
          pilih: arr<number | null>(p.kuis?.pilih, d.kuis.pilih),
          coba: arr<number>(p.kuis?.coba, d.kuis.coba),
        },
        transfer: str(p.transfer, d.transfer),
      },
      skemaLama,
    }
  } catch {
    return { st: d, skemaLama: false }
  }
}

interface Ctx {
  s: MLBState
  upd: (fn: (d: MLBState) => void) => void
  /** Ganti kartu data: simpan jawaban kartu lama, muat jawaban kartu baru. */
  gantiKartu: (k: '' | CardId) => void
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
    const { st, skemaLama } = loadState()
    let awal = st.layar
    try {
      const m = /^#\/layar-(\d{1,2})$/.exec(window.location.hash)
      if (m) {
        let n = Number(m[1])
        // Hash dari skema lama (16 layar) ikut digeser agar tetap
        // menunjuk layar yang sama setelah Dugaan Pertama dihapus.
        if (skemaLama && n >= 5) n -= 1
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
  const gantiKartu = useCallback((k: '' | CardId) => {
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
