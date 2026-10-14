// ============================================================
// Misi Lemparan Bebas — data kartu, kunci jawaban, meta layar
// Sumber: Rancangan Web Interaktif "Misi Lemparan Bebas"
// (19 slide PPT Fungsi Kuadrat → 16 layar interaktif)
// ============================================================

export type CardId = 'A' | 'B' | 'C'
export type Pt = { x: number; y: number }

export interface CardData {
  id: CardId
  color: string
  soft: string
  points: Pt[]
  simX: number
  peak: Pt
  a: number
  fx: string
  f5: number
  masuk: boolean
  sebab: string
  selisih: string
}

// Semua titik kartu terletak tepat pada parabolanya dan selalu f(0) = 2.
export const CARDS: Record<CardId, CardData> = {
  A: {
    id: 'A', color: '#E8702A', soft: '#FCEADF',
    points: [
      { x: 0, y: 2 }, { x: 1, y: 3 }, { x: 2, y: 3.6 }, { x: 3, y: 3.8 }, { x: 4, y: 3.6 },
    ],
    simX: 3, peak: { x: 3, y: 3.8 }, a: -0.2,
    fx: '−0,2(x − 3)² + 3,8', f5: 3, masuk: true,
    sebab: 'pas di ring', selisih: 'selisih 0 m, tepat di ring',
  },
  B: {
    id: 'B', color: '#3D6DB5', soft: '#E3E9F2',
    points: [
      { x: 0, y: 2 }, { x: 1, y: 2.9 }, { x: 2, y: 3.2 }, { x: 3, y: 2.9 }, { x: 4, y: 2 },
    ],
    simX: 2, peak: { x: 2, y: 3.2 }, a: -0.3,
    fx: '−0,3(x − 2)² + 3,2', f5: 0.5, masuk: false,
    sebab: 'terlalu rendah', selisih: '2,5 m di bawah ring',
  },
  C: {
    id: 'C', color: '#2E9E6B', soft: '#E2F3EA',
    points: [
      { x: 0, y: 2 }, { x: 1, y: 2.7 }, { x: 2, y: 3.2 }, { x: 4, y: 3.6 }, { x: 6, y: 3.2 },
    ],
    simX: 4, peak: { x: 4, y: 3.6 }, a: -0.1,
    fx: '−0,1(x − 4)² + 3,6', f5: 3.5, masuk: false,
    sebab: 'melewati ring', selisih: '0,5 m di atas ring',
  },
}

export const RING = { x: 5, y: 3 }            // ring basket (5 ; 3)
export const LEPAS: Pt = { x: 0, y: 2 }       // titik lepas (0 ; 2)
export const ZONA = { bawah: 2.9, atas: 3.1 } // masuk bila 2,9 ≤ f(5) ≤ 3,1

export const masukBola = (f5: number) => Math.abs(f5 - RING.y) <= (ZONA.atas - ZONA.bawah) / 2 + 0.0001

export const fxVal = (c: { a: number; p: number; q: number }, x: number) => c.a * (x - c.p) * (x - c.p) + c.q

export const fxCard = (c: CardData, x: number) => fxVal({ a: c.a, p: c.peak.x, q: c.peak.y }, x)

// Contoh terbimbing (layar 9–10)
export const CONTOH = {
  points: [
    { x: 0, y: 2 }, { x: 1, y: 2.75 }, { x: 2, y: 3 }, { x: 3, y: 2.75 }, { x: 4, y: 2 },
  ] as Pt[],
  simX: 2,
  peak: { x: 2, y: 3 } as Pt,
  a: -0.25,
  fx: '−0,25(x − 2)² + 3',
  f5: 0.75,
}

// Tiga fungsi "Tebak Dulu" (layar 5–6)
export interface FungsiTebak {
  fx: string
  a: number
  p: number
  q: number
  arah: 'atas' | 'bawah'
  tanya: string
  perubahan: string
  penuntun: string
}

export const JEMBATAN: FungsiTebak[] = [
  {
    fx: 'y = (x − 3)²', a: 1, p: 3, q: 0, arah: 'atas',
    tanya: 'Tanda apa pada (x − 3), dan ke arah mana grafik bergeser dibanding y = x²?',
    perubahan: '(x − 3) menggeser y = x² sejauh 3 satuan ke kanan. Puncak (0 ; 0) → (3 ; 0). Sumbu simetri x = 3.',
    penuntun: 'Garis putus-putus adalah y = x² yang berpuncak di (0 ; 0). Bagian (x − 3) menggeser grafik ke kanan — jadi puncaknya pindah ke mana?',
  },
  {
    fx: 'y = (x − 3)² + 4', a: 1, p: 3, q: 4, arah: 'atas',
    tanya: 'Apa yang berubah dibanding Fungsi 1, dan apa penyebabnya?',
    perubahan: 'Tambahan + 4 menggeser grafik 4 satuan ke atas. Puncak (3 ; 0) → (3 ; 4). Sumbu simetri tetap x = 3.',
    penuntun: 'Mulai dari Fungsi 1 (puncak (3 ; 0)). Angka + 4 di LUAR kurung menggeser grafik secara vertikal — ke atas atau ke bawah?',
  },
  {
    fx: 'y = −(x − 3)² + 4', a: -1, p: 3, q: 4, arah: 'bawah',
    tanya: 'Yang berubah posisi puncak atau arah buka? Mengapa penting untuk lintasan bola?',
    perubahan: 'Tanda a = −1 membalik arah buka menjadi terbuka ke bawah. Puncak tetap (3 ; 4). Persis seperti bola: naik, mencapai puncak, lalu turun.',
    penuntun: 'Posisi puncak tetap (3 ; 4). Lihat bentuk grafiknya — masih seperti senyum, atau sudah seperti gunung? Tanda minus di depan membalik arah buka.',
  },
]

// ---------- Meta 16 layar ----------
export interface LayarMeta { judul: string; fase: number }

export const LAYAR: LayarMeta[] = [
  { judul: 'Sampul', fase: 0 },
  { judul: 'Peta Alur', fase: 0 },
  { judul: 'Orientasi', fase: 1 },
  { judul: 'Rumusan Masalah', fase: 2 },
  { judul: 'Dugaan Pertama', fase: 3 },
  { judul: 'Tebak Dulu', fase: 3 },
  { judul: 'Hasil Tebakan', fase: 3 },
  { judul: 'Kesimpulan Konsep', fase: 4 },
  { judul: 'Plot dan Amati', fase: 5 },
  { judul: 'Sumbu Simetri', fase: 5 },
  { judul: 'Menemukan Fungsi', fase: 5 },
  { judul: 'Hitung f(5)', fase: 6 },
  { judul: 'Rekap Misi', fase: 6 },
  { judul: 'Formalisasi', fase: 7 },
  { judul: 'Refleksi & Kuis', fase: 7 },
  { judul: 'Penutup', fase: 8 },
]

// ---------- Peta alur: 7 fase + Penutup ----------
export interface FaseMeta { n: number; emoji: string; nama: string; desc: string; dari: number; sampai: number }

export const FASES: FaseMeta[] = [
  { n: 1, emoji: '👀', nama: 'Orientasi', desc: 'Amati tiga lemparan bebas', dari: 2, sampai: 2 },
  { n: 2, emoji: '🧩', nama: 'Rumusan Masalah', desc: 'Misi pelatih & pilih kartu', dari: 3, sampai: 3 },
  { n: 3, emoji: '💭', nama: 'Dugaan & Tebak', desc: 'Dugaan awal + tebak 3 grafik', dari: 4, sampai: 6 },
  { n: 4, emoji: '💡', nama: 'Kesimpulan Konsep', desc: 'Bentuk f(x) = a(x − p)² + q', dari: 7, sampai: 7 },
  { n: 5, emoji: '📊', nama: 'Plot & Analisis', desc: 'Titik, sumbu simetri, cari a', dari: 8, sampai: 10 },
  { n: 6, emoji: '🏀', nama: 'Hitung & Keputusan', desc: 'f(5): masuk atau tidak', dari: 11, sampai: 12 },
  { n: 7, emoji: '📝', nama: 'Formalisasi & Refleksi', desc: 'Rangkuman, miskonsepsi, kuis', dari: 13, sampai: 14 },
]

export const LAYAR_PENUTUP = 15

// ---------- Kuis refleksi 3 soal (layar 14) ----------
export interface KuisSoal {
  tp: 1 | 2
  tanya: string
  opsi: string[]
  benar: number
  penuntun: string
  jelas: string
}

export const KUIS: KuisSoal[] = [
  {
    tp: 1,
    tanya: 'Di mana puncak grafik f(x) = −3(x − 2)² + 5 ?',
    opsi: ['(2 ; 5)', '(−2 ; 5)', '(2 ; −5)', '(5 ; 2)'],
    benar: 0,
    penuntun: 'Lihat bagian dalam kurung: (x − 2) → p = 2. Angka di luar kurung (+ 5) adalah q. Ingat: tanda p dibalik dari tanda di dalam kurung.',
    jelas: 'Bentuk a(x − p)² + q → puncak (p ; q) = (2 ; 5). Grafiknya terbuka ke bawah karena a = −3.',
  },
  {
    tp: 1,
    tanya: 'Fungsi mana yang puncaknya tepat di x = −3 ?',
    opsi: ['f(x) = (x − 3)² + 1', 'f(x) = (x + 3)² + 1', 'f(x) = x² + 3', 'f(x) = 3x² + 1'],
    benar: 1,
    penuntun: 'Hati-hati dengan tanda p: (x + 3) sama artinya dengan (x − (−3)) → puncaknya di x = −3, bukan +3.',
    jelas: '(x + 3)² ditulis ulang menjadi (x − (−3))² → p = −3. Inilah miskonsepsi tanda p yang paling sering terjadi!',
  },
  {
    tp: 2,
    tanya: 'Bola: f(x) = −0,5(x − 3)² + 4. Berapa tinggi bola tepat di ring, x = 5 ?',
    opsi: ['2 m', '3 m', '4 m', '0,5 m'],
    benar: 0,
    penuntun: 'Kerjakan berurutan: (5 − 3) = 2 → dikuadratkan = 4 → × (−0,5) = −2 → + 4 = ?',
    jelas: 'f(5) = −0,5(2)² + 4 = −2 + 4 = 2 m. Ring 3 m → bola 1 m di bawah ring: tidak masuk.',
  },
]
