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

  L.push('▸ Orientasi (Layar 2)')
  L.push(`1) Mengapa hanya satu yang masuk: ${s.pemantik.q1 || '—'}`)
  L.push(`2) Apa penentu tinggi maksimum: ${s.pemantik.q2 || '—'}`)
  L.push('')

  L.push('▸ Dugaan Awal (Layar 4)')
  L.push(s.dugaan.lemparan
    ? `Aku menduga lemparan ${s.dugaan.lemparan} masuk, karena: ${s.dugaan.alasan || '—'}`
    : 'Belum mengisi dugaan')
  L.push('')

  L.push('▸ Tebakan Grafik (Layar 5)')
  s.tebak.forEach((t, i) => {
    L.push(`Fungsi ${i + 1}: puncak (${t.p || '?'} ; ${t.q || '?'}), terbuka ${t.arah || '?'}`)
  })
  L.push('')

  L.push('▸ Kesimpulan Konsep (Layar 7)')
  L.push(s.kesimpulan || '—')
  L.push('')

  L.push('▸ Hitungan Kartuku (Layar 8–11)')
  if (s.kartu) {
    const c = CARDS[s.kartu]
    L.push(`p = ${fmt(c.peak.x)}, q = ${fmt(c.peak.y)}, a = ${s.aCari.a || '—'}`)
    L.push(`Langkah f(5): ${s.f5.s.map(v => v || '?').join(' → ')}`)
    L.push(`Keputusan kartu ${s.kartu}: ${s.f5.keputusan === 'masuk' ? 'MASUK' : s.f5.keputusan === 'tidak' ? 'TIDAK MASUK' : '—'}`)
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

  L.push(`Kemajuan: ${s.progres.length}/16 layar dikunjungi`)

  return L.join('\n')
}
