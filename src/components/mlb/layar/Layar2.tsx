'use client'

// Layar 2 — Orientasi: Gambar 1 (tiga lemparan + ring (5;3)),
// ketuk lemparan untuk menyorot lintasan, 2 pertanyaan pemantik.

import { useState } from 'react'
import { useMLB } from '@/lib/mlb/store'
import type { CardId } from '@/lib/mlb/data'
import { JudulLayar, Panel, Chip, IsiTeks } from '../bits'
import { SceneLemparan } from '../grafik'
import { cn } from '@/lib/utils'

export default function Layar2() {
  const { s, upd } = useMLB()
  const [sorot, setSorot] = useState<CardId | null>(null)

  return (
    <div className="space-y-4">
      <JudulLayar fase={1} judul="Orientasi: Tiga Lemparan Bebas" sub="Amati dulu sebelum menghitung — mata analis adalah alat pertama!" />

      <Panel ikon="📋" title="🏟️ Laporan Pertandingan">
        <p>
          Pelatih <b>Rimba</b> mencatat <b>3 lemparan bebas</b> pemain andalannya. Ring ada di <b>(5 ; 3)</b> —
          5 m menjauh, 3 m tinggi. Bola selalu dilepas dari <b>(0 ; 2)</b>.
        </p>
        <p className="flex flex-wrap items-center gap-2">
          Hasilnya aneh: <Chip tone="hijau">1 masuk</Chip> <Chip tone="merah">2 gagal</Chip>
          <span>— padahal cara melemparnya terlihat mirip!</span>
        </p>
      </Panel>

      <div className="rounded-3xl bg-white ring-1 ring-slate-200 shadow-xl shadow-black/10 p-3">
        <SceneLemparan sorot={sorot} onSorot={setSorot} />
        <div className="flex gap-2 px-1 pt-2" role="group" aria-label="Pilih lemparan untuk disorot">
          {(['A', 'B', 'C'] as const).map(k => (
            <button
              key={k}
              type="button"
              aria-pressed={sorot === k}
              onClick={() => setSorot(sorot === k ? null : k)}
              className={cn(
                'flex-1 h-10 rounded-2xl font-extrabold text-[16px] border-2 transition-all active:scale-95',
                sorot === k
                  ? 'bg-[#F97316] border-[#EA580C] text-white shadow-md'
                  : 'bg-white border-slate-200 text-[#17345A] hover:border-orange-300',
              )}
            >
              Lemparan {k}
            </button>
          ))}
        </div>
        <p className="text-[13px] text-slate-400 font-bold px-1 pt-1.5">
          💡 Ketuk lintasan di gambar atau tombol di atas untuk menyorot satu lemparan.
        </p>
      </div>

      <Panel tone="biru" ikon="💭" title="❓ Pertanyaan Pemantik">
        <div className="space-y-3.5">
          <div className="space-y-2">
            <p className="font-extrabold text-[#17345A]">1️⃣ Menurutmu, mengapa hanya satu lemparan yang masuk ring?</p>
            <IsiTeks
              value={s.pemantik.q1}
              onChange={v => upd(d => { d.pemantik.q1 = v })}
              placeholder="Tulis dugaan pertamamu di sini…"
              ariaLabel="Pertanyaan pemantik 1"
            />
          </div>
          <div className="space-y-2">
            <p className="font-extrabold text-[#17345A]">2️⃣ Kalau lintasan bola adalah grafik fungsi, apa yang menentukan tinggi maksimumnya?</p>
            <IsiTeks
              value={s.pemantik.q2}
              onChange={v => upd(d => { d.pemantik.q2 = v })}
              placeholder="Tulis pendapatmu di sini…"
              ariaLabel="Pertanyaan pemantik 2"
            />
          </div>
        </div>
        <p className="text-[13px] text-slate-400 font-bold">✓ Jawaban terbuka — tidak dinilai, tersimpan otomatis.</p>
      </Panel>
    </div>
  )
}
