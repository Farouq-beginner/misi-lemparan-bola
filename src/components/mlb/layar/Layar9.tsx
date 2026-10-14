'use client'

// Layar 9 — Sumbu Simetri: 3 langkah + contoh terbimbing.
// Pilih dua titik setinggi sama → isi sumbu simetri → isi puncak q.

import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { CARDS, CONTOH } from '@/lib/mlb/data'
import { eqTol, fmt } from '@/lib/mlb/util'
import { JudulLayar, Panel, Chip, IsiAngka, Tombol, KotakHasil, Petunjuk, PilihanKartu } from '../bits'
import { MiniKurva } from '../grafik'
import { cn } from '@/lib/utils'

export default function Layar9() {
  const { s, upd } = useMLB()
  const kartu = s.kartu ? CARDS[s.kartu] : null

  if (!s.kartu || !kartu) {
    return (
      <div className="space-y-4">
        <JudulLayar fase={5} judul="Sumbu Simetri" sub="Pilih dulu kartu datamu." />
        <Panel ikon="🃏" title="Kamu belum punya kartu">
          <p className="text-[14.5px]">Pilih salah satu kartu data — kartu ini akan dipakai di layar 8 sampai 11.</p>
          <PilihanKartu value="" onChange={k => upd(d => { d.kartu = k })} />
        </Panel>
      </div>
    )
  }

  const duo = s.simetri.duo
  const p1 = typeof duo[0] === 'number' ? kartu.points[duo[0]] : null
  const p2 = typeof duo[1] === 'number' ? kartu.points[duo[1]] : null
  const duaTitik = !!p1 && !!p2
  const setinggi = duaTitik && Math.abs((p1?.y ?? 0) - (p2?.y ?? 0)) < 0.001

  const sumbuOk = eqTol(s.simetri.sumbu, kartu.simX, 0.01)
  const qOk = eqTol(s.simetri.q, kartu.peak.y, 0.01)

  const pilih = (i: number) => {
    upd(d => {
      const arr = d.simetri.duo
      const ix = arr.indexOf(i)
      if (ix >= 0) arr.splice(ix, 1)
      else {
        if (arr.length >= 2) arr.shift()
        arr.push(i)
      }
    })
  }

  const cekSumbu = () => {
    if (sumbuOk) {
      toast.success('Sumbu simetri benar! 📏')
      return
    }
    upd(d => { d.simetri.coba.sumbu += 1 })
    toast.error('Belum tepat — baca petunjuknya.')
  }

  const cekQ = () => {
    if (qOk) {
      toast.success('Tinggi puncak benar! 🎯')
      return
    }
    upd(d => { d.simetri.coba.q += 1 })
    toast.error('Belum tepat — baca petunjuknya.')
  }

  return (
    <div className="space-y-4">
      <JudulLayar fase={5} judul="Sumbu Simetri → Puncak" sub="Tiga langkah menemukan puncak tanpa rumus rumit." />

      <Panel tone="biru" ikon="📏" title="3 Langkah Menemukan Puncak">
        <ol className="list-decimal ml-5 space-y-1.5 text-[14.5px]">
          <li>Cari <b>dua titik yang tingginya sama</b> di kartu datamu.</li>
          <li>Sumbu simetri: <b>x = (x₁ + x₂) : 2</b> — tepat di tengah keduanya.</li>
          <li>Puncak: <b>p</b> = sumbu simetri, <b>q</b> = tinggi titik pada sumbu simetri (titik tertinggi).</li>
        </ol>
      </Panel>

      <Panel tone="oranye" ikon="🎓" title="Contoh Terbimbing (bukan kartumu)">
        <p className="text-[14px]">
          Kartu latihan punya titik <b>(1 ; 2,75)</b> dan <b>(3 ; 2,75)</b> — tingginya sama!
        </p>
        <p className="text-[14px]">
          Sumbu simetri: x = (1 + 3) : 2 = <b>2</b> → titik di x = 2 adalah (2 ; 3) → puncak <b>(2 ; 3)</b>.
        </p>
        <div className="rounded-2xl bg-white ring-1 ring-[#F8D2AF] p-2">
          <MiniKurva a={CONTOH.a} p={CONTOH.peak.x} q={CONTOH.peak.y} />
        </div>
      </Panel>

      <Panel ikon="🃏" title={`Kerjakan Kartu ${s.kartu}`}>
        <p className="text-[13.5px] text-slate-500 font-semibold">1️⃣ Ketuk <b>dua titik</b> yang tingginya sama:</p>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih dua titik setinggi">
          {kartu.points.map((p, i) => {
            const aktif = duo.includes(i)
            return (
              <button
                key={i}
                type="button"
                aria-pressed={aktif}
                onClick={() => pilih(i)}
                className={cn(
                  'rounded-2xl px-3.5 h-11 font-extrabold text-sm border-2 transition-all active:scale-95',
                  aktif
                    ? 'bg-[#F97316] border-[#EA580C] text-white shadow-md'
                    : 'bg-white border-slate-200 text-[#17345A] hover:border-orange-300',
                )}
              >
                ({p.x} ; {fmt(p.y)})
              </button>
            )
          })}
        </div>
        {duaTitik && !setinggi && (
          <KotakHasil status="info" judul="Tinggi kedua titik belum sama">
            Cari pasangan lain yang letaknya menggantung pada ketinggian yang sama. 💡
          </KotakHasil>
        )}
        {setinggi && (
          <Chip tone="hijau">✓ pasangan setinggi: ({fmt(p1?.x ?? 0)} ; {fmt(p1?.y ?? 0)}) dan ({fmt(p2?.x ?? 0)} ; {fmt(p2?.y ?? 0)})</Chip>
        )}

        <div className="space-y-2">
          <p className="font-extrabold text-[#17345A]">2️⃣ Sumbu simetri: x =</p>
          <div className="flex items-center gap-2.5 flex-wrap">
            <IsiAngka
              value={s.simetri.sumbu}
              onChange={v => upd(d => { d.simetri.sumbu = v })}
              disabled={!setinggi}
              status={s.simetri.sumbu ? (sumbuOk ? 'ok' : 'salah') : null}
              ariaLabel="Sumbu simetri"
            />
            <Tombol varian="navy" className="h-11 px-4 text-sm" disabled={!setinggi} onClick={cekSumbu}>Cek</Tombol>
            {sumbuOk && <Chip tone="hijau">✓ x = {fmt(kartu.simX)}</Chip>}
          </div>
          {s.simetri.coba.sumbu >= 2 && !sumbuOk && (
            <Petunjuk>Jumlahkan x kedua titik setinggi tadi, lalu bagi dua: x = (x₁ + x₂) : 2.</Petunjuk>
          )}
        </div>

        <div className="space-y-2">
          <p className="font-extrabold text-[#17345A]">3️⃣ Tinggi puncak: q =</p>
          <div className="flex items-center gap-2.5 flex-wrap">
            <IsiAngka
              value={s.simetri.q}
              onChange={v => upd(d => { d.simetri.q = v })}
              disabled={!sumbuOk}
              status={s.simetri.q ? (qOk ? 'ok' : 'salah') : null}
              ariaLabel="Tinggi puncak q"
            />
            <Tombol varian="navy" className="h-11 px-4 text-sm" disabled={!sumbuOk} onClick={cekQ}>Cek</Tombol>
          </div>
          {s.simetri.coba.q >= 2 && !qOk && (
            <Petunjuk>
              Cari titik yang x-nya = {fmt(kartu.simX)} (tepat di sumbu simetri) pada kartu datamu — tingginya itulah q.
            </Petunjuk>
          )}
        </div>
      </Panel>

      {qOk && (
        <KotakHasil status="ok" judul={`Puncak Kartu ${s.kartu}: (${fmt(kartu.peak.x)} ; ${fmt(kartu.peak.y)})`}>
          Sumbu simetri x = {fmt(kartu.simX)}, puncak (p ; q) = ({fmt(kartu.peak.x)} ; {fmt(kartu.peak.y)}).
          Simpan baik-baik — p dan q ini dipakai di layar berikutnya!
        </KotakHasil>
      )}
    </div>
  )
}
