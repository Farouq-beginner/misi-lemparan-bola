'use client'

// Layar 4 — Dugaan: kalimat "Aku menduga lemparan __ masuk karena __".
// Disimpan dan dibuka lagi di layar 13 (Formalisasi).

import { useMLB } from '@/lib/mlb/store'
import { JudulLayar, Panel, Chip, IsiTeks, PilihanKartu, Petunjuk } from '../bits'

export default function Layar4() {
  const { s, upd } = useMLB()
  const d = s.dugaan

  return (
    <div className="space-y-4">
      <JudulLayar fase={3} judul="Dugaan Pertama" sub="Analis hebat selalu menulis dugaan sebelum menghitung." />

      <Panel ikon="🗣️" title="Lengkapi Kalimat Dugaanmu">
        <p className="text-xl font-extrabold text-[#17345A] leading-relaxed">
          “Aku menduga lemparan{' '}
          <span className={d.lemparan ? 'text-[#B45309]' : 'text-slate-300'}>{d.lemparan || '…'}</span>{' '}
          masuk ring, karena …”
        </p>
        <PilihanKartu kecil value={d.lemparan} onChange={k => upd(u => { u.dugaan.lemparan = k })} />
        <IsiTeks
          value={d.alasan}
          onChange={v => upd(u => { u.dugaan.alasan = v })}
          rows={3}
          placeholder="…karena (tuliskan alasanmu: bentuk lintasannya? tinggi puncaknya? jaraknya?)"
          ariaLabel="Alasan dugaan"
        />
        <div className="flex flex-wrap gap-2">
          {d.lemparan && <Chip tone="hijau">✓ lemparan dipilih</Chip>}
          {d.alasan.trim().length > 3 && <Chip tone="hijau">✓ alasan tersimpan</Chip>}
        </div>
      </Panel>

      <Petunjuk>
        Dugaanmu akan <b>dibuka lagi di layar Formalisasi</b> untuk dicek kebenarannya.
        Tidak ada nilai di sini — tulis dengan jujur. Analis data selalu mulai dari dugaan! 🕵️
      </Petunjuk>
    </div>
  )
}
