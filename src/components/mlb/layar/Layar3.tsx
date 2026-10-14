'use client'

// Layar 3 — Rumusan Masalah: misi analis, aturan koordinat,
// 4 aturan kerja, pilih Kartu A/B/C (disimpan untuk layar lanjutan).

import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { JudulLayar, Panel, Chip, PilihanKartu } from '../bits'
import type { CardId } from '@/lib/mlb/data'

export default function Layar3() {
  const { s, gantiKartu } = useMLB()

  const pilih = (k: CardId) => {
    const sebelumnya = s.kartu
    gantiKartu(k)
    if (sebelumnya && sebelumnya !== k) {
      toast.success(`Kartu ${k} dipilih. Jawaban Kartu ${sebelumnya} tersimpan, dan kamu mulai dari lembar Kartu ${k}.`)
    } else {
      toast.success(`Kartu ${k} dipilih! Kartu ini menemanimu di layar-layar berikutnya.`)
    }
  }

  return (
    <div className="space-y-4">
      <JudulLayar fase={2} judul="Rumusan Masalah" sub="Tugas resmi analis data pelatih Rimba." />

      <Panel tone="navy" ikon="🎯" title="Misi: Mengapa Hanya 1 dari 3 yang Masuk?">
        <p>
          Pelatih Rimba bingung: <b>hanya 1 dari 3 lemparan bebas yang masuk ring</b>.
          Sebagai analis data, tugasmu:
        </p>
        <ol className="list-decimal ml-5 space-y-1.5 text-[17px]">
          <li>Menemukan <b>fungsi lintasan</b> tiap lemparan dari data titiknya.</li>
          <li>Menghitung <b>tinggi bola saat x = 5</b> (tepat di ring).</li>
          <li><b>Memutuskan</b> lemparan mana yang masuk — dan menjelaskan sebabnya.</li>
        </ol>
      </Panel>

      <Panel tone="biru" ikon="📐" title="Aturan Koordinat">
        <ul className="space-y-2 text-[17px]">
          <li>🧭 <b>Sumbu x</b> = jarak mendatar dari pemain (meter).</li>
          <li>📏 <b>Sumbu y</b> = tinggi bola dari lantai (meter).</li>
          <li>🖐️ Titik <b>(0 ; 2)</b> = bola lepas dari tangan setinggi 2 m.</li>
          <li>🧺 Titik <b>(5 ; 3)</b> = posisi ring.</li>
          <li>✅ <b>Aturan masuk:</b> tinggi bola di x = 5 harus <b>2,9 – 3,1 m</b> (ring 3 m, toleransi ±10 cm).</li>
        </ul>
      </Panel>

      <Panel tone="oranye" ikon="📋" title="4 Aturan Kerja Analis">
        <ol className="list-decimal ml-5 space-y-1.5 text-[17px]">
          <li>Kerjakan layar secara <b>berurutan</b> — tiap layar membantu layar berikutnya.</li>
          <li><b>Tebak dulu, baru lihat.</b> Salah itu bagian dari misi, bukan aib!</li>
          <li>Koma dan titik desimal sama saja: <b>3,8 = 3.8</b>.</li>
          <li>Jawaban <b>tersimpan otomatis</b> di perangkatmu — bisa dilanjut kapan saja.</li>
        </ol>
      </Panel>

      <Panel ikon="🃏" title="Pilih Kartu Datamu">
        <p className="text-[17px]">
          Setiap analis mendapat <b>satu kartu data</b> hasil pelacakan satu lemparan.
          Pilih satu — kamu akan menganalisis kartu ini sampai tuntas!
        </p>
        <PilihanKartu value={s.kartu ?? ''} onChange={pilih} />
        {s.kartu && (
          <p className="flex items-center gap-2">
            <Chip tone="hijau">✓ Kartu aktif: {s.kartu}</Chip>
            <span className="text-[13.5px] text-slate-400 font-bold">boleh diganti kapan saja — jawaban tiap kartu tersimpan sendiri</span>
          </p>
        )}
      </Panel>
    </div>
  )
}
