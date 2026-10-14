'use client'

// Layar 5 — Tebak Dulu: tiga fungsi (x−3)², (x−3)²+4, −(x−3)²+4.
// Murid mengisi tebakan puncak (p ; q) dan arah buka dulu;
// tombol "Lihat Grafiknya" baru aktif setelah ketiganya lengkap.

import { useMLB } from '@/lib/mlb/store'
import { JEMBATAN } from '@/lib/mlb/data'
import { parseNum } from '@/lib/mlb/util'
import { JudulLayar, Panel, IsiAngka, PilihKapsul, Petunjuk, Tombol, GGBButton, Chip } from '../bits'

export default function Layar5() {
  const { s, upd, goto } = useMLB()

  const lengkap = (i: number) =>
    parseNum(s.tebak[i].p) !== null && parseNum(s.tebak[i].q) !== null && s.tebak[i].arah !== ''
  const semua = lengkap(0) && lengkap(1) && lengkap(2)

  return (
    <div className="space-y-4">
      <JudulLayar fase={3} judul="Tebak Dulu, Baru Lihat!" sub="Pelatih punya grafik tiga fungsi. Tebak dulu puncak dan arah bukanya — jangan mengintip!" />

      <Panel tone="navy" ikon="🕵️" title="Tiga Fungsi Hasil Uji Coba">
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
        <Tombol className="flex-1" disabled={!semua} onClick={() => goto(6)}>
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
