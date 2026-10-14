'use client'

// Layar 10 — Menemukan Fungsi: contoh a = −0,25, lalu tugas
// mencari a kartu sendiri dengan cek f(0) = 2 dan pesan
// miskonsepsi tanda p bila gagal.

import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { CARDS, CONTOH } from '@/lib/mlb/data'
import { eqTol, parseNum, fmt } from '@/lib/mlb/util'
import { JudulLayar, Panel, Chip, IsiAngka, Tombol, KotakHasil, Petunjuk, PilihanKartu } from '../bits'

export default function Layar10() {
  const { s, upd, gantiKartu } = useMLB()
  const kartu = s.kartu ? CARDS[s.kartu] : null

  if (!s.kartu || !kartu) {
    return (
      <div className="space-y-4">
        <JudulLayar fase={5} judul="Menemukan Fungsi" sub="Pilih dulu kartu datamu." />
        <Panel ikon="🃏" title="Kamu belum punya kartu">
          <p className="text-[17px]">Pilih salah satu kartu data — kartu ini akan dipakai di layar 8 sampai 11.</p>
          <PilihanKartu value="" onChange={k => gantiKartu(k)} />
        </Panel>
      </div>
    )
  }

  const p = kartu.peak.x
  const q = kartu.peak.y
  const aVal = parseNum(s.aCari.a)
  const aOk = aVal !== null && Math.abs(aVal - kartu.a) <= 0.005
  const f0 = aVal !== null ? aVal * p * p + q : null

  const cek = () => {
    if (aVal === null) {
      toast.error('Isi dulu nilai a-nya ya.')
      return
    }
    if (aOk) {
      toast.success('a ditemukan! Fungsi lintasan Kartu ' + s.kartu + ' lengkap 🎉')
      return
    }
    upd(d => { d.aCari.coba += 1 })
    toast.error('Belum tepat — periksa hitungan dan tanda p.')
  }

  return (
    <div className="space-y-4">
      <JudulLayar fase={5} judul="Menemukan Fungsi Lintasan" sub="Puncak sudah ketemu (p ; q). Sekarang cari a lewat titik lepas (0 ; 2)." />

      <Panel tone="oranye" ikon="🎓" title="Contoh dengan Kartu Latihan">
        <p className="text-[14px]">
          Diketahui puncak <b>(2 ; 3)</b> → f(x) = a(x − 2)² + 3. Bola lepas dari <b>(0 ; 2)</b>, artinya <b>f(0) = 2</b>:
        </p>
        <p className="text-[14px] font-bold text-[#17345A]">
          2 = a(0 − 2)² + 3 → 2 = 4a + 3 → 4a = −1 → <span className="text-[#B45309]">a = −0,25</span>
        </p>
        <p className="text-[14px]">Jadi f(x) = <b>{CONTOH.fx}</b>. Tanda a negatif — grafik terbuka ke bawah seperti lintasan bola!</p>
      </Panel>

      <Panel tone="biru" ikon="🧩" title={`Tugas: Kartu ${s.kartu}`}>
        <div className="flex flex-wrap gap-2">
          <Chip tone="biru">p = {fmt(p)} (layar 9)</Chip>
          <Chip tone="biru">q = {fmt(q)} (layar 9)</Chip>
          <Chip tone="kuning">titik lepas (0 ; 2) → f(0) = 2</Chip>
        </div>
        <p className="text-[14.5px]">
          Bentuk fungsinya: f(x) = a(x − {fmt(p)})² + {fmt(q)}. Gunakan f(0) = 2 untuk mencari a:
        </p>
        <p className="text-[15px] font-extrabold text-[#17345A]">
          2 = a(0 − {fmt(p)})² + {fmt(q)} → a = ?
        </p>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="font-extrabold text-[#17345A]">a =</span>
          <IsiAngka
            value={s.aCari.a}
            onChange={v => upd(d => { d.aCari.a = v })}
            status={s.aCari.a ? (aOk ? 'ok' : 'salah') : null}
            ariaLabel="Nilai a"
          />
          <Tombol varian="navy" className="h-11 px-4 text-sm" onClick={cek}>Cek a</Tombol>
        </div>

        {s.aCari.a && !aOk && aVal !== null && f0 !== null && (
          <KotakHasil status="salah" judul="Uji f(0) = 2 gagal">
            Dengan a-mu: f(0) = {fmt(aVal)} × {fmt(p)}² + {fmt(q)} = {fmt(f0)} ≠ 2. Coba hitung ulang!
          </KotakHasil>
        )}

        {s.aCari.coba >= 1 && !aOk && (
          <Petunjuk>
            Rumus cepat: <b>a = (2 − q) : p²</b>. Hitung dulu (0 − {fmt(p)})² = {fmt(p * p)}, lalu
            a = (2 − {fmt(q)}) : {fmt(p * p)}.
          </Petunjuk>
        )}

        {s.aCari.coba >= 2 && !aOk && (
          <div className="rounded-2xl bg-[#FFF8E2] ring-2 ring-[#F0E0A0] p-4 text-[#6B5508] text-[14px] font-semibold animate-fadein">
            <p className="font-extrabold flex items-center gap-2">⚠️ Cek tanda p!</p>
            <p className="mt-1.5 leading-relaxed">
              Bentuk kita <b>(x − {fmt(p)})</b> → puncak di x = <b>{fmt(p)}</b>. Kalau tertulis
              <b> (x + {fmt(p)})</b>, puncaknya justru x = <b>−{fmt(p)}</b>. Tanda p selalu <b>dibalik</b> dari
              tanda di dalam kurung!
            </p>
          </div>
        )}
      </Panel>

      {aOk && aVal !== null && (
        <KotakHasil status="ok" judul={`Fungsi Lintasan Kartu ${s.kartu} ditemukan!`}>
          <p className="text-[16px] font-black">f(x) = {fmt(aVal)}(x − {fmt(p)})² + {fmt(q)}</p>
          <p className="mt-1.5">
            Cek otomatis: f(0) = {fmt(aVal)} × {fmt(p)}² + {fmt(q)} = <b>2 ✓</b> — fungsi lewat titik lepas bola!
          </p>
        </KotakHasil>
      )}
    </div>
  )
}
