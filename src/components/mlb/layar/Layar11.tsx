'use client'

// Layar 11 — Hitung f(5) & Keputusan: 4 langkah berurutan
// ((5−p) → kuadrat → ×a → +q), aturan masuk 2,9–3,1 m,
// lalu panel Cek Jawaban ketiga kartu A/B/C.

import { useState } from 'react'
import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { CARDS, ZONA, type CardId } from '@/lib/mlb/data'
import { parseNum, eqTol, fmt } from '@/lib/mlb/util'
import { JudulLayar, Panel, Chip, IsiAngka, Tombol, KotakHasil, Petunjuk, PilihKapsul, GGBButton, PilihanKartu } from '../bits'
import { cn } from '@/lib/utils'

export default function Layar11() {
  const { s, upd, gantiKartu } = useMLB()
  const [bukaCek, setBukaCek] = useState(false)
  const kartu = s.kartu ? CARDS[s.kartu] : null

  if (!s.kartu || !kartu) {
    return (
      <div className="space-y-4">
        <JudulLayar fase={6} judul="Hitung f(5)" sub="Pilih dulu kartu datamu." />
        <Panel ikon="🃏" title="Kamu belum punya kartu">
          <p className="text-[17px]">Pilih salah satu kartu data — kartu ini akan dipakai di layar 8 sampai 11.</p>
          <PilihanKartu value="" onChange={k => gantiKartu(k)} />
        </Panel>
      </div>
    )
  }

  const p = kartu.peak.x
  const q = kartu.peak.y
  const kunci = [5 - p, (5 - p) * (5 - p), kartu.a * (5 - p) * (5 - p), kartu.f5]

  const langkahOk = (i: number) => eqTol(s.f5.s[i], kunci[i], 0.005)
  const semuanya = [0, 1, 2, 3].map(langkahOk)
  const f5Selesai = semuanya[3]

  const cekLangkah = (i: number) => {
    if (parseNum(s.f5.s[i]) === null) {
      toast.error('Isi dulu langkah ini ya.')
      return
    }
    if (langkahOk(i)) {
      toast.success(i === 3 ? `f(5) = ${fmt(kunci[3])}!` : 'Langkah benar!')
      return
    }
    upd(d => { d.f5.coba[i] += 1 })
    toast.error('Belum tepat — baca petunjuknya.')
  }

  const keputusanBenar = s.f5.keputusan !== '' && (s.f5.keputusan === 'masuk') === kartu.masuk

  const cekKeputusan = () => {
    if (s.f5.keputusan === '') {
      toast.error('Pilih dulu: masuk atau tidak?')
      return
    }
    if (keputusanBenar) toast.success('Keputusan analis tepat! ⚖️')
    else toast.error('Cek lagi aturan masuk 2,9 – 3,1 m.')
  }

  const labelLangkah = [
    <>5 − p = ? &nbsp;<Chip tone="biru">p = {fmt(p)}</Chip></>,
    <>(hasil langkah 1) dikuadratkan</>,
    <>{fmt(kartu.a)} × (hasil langkah 2)</>,
    <>(hasil langkah 3) + q &nbsp;<Chip tone="biru">q = {fmt(q)}</Chip></>,
  ]

  const petunjukLangkah = [
    <>Tulis dulu p = {fmt(p)}, lalu hitung 5 − {fmt(p)}. Hasilnya positif.</>,
    <>Kalikan hasil langkah 1 dengan dirinya sendiri: (hasil) × (hasil).</>,
    <>Perhatikan: a = {fmt(kartu.a)} itu <b>negatif</b> — hasilnya pasti negatif!</>,
    <>Tambahkan q = {fmt(q)} ke hasil langkah 3.</>,
  ]

  const cekBaris = (k: CardId) => {
    const sendiri = k === s.kartu
    const f5Str = s.cek3[k].f5 || (sendiri ? s.f5.s[3] : '')
    const kep = s.cek3[k].keputusan || (sendiri ? s.f5.keputusan : '')
    const v = parseNum(f5Str)
    if (v === null) {
      toast.error('Isi dulu f(5) untuk Kartu ' + k + '.')
      return
    }
    if (kep === '') {
      toast.error('Pilih dulu keputusan Kartu ' + k + '.')
      return
    }
    const f5Benar = Math.abs(v - CARDS[k].f5) <= 0.01
    const kepBenar = (kep === 'masuk') === CARDS[k].masuk
    upd(d => {
      d.cek3[k].f5 = f5Str
      d.cek3[k].keputusan = kep as '' | 'masuk' | 'tidak'
      d.cek3[k].dicek = true
    })
    if (f5Benar && kepBenar) toast.success(`Kartu ${k}: benar semua! ✅`)
    else if (!f5Benar) toast.error(`Kartu ${k}: hitung ulang f(5) — ingat urutan operasinya!`)
    else toast.error(`Kartu ${k}: keputusan belum sesuai aturan 2,9 – 3,1 m.`)
  }

  const masukZona = (v: number) => v >= ZONA.bawah - 0.0001 && v <= ZONA.atas + 0.0001

  return (
    <div className="space-y-4">
      <JudulLayar fase={6} judul="Hitung f(5) dan Ambil Keputusan" sub="Empat langkah berurutan — analis tidak boleh melompat!" />

      <Panel tone="navy" ikon="⚖️" title="Aturan Keputusan Pelatih">
        <p className="text-[14.5px]">
          Bola <b>MASUK</b> bila tingginya tepat di ring saat x = 5:
          <b> {fmt(ZONA.bawah)} m ≤ f(5) ≤ {fmt(ZONA.atas)} m</b> (ring 3 m ± 10 cm).
        </p>
      </Panel>

      <Panel ikon="🧮" title={`Empat Langkah untuk Kartu ${s.kartu}`}>
        {[0, 1, 2, 3].map(i => {
          const aktif = i === 0 || semuanya[i - 1]
          const ok = semuanya[i]
          return (
            <div key={i} className={cn('rounded-2xl p-3.5 ring-2 transition-all', ok ? 'ring-[#2E9E6B] bg-[#EAF7F0]' : aktif ? 'ring-slate-200 bg-white' : 'ring-slate-100 bg-slate-50 opacity-60')}>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className={cn('size-8 shrink-0 rounded-xl grid place-items-center font-black text-white text-sm', ok ? 'bg-[#2E9E6B]' : 'bg-[#17345A]')}>
                  {ok ? '✓' : i + 1}
                </span>
                <span className="font-extrabold text-[#17345A] text-[14.5px] flex-1 min-w-[140px]">{labelLangkah[i]}</span>
                <IsiAngka
                  value={s.f5.s[i]}
                  onChange={v => upd(d => { d.f5.s[i] = v })}
                  disabled={!aktif || ok}
                  status={s.f5.s[i] ? (ok ? 'ok' : 'salah') : null}
                  ariaLabel={`Langkah ${i + 1}`}
                />
                <Tombol varian="navy" className="h-11 px-4 text-sm" disabled={!aktif || ok} onClick={() => cekLangkah(i)}>
                  Cek
                </Tombol>
              </div>
              {s.f5.coba[i] >= 2 && !ok && (
                <div className="mt-2.5">
                  <Petunjuk>{petunjukLangkah[i]}</Petunjuk>
                </div>
              )}
            </div>
          )
        })}
      </Panel>

      {f5Selesai && (
        <Panel tone="oranye" ikon="⚖️" title={`Keputusan untuk Kartu ${s.kartu}`}>
          <p className="text-[14.5px]">
            f(5) = <b>{s.f5.s[3]}</b> m. Sesuai aturan ({fmt(ZONA.bawah)} – {fmt(ZONA.atas)} m), lemparan ini…
          </p>
          <PilihKapsul
            value={s.f5.keputusan}
            onChange={v => upd(d => { d.f5.keputusan = v as '' | 'masuk' | 'tidak' })}
            opsi={[
              { v: 'masuk', label: '✅ MASUK' },
              { v: 'tidak', label: '❌ TIDAK MASUK' },
            ]}
          />
          <Tombol varian="navy" onClick={cekKeputusan}>Ambil Keputusan!</Tombol>
          {s.f5.keputusan !== '' && (
            keputusanBenar ? (
              <KotakHasil status="ok" judul={kartu.masuk ? 'MASUK! Tepat di ring 🏀' : 'Tepat! TIDAK MASUK'}>
                f(5) = {fmt(kartu.f5)} m — {kartu.selisih}.
              </KotakHasil>
            ) : (
              <KotakHasil status="salah" judul="Keputusan belum tepat">
                f(5) = {fmt(kartu.f5)} m {masukZona(kartu.f5) ? '(di dalam zona 2,9–3,1 m)' : '(di luar zona 2,9–3,1 m)'} — periksa lagi aturannya!
              </KotakHasil>
            )
          )}
        </Panel>
      )}

      <Panel ikon="✅" title="Panel Cek Jawaban: Kartu A, B, C">
        <p className="text-[16px]">Data ketiga kartu dari tim analis lain. Hitung f(5) dan putuskan masuk/tidak untuk semuanya.</p>
        <Tombol varian="primer" className="w-full" onClick={() => setBukaCek(b => !b)}>
          {bukaCek ? '▲ Tutup panel cek jawaban' : '▼ Buka panel cek jawaban'}
        </Tombol>
        {bukaCek && (
          <div className="space-y-3">
            {(['A', 'B', 'C'] as const).map(k => {
              const c = CARDS[k]
              const r = s.cek3[k]
              const sendiri = k === s.kartu
              const f5Nilai = r.f5 || (sendiri ? s.f5.s[3] : '')
              const kepNilai = r.keputusan || (sendiri ? s.f5.keputusan : '')
              const v = parseNum(f5Nilai)
              const benar = r.dicek && v !== null && Math.abs(v - c.f5) <= 0.01 && kepNilai !== '' && ((kepNilai === 'masuk') === c.masuk)
              return (
                <div key={k} className={cn('rounded-2xl p-3.5 ring-2 space-y-2.5', sendiri ? 'ring-[#F8D2AF] bg-[#FFF3E8]' : 'ring-slate-200 bg-white')}>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="size-8 rounded-xl bg-[#17345A] text-white font-black grid place-items-center text-sm">{k}</span>
                    <Chip tone="abu">a = {fmt(c.a)} · p = {fmt(c.peak.x)} · q = {fmt(c.peak.y)}</Chip>
                    {sendiri && <Chip tone="oranye">kartumu</Chip>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-[#17345A] text-sm">f(5) =</span>
                    <IsiAngka value={f5Nilai} onChange={val => upd(d => { d.cek3[k].f5 = val })} className="w-20" ariaLabel={`f5 kartu ${k}`} />
                    <PilihKapsul
                      value={kepNilai}
                      onChange={val => upd(d => { d.cek3[k].keputusan = val as '' | 'masuk' | 'tidak' })}
                      opsi={[
                        { v: 'masuk', label: '✅ Masuk' },
                        { v: 'tidak', label: '❌ Tidak' },
                      ]}
                    />
                    <Tombol varian="navy" className="h-11 px-4 text-sm" onClick={() => cekBaris(k)}>Cek</Tombol>
                  </div>
                  {r.dicek && (
                    <p className={cn('text-[13.5px] font-extrabold', benar ? 'text-[#1F7A4D]' : 'text-[#B03044]')}>
                      {benar ? '✓ ' : '✗ '}f(5) = {fmt(c.f5)} m — {c.selisih} → {c.masuk ? 'MASUK' : 'TIDAK MASUK'}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </Panel>

      <div><GGBButton g="G3" label="Buka Simulator di GeoGebra" /></div>
    </div>
  )
}
