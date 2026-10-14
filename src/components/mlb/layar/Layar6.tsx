'use client'

// Layar 6 — Hasil Tebakan: 3 tab (Fungsi 1–3), tebakan murid
// dicocokkan dengan hasil, kartu Perubahan aktif setelah tebakan
// terisi, grafik statis + pembanding y = x².

import { useState } from 'react'
import { useMLB } from '@/lib/mlb/store'
import { JEMBATAN } from '@/lib/mlb/data'
import { parseNum, fmt } from '@/lib/mlb/util'
import { JudulLayar, Panel, BarisCek, KotakHasil, Petunjuk, Terkunci, Chip } from '../bits'
import { MiniKurva } from '../grafik'
import { cn } from '@/lib/utils'

export default function Layar6() {
  const { s } = useMLB()
  const [idx, setIdx] = useState(0)

  const j = JEMBATAN[idx]
  const t = s.tebak[idx]
  const pv = parseNum(t.p)
  const qv = parseNum(t.q)
  const isi = pv !== null && qv !== null && t.arah !== ''
  const pOk = pv !== null && Math.abs(pv - j.p) <= 0.01
  const qOk = qv !== null && Math.abs(qv - j.q) <= 0.01
  const aOk = t.arah === j.arah
  const semuaOk = pOk && qOk && aOk

  return (
    <div className="space-y-4">
      <JudulLayar fase={3} judul="Hasil Tebakan" sub="Cocokkan tebakanmu dengan grafik aslinya. Tepat atau perlu koreksi?" />

      <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Pilih fungsi">
        {JEMBATAN.map((f, i) => {
          const tt = s.tebak[i]
          const leng = parseNum(tt.p) !== null && parseNum(tt.q) !== null && tt.arah !== ''
          return (
            <button
              key={i}
              role="tab"
              aria-selected={idx === i}
              onClick={() => setIdx(i)}
              className={cn(
                'rounded-2xl px-2 py-2.5 font-extrabold text-[14.5px] border-2 transition-all active:scale-95 leading-tight',
                idx === i
                  ? 'bg-[#F97316] border-[#EA580C] text-white shadow-md'
                  : 'bg-white border-slate-200 text-[#17345A] hover:border-orange-300',
              )}
            >
              Fungsi {i + 1}
              <span className="block text-[12px] font-bold opacity-75 mt-0.5">{leng ? '✓ ditebak' : 'belum'}</span>
            </button>
          )
        })}
      </div>

      <Panel ikon="📈" title={`${j.fx} — Grafiknya`}>
        <MiniKurva a={j.a} p={j.p} q={j.q} bandingkan />
        <p className="text-[13.5px] text-slate-400 font-bold">
          Garis putus-putus: y = x² sebagai pembanding. Titik oranye = puncak.
        </p>
      </Panel>

      <Panel tone="biru" ikon="✅" title={`Hasil untuk ${j.fx}`}>
        {!isi ? (
          <Terkunci pesan="Isi tebakanmu untuk fungsi ini di layar sebelumnya agar pencocokan muncul." />
        ) : (
          <div className="space-y-2">
            <BarisCek
              label="Puncak"
              teks={`tebakanmu (${t.p} ; ${t.q}) — hasil sebenarnya (${fmt(j.p)} ; ${fmt(j.q)})`}
              benar={pOk && qOk}
            />
            <BarisCek
              label="Arah buka"
              teks={`tebakanmu ${t.arah} — hasil sebenarnya terbuka ke ${j.arah}`}
              benar={aOk}
            />
            {semuaOk ? (
              <KotakHasil status="ok" judul="Tebakanmu tepat semua!" />
            ) : (
              <Petunjuk>{j.penuntun}</Petunjuk>
            )}
          </div>
        )}
      </Panel>

      {isi ? (
        <Panel tone="oranye" ikon="🧭" title="Kartu Perubahan & Diskusi">
          <p className="font-extrabold text-[#17345A]">💬 {j.tanya}</p>
          <p className="text-[17px]">{j.perubahan}</p>
          {semuaOk && <Chip tone="hijau">mantap, analisismu konsisten!</Chip>}
        </Panel>
      ) : (
        <Terkunci pesan="Kartu Perubahan terbuka setelah tebakanmu untuk fungsi ini terisi." />
      )}
    </div>
  )
}
