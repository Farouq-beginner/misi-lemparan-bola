'use client'

// Layar 0 — Sampul: judul, penyusun, tombol Mulai, animasi bola masuk ring

import { PENYUSUN } from '@/config/links'
import { useMLB } from '@/lib/mlb/store'
import { Tombol } from '../bits'
import { AnimasiBola } from '../grafik'

export default function Layar0() {
  const { goto } = useMLB()
  return (
    <section className="flex flex-col items-center justify-center text-center gap-5 py-8 sm:py-10 min-h-[72dvh]">
      <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 text-white ring-1 ring-white/25 backdrop-blur px-3.5 py-1.5 text-[13.5px] font-bold">
        🏀 Matematika · Fungsi Kuadrat
      </span>
      <h1 className="text-4xl sm:text-6xl font-black text-white leading-[1.08] drop-shadow-lg">
        Misi <span className="text-[#FDBA74]">Lemparan Bebas</span>
      </h1>
      <p className="rounded-full bg-white/10 px-4 py-2 text-[16px] font-extrabold text-[#FFE4C7] ring-1 ring-white/20 backdrop-blur-sm">
        Penyusun: {PENYUSUN}
      </p>
      <p className="text-white/85 max-w-md text-[17px] sm:text-xl font-semibold leading-relaxed">
        Kamu adalah <b className="text-white">analis data</b> pelatih basket. Dari 3 lemparan bebas,
        hanya <b className="text-[#FDBA74]">1 yang masuk ring</b>. Pakai fungsi kuadrat untuk membongkar misterinya!
      </p>
      <div className="w-full max-w-md rounded-3xl bg-white/5 ring-1 ring-white/15 p-3 backdrop-blur-sm shadow-2xl shadow-black/30">
        <AnimasiBola className="w-full h-auto" />
      </div>
      <Tombol className="h-14 px-8 text-xl" onClick={() => goto(1)}>
        🚀 Mulai Misi
      </Tombol>
      <div className="space-y-1">
        <p className="text-white/60 text-[13.5px] sm:text-[16px] font-semibold">
          15 layar interaktif · Progres tersimpan otomatis di perangkat ini
        </p>
      </div>
    </section>
  )
}
