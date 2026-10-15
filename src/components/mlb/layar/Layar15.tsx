'use client'

// Layar 15 — Penutup: 3 kesimpulan, pertanyaan transfer,
// topik berikutnya, tombol kembali ke Peta Alur + salin jawaban.

import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { buildLaporan } from '@/lib/mlb/laporan'
import { copyText } from '@/lib/mlb/util'
import { JudulLayar, Panel, IsiTeks, Tombol, Chip } from '../bits'

const KESIMPULAN = [
  {
    emoji: '🎯',
    judul: 'Puncak langsung terlihat',
    isi: 'Bentuk f(x) = a(x − p)² + q menyimpan puncaknya di (p ; q) dan sumbu simetri di garis x = p — tanpa menggambar dulu.',
  },
  {
    emoji: '↔️',
    judul: 'Geser & balik arah',
    isi: 'p menggeser grafik mendatar (tandanya dibalik!), q menggeser vertikal, dan tanda a menentukan arah buka: a < 0 seperti lintasan bola.',
  },
  {
    emoji: '⚖️',
    judul: 'Analis mengambil keputusan',
    isi: 'Dengan f(5): masuk bila 2,9 ≤ f(5) ≤ 3,1 m. Di luar zona itu, bola gagal — dan kita tahu sebabnya: terlalu rendah atau melewati ring.',
  },
]

export default function Layar15() {
  const { s, upd, goto } = useMLB()

  const salin = async () => {
    const ok = await copyText(buildLaporan(s))
    if (ok) toast.success('Jawabanmu tersalin! Tempel ke LKPD atau chat guru.')
    else toast.error('Gagal menyalin — coba lagi ya.')
  }

  return (
    <div className="space-y-4">
      <JudulLayar judul="Misi Selesai, Analis Hebat! 🏆" sub="Tiga hal yang wajib kamu bawa pulang dari misi ini." />

      <div className="space-y-3">
        {KESIMPULAN.map((k, i) => (
          <Panel key={i} tone={i === 2 ? 'oranye' : 'white'} ikon={k.emoji} title={`${i + 1}. ${k.judul}`}>
            <p className="text-[17px]">{k.isi}</p>
          </Panel>
        ))}
      </div>

      <Panel tone="biru" ikon="🚀" title="Pertanyaan Transfer">
        <p className="text-[17px]">
          Kalau ring <b>pindah ke (6 ; 3)</b> dan bola tetap dilepas dari <b>(0 ; 2)</b>,
          bagian mana dari f(x) yang harus berubah? Bagaimana caramu mencari a yang baru?
        </p>
        <IsiTeks
          value={s.transfer}
          onChange={v => upd(d => { d.transfer = v })}
          rows={3}
          placeholder="Contoh: p berubah jadi 6 karena ring di x = 6, lalu a = (2 − q) : 6²…"
          ariaLabel="Jawaban pertanyaan transfer"
        />
        <p className={s.transfer.trim() ? 'text-[13px] font-bold text-[#1F7A4D]' : 'text-[13px] font-bold text-slate-400'}>
          {s.transfer.trim() ? '✓ tersimpan' : 'jawaban terbuka — diskusikan dengan teman/guru'}
        </p>
      </Panel>

      <Panel tone="navy" ikon="🔜" title="Topik Berikutnya">
        <p className="text-[17px]">
          Bentuk umum <b>y = ax² + bx + c</b> — bagaimana mencari puncaknya tanpa bentuk kuadrat sempurna?
          Petunjuk: kenalan dengan <b>x = −b : 2a</b>.
        </p>
        <div className="flex flex-wrap gap-2">
          <Chip tone="kaca">🏀 Misi berikutnya menantimu</Chip>
          <Chip tone="kaca">Fungsi Kuadrat · Fase E</Chip>
        </div>
      </Panel>

      <div className="flex flex-col sm:flex-row gap-2">
        <Tombol varian="putih" className="flex-1" onClick={() => goto(1)}>🗺️ Kembali ke Peta Alur</Tombol>
        <Tombol className="flex-1" onClick={salin}>📋 Salin Jawabanku</Tombol>
      </div>
      <p className="text-center text-white/45 text-[13.5px] font-semibold">
        Kamu telah mengunjungi {s.progres.length}/15 layar · jawaban tersimpan di perangkat ini
      </p>
    </div>
  )
}
