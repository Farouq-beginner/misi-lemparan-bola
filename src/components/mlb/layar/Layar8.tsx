'use client'

// Layar 8 — Plot dan Amati: tabel titik Kartu Data milik murid,
// ketuk kolom di grid untuk memplot, cek otomatis, tautan GeoGebra G2.

import { useRef, useState } from 'react'
import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { CARDS } from '@/lib/mlb/data'
import { fmt } from '@/lib/mlb/util'
import { JudulLayar, Panel, Chip, Tombol, KotakHasil, GGBButton, PilihanKartu } from '../bits'
import { GridTap } from '../grafik'

export default function Layar8() {
  const { s, upd } = useMLB()
  const [flash, setFlash] = useState<number | null>(null)
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const kartu = s.kartu ? CARDS[s.kartu] : null
  const terplot = s.plot
  const selesai = !!kartu && terplot.length >= kartu.points.length

  const kilat = (x: number) => {
    setFlash(x)
    if (timer.current) clearTimeout(timer.current)
    timer.current = setTimeout(() => setFlash(null), 550)
  }

  const tap = (x: number) => {
    if (!s.kartu || !kartu) return
    const pt = kartu.points.find(p => p.x === x)
    if (!pt) {
      toast.error(`Tidak ada data pada x = ${x} — periksa tabel kartumu!`)
      kilat(x)
      return
    }
    if (terplot.includes(x)) {
      toast.info('Titik itu sudah terplot 👍')
      return
    }
    upd(d => { d.plot.push(x) })
    toast.success(`Titik (${x} ; ${fmt(pt.y)}) terplot!`)
  }

  if (!s.kartu || !kartu) {
    return (
      <div className="space-y-4">
        <JudulLayar fase={5} judul="Plot dan Amati" sub="Pilih dulu kartu datamu." />
        <Panel ikon="🃏" title="Kamu belum punya kartu">
          <p className="text-[14.5px]">Pilih salah satu kartu data — kartu ini akan dipakai di layar 8 sampai 11.</p>
          <PilihanKartu value="" onChange={k => upd(d => { d.kartu = k })} />
        </Panel>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <JudulLayar fase={5} judul="Plot dan Amati" sub={`Ketuk lokasi titik data Kartu ${s.kartu} di bidang koordinat.`} />

      <Panel ikon="🃏" title={`Tabel Titik — Kartu ${s.kartu}`}>
        <p className="text-[14px]">
          Hasil pelacakan bola <b>Kartu {s.kartu}</b> (dalam meter). Plot kelima titik ini ke grid!
        </p>
        <div className="flex flex-wrap gap-2">
          {kartu.points.map(p => {
            const ada = terplot.includes(p.x)
            return (
              <Chip key={p.x} tone={ada ? 'hijau' : 'abu'} className="text-[13px] px-3 py-1.5">
                {ada ? '✓' : '○'} ({p.x} ; {fmt(p.y)})
              </Chip>
            )
          })}
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Chip tone="oranye">{terplot.length}/{kartu.points.length} titik terplot</Chip>
          <Chip tone="biru">Kartu {s.kartu} aktif</Chip>
        </div>
      </Panel>

      <div className="rounded-3xl bg-white ring-1 ring-slate-200 shadow-xl shadow-black/10 p-3">
        <GridTap points={kartu.points} terplot={terplot} onTap={tap} flash={flash} warna={kartu.color} />
        <p className="text-[11.5px] text-slate-400 font-bold px-1 pt-1.5">
          💡 Ketuk kolom x yang benar — titik otomatis muncul di tinggi y yang tercatat.
        </p>
      </div>

      {selesai ? (
        <KotakHasil status="ok" judul="Semua titik terplot! 🎉">
          Lihat polanya: titik naik lalu turun secara <b>simetris</b> — itulah parabola, lintasan bola!
        </KotakHasil>
      ) : (
        <KotakHasil status="info" judul="Lanjutkan memplot">
          Masih ada {kartu.points.length - terplot.length} titik yang belum terplot.
        </KotakHasil>
      )}

      <div className="flex flex-col sm:flex-row gap-2">
        <GGBButton g="G2" label="Buka di GeoGebra" />
        <Tombol
          varian="lembut"
          onClick={() => {
            upd(d => { d.plot = [] })
            toast.info('Grid dikosongkan — coba lagi lebih teliti!')
          }}
        >
          🧹 Ulangi Plot
        </Tombol>
      </div>
    </div>
  )
}
