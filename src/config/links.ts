// ============================================================
// Berkas pengaturan tautan eksternal — Misi Lemparan Bebas
//
// Cara pakai: tempel tautan GeoGebra milikmu di antara tanda
// kutip. Selama masih kosong (""), tombol "Buka di GeoGebra"
// otomatis DISSEMBUNYIKAN — bukan tampil sebagai tombol rusak.
// ============================================================

export const GEOGEBRA = {
  G1: '', // Layar 5–6 "Tebak Dulu & Hasil Tebakan": tiga fungsi (x-3)^2, (x-3)^2+4, -(x-3)^2+4 dengan y = x^2 pembanding
  G2: '', // Layar 8 "Plot dan Amati": bidang koordinat kosong + titik Kartu A, B, C
  G3: '', // Layar 11 "Hitung f(5)" (opsional): simulator lemparan slider a, p, q, titik lepas (0;2), ring (5;3)
} as const

export type GeoGebraKey = keyof typeof GEOGEBRA

/** Nama penyusun yang tampil di sampul */
export const PENYUSUN = 'Salma Hamidah Sya\'diyah'
