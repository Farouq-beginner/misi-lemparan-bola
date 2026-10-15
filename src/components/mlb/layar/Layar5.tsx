'use client'

// Layar 5 — Ayo Mengingat (LKPD Bagian C: pengamatan GeoGebra +
// 1 hitungan prasyarat) + Tebak Dulu: tiga fungsi (x−3)²,
// (x−3)²+4, −(x−3)²+4.
// Murid mengisi tebakan puncak (p ; q) dan arah buka dulu;
// tombol "Lihat Grafiknya" baru aktif setelah ketiganya lengkap.

import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { GEOGEBRA } from '@/config/links'
import { JEMBATAN } from '@/lib/mlb/data'
import { parseNum, eqTol } from '@/lib/mlb/util'
import { JudulLayar, Panel, IsiAngka, PilihKapsul, Petunjuk, Tombol, GGBButton, Chip } from '../bits'

export default function Layar5() {
  const { s, upd, goto } = useMLB()

  const lengkap = (i: number) =>
    parseNum(s.tebak[i].p) !== null && parseNum(s.tebak[i].q) !== null && s.tebak[i].arah !== ''
  const semua = lengkap(0) && lengkap(1) && lengkap(2)

  const hitungOk = eqTol(s.ingat.hitung, -5, 0.01)
  const cekHitung = () => {
    if (parseNum(s.ingat.hitung) === null) {
      toast.error('Isi dulu hasil hitungannya ya.')
      return
    }
    if (hitungOk) {
      toast.success('Benar! −3(4 − 2)² + 7 = −3 × 4 + 7 = −5 🎯')
      return
    }
    upd(d => { d.ingat.cobaHitung += 1 })
    toast.error('Belum tepat — kerjakan berurutan dari dalam kurung.')
  }

  return (
    <div className="space-y-4">
      <JudulLayar fase={3} judul="Ayo Mengingat & Tebak Dulu" sub="Pemanasan prasyarat dulu, baru tebak tiga fungsi pelatih — jangan mengintip!" />

      <Panel tone="biru" ikon="🧺" title="Ayo Mengingat (tugas prasyarat)">
        <div className="space-y-3.5">
          <div className="space-y-2">
            <p className="font-extrabold text-[#17345A] text-[17px]">
              1️⃣ Bagaimana bentuk grafik y = x²? Apa yang berubah pada grafik y = −x²?
            </p>
            <p className="text-[15px] text-slate-500 font-semibold">
              Amati bentuk langsung kedua grafik itu di GeoGebra.
            </p>
            {GEOGEBRA.G4 && <GGBButton g="G4" label="Amati grafik di GeoGebra" />}
          </div>
          <div className="space-y-2">
            <p className="font-extrabold text-[#17345A] text-[17px]">
              2️⃣ Hitung nilai −3(4 − 2)² + 7
            </p>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-extrabold text-[#17345A]">Hasilnya</span>
              <IsiAngka
                value={s.ingat.hitung}
                onChange={v => upd(d => { d.ingat.hitung = v })}
                status={s.ingat.hitung ? (hitungOk ? 'ok' : 'salah') : null}
                ariaLabel="Hasil hitungan −3(4 − 2)² + 7"
              />
              <Tombol varian="navy" className="h-11 px-4 text-[16px]" onClick={cekHitung}>Cek</Tombol>
            </div>
            {s.ingat.cobaHitung >= 2 && !hitungOk && (
              <Petunjuk>
                Kerjakan berurutan: (4 − 2) = 2 → 2² = 4 → × (−3) = −12 → + 7 = ?
              </Petunjuk>
            )}
          </div>
        </div>
        <p className="text-[13px] font-bold text-slate-400">✓ Hitungan tersimpan otomatis — pengamatan GeoGebra tidak dinilai.</p>
      </Panel>

      <Panel tone="navy" ikon="🕵️" title="Tiga Fungsi Hasil Uji Coba">
        <p className="text-center font-black text-2xl sm:text-3xl text-[#FDBA74] tracking-wide py-1">
          y = (x − p)² + q
        </p>
        <p className="text-[17px]">Tim pelatih menguji tiga model lintasan di GeoGebra:</p>
        <div className="grid sm:grid-cols-3 gap-2 text-center">
          {JEMBATAN.map((f, i) => (
            <div key={i} className="rounded-2xl bg-white/10 ring-1 ring-white/20 px-3 py-3">
              <p className="text-[12.5px] font-black text-[#FDBA74] uppercase tracking-wide">Fungsi {i + 1}</p>
              <p className="font-black text-xl mt-0.5">{f.fx}</p>
            </div>
          ))}
        </div>
      </Panel>

      {JEMBATAN.map((f, i) => {
        const t = s.tebak[i]
        return (
          <Panel key={i} ikon="🃏" title={`Tebakan untuk Fungsi ${i + 1}: ${f.fx}`}>
            <p className="text-[15px] text-slate-500 font-semibold">Di mana puncaknya, dan ke arah mana grafik terbuka?</p>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="font-extrabold text-[#17345A]">p =</span>
              <IsiAngka value={t.p} onChange={v => upd(d => { d.tebak[i].p = v })} ariaLabel={`Tebakan p fungsi ${i + 1}`} />
              <span className="font-extrabold text-[#17345A]">q =</span>
              <IsiAngka value={t.q} onChange={v => upd(d => { d.tebak[i].q = v })} ariaLabel={`Tebakan q fungsi ${i + 1}`} />
              {lengkap(i) && <Chip tone="hijau">✓ lengkap</Chip>}
            </div>
            <PilihKapsul
              value={t.arah}
              onChange={v => upd(d => { d.tebak[i].arah = v as 'atas' | 'bawah' })}
              opsi={[
                { v: 'atas', label: '↑ Terbuka ke atas' },
                { v: 'bawah', label: '↓ Terbuka ke bawah' },
              ]}
            />
          </Panel>
        )
      })}

      <div className="flex flex-col sm:flex-row gap-2 items-stretch sm:items-center">
        <Tombol className="flex-1" disabled={!semua} onClick={() => goto(5)}>
          🔍 Lihat Grafiknya →
        </Tombol>
        <GGBButton g="G1" label="Buka di GeoGebra" />
      </div>
      {!semua && (
        <Petunjuk>
          Lengkapi tebakan <b>ketiga fungsi</b> dulu (p, q, dan arah buka).
          Grafiknya menunggu — tebak dulu, baru lihat! 😉
        </Petunjuk>
      )}
    </div>
  )
}
