'use client'

// Layar 11 — Hitung f(5) & Keputusan: 4 langkah berurutan
// ((5−p) → kuadrat → ×a → +q), aturan masuk 2,9–3,1 m,
// lalu panel Cek Jawaban ketiga kartu A/B/C.

import { useState } from 'react'
import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { CARDS, ZONA, RING, type CardId } from '@/lib/mlb/data'
import { parseNum, eqTol, fmt } from '@/lib/mlb/util'
import { JudulLayar, Panel, Chip, IsiAngka, IsiTeks, Tombol, KotakHasil, Petunjuk, PilihKapsul, GGBButton, PilihanKartu } from '../bits'
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

  const selisihv = parseNum(s.f5.selisih)
  const selisihOk = selisihv !== null && Math.abs(selisihv - (kartu.f5 - RING.y)) <= 0.01
  const cekSelisih = () => {
    if (selisihv === null) { toast.error('Isi dulu selisihnya ya.'); return }
    if (selisihOk) { toast.success(`Tepat! f(5) − 3 = ${fmt(kartu.f5 - RING.y)} m.`); return }
    toast.error(`Belum tepat — ingat: ${fmt(kartu.f5)} − 3, dan hasilnya bisa negatif.`)
  }

  // Saran geser puncak (LKPD F Langkah 4): benar bila f(5) di luar zona.
  const kurangTinggi = kartu.f5 < ZONA.bawah
  const kepalaSaran = { mendatar: kurangTinggi ? 'kanan' : 'kiri', vertikal: kurangTinggi ? 'naik' : 'turun' }
  const saranOk =
    kartu.masuk
      ? s.f5.saran.tulis.trim().length >= 5
      : s.f5.saran.mendatar === kepalaSaran.mendatar && s.f5.saran.vertikal === kepalaSaran.vertikal
  const cekSaran = () => {
    if (kartu.masuk) {
      if (s.f5.saran.tulis.trim().length < 5) { toast.error('Tulis dulu satu kalimat saran pertahananmu.'); return }
      toast.success('Saran tercatat — analis handal menjaga konsistensi! 💪')
      return
    }
    if (saranOk) { toast.success('Saran tepat — geser puncak ke arah yang benar! 🧭'); return }
    upd(d => { d.f5.cobaSaran += 1 })
    toast.error('Belum tepat — perhatikan arah mana yang menaikkan/menurunkan f(5).')
  }

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
        <p className="text-[17px]">
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
                <span className={cn('size-8 shrink-0 rounded-xl grid place-items-center font-black text-white text-[16px]', ok ? 'bg-[#2E9E6B]' : 'bg-[#17345A]')}>
                  {ok ? '✓' : i + 1}
                </span>
                <span className="font-extrabold text-[#17345A] text-[17px] flex-1 min-w-[140px]">{labelLangkah[i]}</span>
                <IsiAngka
                  value={s.f5.s[i]}
                  onChange={v => upd(d => { d.f5.s[i] = v })}
                  disabled={!aktif || ok}
                  status={s.f5.s[i] ? (ok ? 'ok' : 'salah') : null}
                  ariaLabel={`Langkah ${i + 1}`}
                />
                <Tombol varian="navy" className="h-11 px-4 text-[16px]" disabled={!aktif || ok} onClick={() => cekLangkah(i)}>
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
          <p className="text-[17px]">
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

      {/* Langkah 2 — bandingkan dengan tinggi ring */}
      {f5Selesai && (
        <Panel ikon="📏" title="Langkah 2 — Bandingkan dengan Tinggi Ring">
          <p className="text-[17px]">
            Ring tingginya <b>3 m</b>. Berapa selisih tinggi bola dengan ring?
          </p>
          <div className="flex items-center gap-2.5 flex-wrap text-[17px] font-extrabold text-[#17345A]">
            <span>f(5) − 3 =</span>
            <IsiAngka
              value={s.f5.selisih}
              onChange={v => upd(d => { d.f5.selisih = v })}
              status={s.f5.selisih ? (selisihOk ? 'ok' : 'salah') : null}
              ariaLabel="Selisih f(5) dengan tinggi ring"
            />
            <span>m</span>
            <Tombol varian="navy" className="h-11 px-4 text-[16px]" onClick={cekSelisih}>Cek</Tombol>
            {selisihOk && <Chip tone={kartu.f5 > RING.y ? 'kuning' : kartu.f5 < RING.y ? 'biru' : 'hijau'}>{fmt(kartu.f5 - RING.y)} m {kartu.f5 > RING.y ? 'di atas ring' : kartu.f5 < RING.y ? 'di bawah ring' : 'tepat setinggi ring'}</Chip>}
          </div>
        </Panel>
      )}

      {/* Langkah 3 — alasan berangka + Langkah 4 — saran */}
      {keputusanBenar && (
        <Panel tone="biru" ikon="✍️" title="Langkah 3 — Tulis Alasanmu dengan Angka">
          <p className="text-[17px] font-extrabold text-[#17345A]">
            Alasanku: tinggi bola di x = 5 adalah {fmt(kartu.f5)} m, sedangkan ring tingginya 3 m, sehingga…
          </p>
          <IsiTeks
            value={s.f5.alasan}
            onChange={v => upd(d => { d.f5.alasan = v })}
            rows={2}
            placeholder={kartu.masuk ? 'contoh: bola tepat masuk karena selisihnya 0 m…' : `contoh: bola ${kartu.f5 > RING.y ? 'melewati ring' : 'jatuh di bawah ring'} karena selisihnya ${fmt(Math.abs(kartu.f5 - RING.y))} m…`}
            ariaLabel="Alasan berangka"
          />
          <p className="text-[13px] font-bold text-slate-400">✓ Jawaban terbuka — tidak dinilai, tersimpan otomatis.</p>
        </Panel>
      )}

      {keputusanBenar && (
        <Panel tone="navy" ikon="🧭" title="Langkah 4 — Saran untuk Pemain">
          {kartu.masuk ? (
            <div className="space-y-2">
              <p className="text-[17px]">
                Lemparanmu <b>sudah masuk</b> 🎉. Tulis satu kalimat saran agar pemain bisa <b>mempertahankannya</b>:
              </p>
              <IsiTeks
                value={s.f5.saran.tulis}
                onChange={v => upd(d => { d.f5.saran.tulis = v })}
                rows={2}
                placeholder="contoh: pertahankan puncak di (3 ; 3,8) dan lepas dari (0 ; 2) agar f(5) tetap 3 m…"
                ariaLabel="Saran pertahanan"
              />
              <Tombol varian="navy" onClick={cekSaran}>Simpan Saran</Tombol>
            </div>
          ) : (
            <div className="space-y-2.5">
              <p className="text-[17px]">
                Agar bola masuk ring, titik puncak sebaiknya digeser ke:
              </p>
              <div className="space-y-1.5">
                <p className="text-[16px] font-bold text-[#17345A]">↔️ Mendatar:</p>
                <PilihKapsul
                  value={s.f5.saran.mendatar}
                  onChange={v => upd(d => { d.f5.saran.mendatar = v as '' | 'kiri' | 'kanan' })}
                  opsi={[
                    { v: 'kiri', label: '⬅️ kiri' },
                    { v: 'kanan', label: '➡️ kanan' },
                  ]}
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-[16px] font-bold text-[#17345A]">↕️ Vertikal:</p>
                <PilihKapsul
                  value={s.f5.saran.vertikal}
                  onChange={v => upd(d => { d.f5.saran.vertikal = v as '' | 'turun' | 'naik' })}
                  opsi={[
                    { v: 'naik', label: '⬆️ lebih tinggi' },
                    { v: 'turun', label: '⬇️ lebih rendah' },
                  ]}
                />
              </div>
              <Tombol varian="navy" onClick={cekSaran}>Cek Saran</Tombol>
              {s.f5.cobaSaran >= 2 && !saranOk && (
                <Petunjuk>
                  f(5) mu {fmt(kartu.f5)} m {kurangTinggi ? '< 2,9 m — bola kurang tinggi: puncak harus lebih tinggi' : '> 3,1 m — bola kelewatan tinggi: puncak harus lebih rendah'},
                  dan digeser {kepalaSaran.mendatar} agar di x = 5 bola tepat {kurangTinggi ? 'naik' : 'turun'} ke ring.
                </Petunjuk>
              )}
            </div>
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
                    <span className="size-8 rounded-xl bg-[#17345A] text-white font-black grid place-items-center text-[16px]">{k}</span>
                    <Chip tone="abu">a = {fmt(c.a)} · p = {fmt(c.peak.x)} · q = {fmt(c.peak.y)}</Chip>
                    {sendiri && <Chip tone="oranye">kartumu</Chip>}
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-extrabold text-[#17345A] text-[16px]">f(5) =</span>
                    <IsiAngka value={f5Nilai} onChange={val => upd(d => { d.cek3[k].f5 = val })} className="w-20" ariaLabel={`f5 kartu ${k}`} />
                    <PilihKapsul
                      value={kepNilai}
                      onChange={val => upd(d => { d.cek3[k].keputusan = val as '' | 'masuk' | 'tidak' })}
                      opsi={[
                        { v: 'masuk', label: '✅ Masuk' },
                        { v: 'tidak', label: '❌ Tidak' },
                      ]}
                    />
                    <Tombol varian="navy" className="h-11 px-4 text-[16px]" onClick={() => cekBaris(k)}>Cek</Tombol>
                  </div>
                  {r.dicek && (
                    <p className={cn('text-[15px] font-extrabold', benar ? 'text-[#1F7A4D]' : 'text-[#B03044]')}>
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
