'use client'

// Layar 1 — Peta Alur: 7 fase + Penutup, tujuan TP-1 & TP-2,
// tap kotak untuk lompat, status belum/sebagian/sudah dikerjakan.

import { useState } from 'react'
import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { FASES, LAYAR_PENUTUP } from '@/lib/mlb/data'
import { buildLaporan } from '@/lib/mlb/laporan'
import { copyText } from '@/lib/mlb/util'
import { JudulLayar, Panel, Tombol, Chip } from '../bits'

export default function Layar1() {
  const { s, goto, resetAll } = useMLB()
  const [konfirm, setKonfirm] = useState(false)

  const hitung = (dari: number, sampai: number) => {
    let n = 0
    for (let i = dari; i <= sampai; i++) if (s.progres.includes(i)) n++
    return n
  }

  const salin = async () => {
    const ok = await copyText(buildLaporan(s))
    if (ok) toast.success('Jawabanmu tersalin! Tempel ke LKPD atau chat guru.')
    else toast.error('Gagal menyalin — coba lagi ya.')
  }

  const ulang = () => {
    if (!konfirm) {
      setKonfirm(true)
      setTimeout(() => setKonfirm(false), 3500)
      return
    }
    resetAll()
    toast.info('Misi diulang dari awal. Semangat, analis! 🏀')
  }

  return (
    <div className="space-y-4">
      <JudulLayar judul="Peta Alur Misi" sub="Tujuan pembelajaran dan 7 fase + Penutup. Ketuk kotak untuk melompat." />

      <Panel tone="navy" ikon="🎓" title="🎯 Tujuan Pembelajaran">
        <ul className="space-y-2.5 text-[17px]">
          <li className="flex gap-2 items-start">
            <Chip tone="oranye" className="mt-0.5 shrink-0">TP-1</Chip>
            <span>Menentukan <b>puncak dan arah buka</b> grafik fungsi kuadrat berbentuk f(x) = a(x − p)² + q.</span>
          </li>
          <li className="flex gap-2 items-start">
            <Chip tone="oranye" className="mt-0.5 shrink-0">TP-2</Chip>
            <span>Menghitung <b>tinggi bola f(5)</b> pada jarak tertentu dan <b>memutuskan</b> lemparan masuk/tidak.</span>
          </li>
        </ul>
      </Panel>

      <div className="grid grid-cols-2 gap-3">
        {FASES.map(f => {
          const n = hitung(f.dari, f.sampai)
          const total = f.sampai - f.dari + 1
          const done = n === total
          return (
            <button
              key={f.n}
              onClick={() => goto(f.dari)}
              className="text-left rounded-3xl bg-white ring-1 ring-slate-200 p-4 shadow-xl shadow-black/10 hover:-translate-y-0.5 hover:shadow-2xl transition-all active:scale-95"
            >
              <div className="flex items-center gap-2">
                <span className="size-8 rounded-xl bg-gradient-to-b from-[#FB923C] to-[#F97316] text-white font-black grid place-items-center text-[16px]">{f.n}</span>
                <span className="text-3xl" aria-hidden>{f.emoji}</span>
                <span className="ml-auto">
                  {done ? (
                    <Chip tone="hijau">✓ selesai</Chip>
                  ) : n > 0 ? (
                    <Chip tone="kuning">{n}/{total}</Chip>
                  ) : (
                    <Chip tone="abu">belum</Chip>
                  )}
                </span>
              </div>
              <p className="font-extrabold text-[#17345A] mt-2.5 leading-tight text-[17px]">{f.nama}</p>
              <p className="text-[13.5px] text-slate-500 font-semibold mt-1 leading-snug">{f.desc}</p>
              <p className="text-[12.5px] text-slate-400 font-bold mt-1.5">Layar {f.dari + 1}–{f.sampai + 1}</p>
            </button>
          )
        })}
      </div>

      <button
        onClick={() => goto(LAYAR_PENUTUP)}
        className="w-full text-left rounded-3xl bg-white ring-1 ring-slate-200 p-4 shadow-xl shadow-black/10 hover:-translate-y-0.5 transition-all active:scale-[0.98] flex items-center gap-3"
      >
        <span className="text-4xl" aria-hidden>🏁</span>
        <span className="flex-1 min-w-0">
          <span className="block font-extrabold text-[#17345A]">Penutup</span>
          <span className="block text-[13.5px] text-slate-500 font-semibold">3 kesimpulan + pertanyaan transfer · Layar 16</span>
        </span>
        <span>
          {s.progres.includes(LAYAR_PENUTUP) ? <Chip tone="hijau">✓ selesai</Chip> : <Chip tone="abu">belum</Chip>}
        </span>
      </button>

      <div className="flex flex-col sm:flex-row gap-2">
        <Tombol varian="lembut" className="flex-1" onClick={salin}>📋 Salin Jawabanku</Tombol>
        <Tombol varian="bahaya" className="flex-1" onClick={ulang}>
          {konfirm ? 'Yakin? Klik sekali lagi!' : '🔄 Ulangi Misi'}
        </Tombol>
      </div>
      <p className="text-center text-white/45 text-[13.5px] font-semibold">
        Progres: {s.progres.length}/16 layar dikunjungi · tersimpan otomatis di perangkat ini
      </p>
    </div>
  )
}
