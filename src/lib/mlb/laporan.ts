// ============================================================
// buildLaporan — merangkum semua jawaban murid menjadi teks
// siap tempel ke LKPD kertas atau chat WhatsApp guru.
// ============================================================

import type { MLBState } from './store'
import { CARDS } from './data'
import { fmt } from './util'

export function buildLaporan(s: MLBState): string {
  const L: string[] = []
  L.push('🏀 MISI LEMPARAN BEBAS — Lembar Jawabanku')
  L.push('=========================================')
  L.push('')

  L.push('▸ Kartu Data')
  L.push(s.kartu ? `Kartu ${s.kartu} — fungsi: ${CARDS[s.kartu].fx}` : 'Belum memilih kartu')
  L.push('')

  L.push('▸ Orientasi (Layar 3)')
  L.push(`1) Mengapa hanya satu yang masuk: ${s.pemantik.q1 || '—'}`)
  L.push(`2) Apa penentu tinggi maksimum: ${s.pemantik.q2 || '—'}`)
  L.push('')

  L.push('▸ Ayo Mengingat (Layar 5)')
  L.push('(soal bentuk grafik diarahkan ke GeoGebra — pengamatan)')
  L.push(`−3(4 − 2)² + 7 = ${s.ingat.hitung || '—'}`)
  L.push('')

  L.push('▸ Tebakan Grafik (Layar 5)')
  s.tebak.forEach((t, i) => {
    L.push(`Fungsi ${i + 1}: puncak (${t.p || '?'} ; ${t.q || '?'}), terbuka ${t.arah || '?'}`)
  })
  L.push('')

  L.push('▸ Kesimpulan Konsep — 4 rangkaian (Layar 7)')
  const kc = s.kesimpC
  L.push(`1. Puncak di (${kc.puncakP || '?'} ; ${kc.puncakQ || '?'})`)
  L.push(`2. a positif → ${kc.aPos || '?'} ; a negatif → ${kc.aNeg || '?'}`)
  L.push(`3. (x − p) menggeser ke ${kc.geserP || '?'} sejauh p satuan`)
  L.push(`4. +q menggeser ke ${kc.geserQ || '?'} sejauh q satuan`)
  L.push('')

  L.push('▸ Hitungan Kartuku (Layar 8–11)')
  if (s.kartu) {
    const c = CARDS[s.kartu]
    const ac = s.aCari
    L.push(`p = ${fmt(c.peak.x)}, q = ${fmt(c.peak.y)}, a = ${ac.a || '—'}`)
    L.push(`Fungsi lengkap: ${ac.fungsi || '—'}`)
    L.push(`Uji titik lain: x = ${ac.uji.x || '—'}, f(x) = ${ac.uji.fx || '—'}, data kartu y = ${ac.uji.y || '—'} → ${ac.uji.cocok || '—'}`)
    L.push(`Langkah f(5): ${s.f5.s.map(v => v || '?').join(' → ')}`)
    L.push(`f(5) − 3 = ${s.f5.selisih || '—'} m`)
    L.push(`Keputusan kartu ${s.kartu}: ${s.f5.keputusan === 'masuk' ? 'MASUK' : s.f5.keputusan === 'tidak' ? 'TIDAK MASUK' : '—'}`)
    L.push(`Alasanku: ${s.f5.alasan || '—'}`)
    L.push(`Saran: mendatar ${s.f5.saran.mendatar || '—'}, vertikal ${s.f5.saran.vertikal || '—'}${s.f5.saran.tulis ? ` ; ${s.f5.saran.tulis}` : ''}`)
  } else {
    L.push('Belum ada kartu')
  }
  L.push('')

  L.push('▸ Cek Jawaban Ketiga Kartu (Layar 11)')
  ;(['A', 'B', 'C'] as const).forEach(k => {
    const r = s.cek3[k]
    const kep = r.keputusan === 'masuk' ? 'masuk' : r.keputusan === 'tidak' ? 'tidak masuk' : '—'
    L.push(`Kartu ${k}: f(5) = ${r.f5 || '—'} ; keputusan = ${kep}`)
  })
  L.push('')

  L.push('▸ Pertanyaan Pembanding (Layar 12)')
  L.push(s.rekapTulis || '—')
  L.push('')

  L.push('▸ Kesimpulan Akhir — Bagian G (Layar 13)')
  const KUNCI_G = ['tanda a', 'tinggi maksimum', 'tengah-tengah', 'a']
  L.push(`1. Arah buka ← ${s.kesimpG[0] || '—'} ; q = ${s.kesimpG[1] || '—'} bola`)
  L.push(`2. Sumbu simetri ← ${s.kesimpG[2] || '—'}`)
  L.push(`3. Bilangan yang belum diketahui ← ${s.kesimpG[3] || '—'}`)
  const gBenar = s.kesimpG.filter((v, i) => v === KUNCI_G[i]).length
  L.push(`Skor kesimpulan akhir: ${gBenar}/4`)
  L.push('')

  L.push('▸ Catatan Formalisasi (Layar 13)')
  L.push(s.formalCatatan || '—')
  L.push('')

  L.push('▸ Refleksi (Layar 14)')
  L.push(`TP-1: ${s.refleksi.tp1 || '—'}/4 · TP-2: ${s.refleksi.tp2 || '—'}/4`)
  L.push(`Catatan: ${s.refleksi.tulis || '—'}`)
  L.push(`Tindak lanjut: ${s.refleksi.lanjut || '—'}`)
  L.push('')

  L.push('▸ Pertanyaan Transfer (Layar 15)')
  L.push(s.transfer || '—')
  L.push('')

  L.push(`Kemajuan: ${s.progres.length}/15 layar dikunjungi`)

  return L.join('\n')
}
