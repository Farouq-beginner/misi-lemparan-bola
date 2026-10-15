'use client'

// Layar 9 — Sumbu Simetri: 5 langkah + contoh terbimbing.
// 1) contoh → 2) ketuk dua titik setinggi → 3) tengah kedua titik
// (sumbu simetri) → 4) titik puncak (p ; q) → 5) arti p dan q.

import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { CARDS, CONTOH } from '@/lib/mlb/data'
import { eqTol, fmt, parseNum } from '@/lib/mlb/util'
import {
  JudulLayar, Panel, Chip, IsiAngka, Tombol, KotakHasil, Petunjuk,
  PilihanKartu, BarisCek, PilihKapsul,
} from '../bits'
import { MiniKurva } from '../grafik'
import { cn } from '@/lib/utils'

export default function Layar9() {
  const { s, upd, gantiKartu } = useMLB()
  const kartu = s.kartu ? CARDS[s.kartu] : null

  if (!s.kartu || !kartu) {
    return (
      <div className="space-y-4">
        <JudulLayar fase={5} judul="Sumbu Simetri" sub="Pilih dulu kartu datamu." />
        <Panel ikon="🃏" title="Kamu belum punya kartu">
          <p className="text-[17px]">Pilih salah satu kartu data — kartu ini akan dipakai di layar 8 sampai 11.</p>
          <PilihanKartu value="" onChange={k => gantiKartu(k)} />
        </Panel>
      </div>
    )
  }

  const duo = s.simetri.duo
  const p1 = typeof duo[0] === 'number' ? kartu.points[duo[0]] : null
  const p2 = typeof duo[1] === 'number' ? kartu.points[duo[1]] : null
  const duaTitik = !!p1 && !!p2
  const setinggi = duaTitik && Math.abs((p1?.y ?? 0) - (p2?.y ?? 0)) < 0.001

  // Langkah 3 — nilai x kedua titik & titik tengahnya
  const x1v = parseNum(s.simetri.x1)
  const x2v = parseNum(s.simetri.x2)
  const tengahv = parseNum(s.simetri.tengah)
  const x1Ok = x1v !== null && duaTitik && (eqTol(x1v, p1!.x, 0.01) || eqTol(x1v, p2!.x, 0.01))
  const x2Ok = x2v !== null && duaTitik && (eqTol(x2v, p1!.x, 0.01) || eqTol(x2v, p2!.x, 0.01))
  const xDuoOk =
    x1Ok && x2Ok && duaTitik &&
    ((eqTol(x1v, p1!.x, 0.01) && eqTol(x2v, p2!.x, 0.01)) ||
      (eqTol(x1v, p2!.x, 0.01) && eqTol(x2v, p1!.x, 0.01)))
  const tengahOk = xDuoOk && tengahv !== null && Math.abs(tengahv - kartu.simX) <= 0.01
  const sumbuOk = eqTol(s.simetri.sumbu, kartu.simX, 0.01)

  // Langkah 4 — titik puncak (p ; q)
  const pOk = eqTol(s.simetri.p, kartu.peak.x, 0.01)
  const qOk = eqTol(s.simetri.q, kartu.peak.y, 0.01)
  const puncakOk = pOk && qOk

  // Langkah 5 — arti p dan q ('x' = jarak mendatar, 'y' = tinggi maksimum)
  const artiDiisi = s.simetri.arti.p !== '' && s.simetri.arti.q !== ''
  const artiBenar = s.simetri.arti.p === 'x' && s.simetri.arti.q === 'y'

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

  // Pasangan 2 (LKPD Bagian D Langkah 2 — hanya Kartu B): dua titik
  // setinggi DI LUAR pasangan pertama. Kartu B punya dua pasangan.
  const duo2 = s.simetri.duo2
  const d1 = typeof duo2[0] === 'number' ? kartu.points[duo2[0]] : null
  const d2 = typeof duo2[1] === 'number' ? kartu.points[duo2[1]] : null
  const pasangan2 =
    !!d1 && !!d2 &&
    !duo.includes(duo2[0]) && !duo.includes(duo2[1]) &&
    Math.abs(d1.y - d2.y) < 0.001
  const pilih2 = (i: number) => {
    upd(d => {
      const arr = d.simetri.duo2
      const ix = arr.indexOf(i)
      if (ix >= 0) arr.splice(ix, 1)
      else {
        if (arr.length >= 2) arr.shift()
        arr.push(i)
      }
    })
  }

  const cekTengah = () => {
    if (tengahOk) {
      toast.success('Tengah kedua titik benar — itulah sumbu simetri! 📐')
      return
    }
    upd(d => { d.simetri.coba.tengah += 1 })
    toast.error(xDuoOk ? 'Belum tepat — jumlahkan kedua nilai x, lalu bagi 2.' : 'Isi dulu kedua nilai x titik pilihanmu sesuai kartu.')
  }

  const cekSumbu = () => {
    if (sumbuOk) {
      toast.success('Sumbu simetri benar! 📏')
      return
    }
    upd(d => { d.simetri.coba.sumbu += 1 })
    toast.error('Belum tepat — baca petunjuknya.')
  }

  const cekPuncak = () => {
    if (puncakOk) {
      toast.success('Titik puncak benar! 🎯')
      return
    }
    upd(d => { d.simetri.coba.p += 1 })
    toast.error('Belum tepat — baca petunjuknya.')
  }

  const opsiArti = (nilai: '' | 'x' | 'y') => [
    { v: 'x', label: `${nilai === 'x' ? '☑' : '☐'} jarak mendatar bola saat berada di titik tertinggi` },
    { v: 'y', label: `${nilai === 'y' ? '☑' : '☐'} tinggi maksimum bola` },
  ]

  return (
    <div className="space-y-4">
      <JudulLayar fase={5} judul="Sumbu Simetri → Puncak" sub="Lima langkah menemukan puncak tanpa rumus rumit." />

      <Panel tone="biru" ikon="📏" title="5 Langkah Menemukan Puncak">
        <ol className="list-decimal ml-5 space-y-1.5 text-[17px]">
          <li>Amati <b>contoh terbimbing</b> di bawah — pemanasan sebelum kartumu.</li>
          <li>Ketuk <b>dua titik</b> di kartumu yang tingginya sama.</li>
          <li>Cari nilai x <b>tepat di tengah</b> kedua titik itu: jumlahkan kedua nilai x, lalu bagi 2 — itulah sumbu simetri.</li>
          <li><b>Tandai titik tertinggi</b> pada kurvamu — itulah titik puncak <b>(p ; q)</b>.</li>
          <li>Pahami arti p dan q: <b>p</b> = jarak mendatar pada titik tertinggi, <b>q</b> = tinggi maksimum bola.</li>
        </ol>
      </Panel>

      <Panel tone="oranye" ikon="🎓" title="1️⃣ Contoh Terbimbing (bukan kartumu)">
        <p className="text-[16px]">
          Kartu latihan punya titik <b>(1 ; 2,75)</b> dan <b>(3 ; 2,75)</b> — tingginya sama!
        </p>
        <p className="text-[16px]">
          Tengah = (1 + 3) : 2 = <b>2</b> → sumbu simetri garis <b>x = 2</b> → titik di x = 2 adalah (2 ; 3)
          → puncak <b>(2 ; 3)</b>. Artinya: p = 2 (jarak mendatar), q = 3 (tinggi maksimum).
        </p>
        <div className="rounded-2xl bg-white ring-1 ring-[#F8D2AF] p-2">
          <MiniKurva a={CONTOH.a} p={CONTOH.peak.x} q={CONTOH.peak.y} />
        </div>
      </Panel>

      <Panel ikon="🃏" title={`Kerjakan Kartu ${s.kartu}`}>
        <p className="text-[15px] text-slate-500 font-semibold">2️⃣ Ketuk <b>dua titik</b> yang tingginya sama:</p>
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
                  'rounded-2xl px-3.5 h-11 font-extrabold text-[16px] border-2 transition-all active:scale-95',
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
          <Chip tone="hijau">✓ Pasangan 1 setinggi: ({fmt(p1?.x ?? 0)} ; {fmt(p1?.y ?? 0)}) dan ({fmt(p2?.x ?? 0)} ; {fmt(p2?.y ?? 0)})</Chip>
        )}

        {s.kartu === 'B' && (
          <div className="space-y-2">
            <p className="text-[15px] text-slate-500 font-semibold">
              ➕ <b>Pasangan 2 (khusus Kartu B)</b> — pasangan titik setinggi yang <i>lain</i>:
            </p>
            <div className="flex flex-wrap gap-2" role="group" aria-label="Pilih pasangan kedua">
              {kartu.points.map((p, i) => {
                const aktif = duo2.includes(i)
                return (
                  <button
                    key={i}
                    type="button"
                    aria-pressed={aktif}
                    onClick={() => pilih2(i)}
                    className={cn(
                      'rounded-2xl px-3.5 h-11 font-extrabold text-[16px] border-2 transition-all active:scale-95',
                      aktif
                        ? 'bg-[#3D6DB5] border-[#2C548F] text-white shadow-md'
                        : 'bg-white border-slate-200 text-[#17345A] hover:border-blue-300',
                    )}
                  >
                    ({p.x} ; {fmt(p.y)})
                  </button>
                )
              })}
            </div>
            {pasangan2 ? (
              <Chip tone="hijau">✓ Pasangan 2 setinggi: ({fmt(d1?.x ?? 0)} ; {fmt(d1?.y ?? 0)}) dan ({fmt(d2?.x ?? 0)} ; {fmt(d2?.y ?? 0)}) — tengahnya juga x = {fmt(kartu.simX)}!</Chip>
            ) : (
              <p className="text-[13.5px] font-bold text-slate-400">Pilih dua titik setinggi yang belum terpakai (opsional — melatih pengamatan).</p>
            )}
          </div>
        )}

        <div className="space-y-2">
          <p className="font-extrabold text-[#17345A]">3️⃣ Cari nilai x tepat di tengah kedua titik itu.</p>
          <p className="text-[15px] text-slate-500 font-semibold">Petunjuk: jumlahkan kedua nilai x, lalu bagi 2.</p>
          <div className="flex items-center gap-2.5 flex-wrap text-[17px] font-extrabold text-[#17345A]">
            <span>Tengah = (</span>
            <IsiAngka
              value={s.simetri.x1}
              onChange={v => upd(d => { d.simetri.x1 = v })}
              disabled={!setinggi}
              status={s.simetri.x1 ? (xDuoOk ? 'ok' : x1Ok ? null : 'salah') : null}
              ariaLabel="Nilai x titik pertama"
            />
            <span>+</span>
            <IsiAngka
              value={s.simetri.x2}
              onChange={v => upd(d => { d.simetri.x2 = v })}
              disabled={!setinggi}
              status={s.simetri.x2 ? (xDuoOk ? 'ok' : x2Ok ? null : 'salah') : null}
              ariaLabel="Nilai x titik kedua"
            />
            <span>) ÷ 2 =</span>
            <IsiAngka
              value={s.simetri.tengah}
              onChange={v => upd(d => { d.simetri.tengah = v })}
              disabled={!setinggi}
              status={s.simetri.tengah ? (tengahOk ? 'ok' : 'salah') : null}
              ariaLabel="Hasil pembagian dua"
            />
            <Tombol varian="navy" className="h-11 px-4 text-[16px]" disabled={!setinggi} onClick={cekTengah}>Cek</Tombol>
          </div>
          {s.simetri.coba.tengah >= 2 && !tengahOk && (
            <Petunjuk>
              Jumlahkan x kedua titik setinggi tadi, lalu bagi 2 — hasilnya tepat di tengah keduanya.
            </Petunjuk>
          )}

          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="font-extrabold text-[#17345A]">Jadi sumbu simetri adalah garis x =</span>
            <IsiAngka
              value={s.simetri.sumbu}
              onChange={v => upd(d => { d.simetri.sumbu = v })}
              disabled={!setinggi}
              status={s.simetri.sumbu ? (sumbuOk ? 'ok' : 'salah') : null}
              ariaLabel="Sumbu simetri"
            />
            <Tombol varian="navy" className="h-11 px-4 text-[16px]" disabled={!setinggi} onClick={cekSumbu}>Cek</Tombol>
            {sumbuOk && <Chip tone="hijau">✓ x = {fmt(kartu.simX)}</Chip>}
          </div>
          {s.simetri.coba.sumbu >= 2 && !sumbuOk && (
            <Petunjuk>Jumlahkan x kedua titik setinggi tadi, lalu bagi dua: x = (x₁ + x₂) : 2.</Petunjuk>
          )}
        </div>

        <div className="space-y-2">
          <p className="font-extrabold text-[#17345A]">4️⃣ Tandai titik tertinggi pada kurvamu — itulah titik puncak.</p>
          <div className="flex items-center gap-2.5 flex-wrap text-[17px] font-extrabold text-[#17345A]">
            <span>Titik puncak (p ; q) = (</span>
            <IsiAngka
              value={s.simetri.p}
              onChange={v => upd(d => { d.simetri.p = v })}
              disabled={!sumbuOk}
              status={s.simetri.p ? (pOk ? 'ok' : 'salah') : null}
              ariaLabel="Nilai p puncak"
            />
            <span>;</span>
            <IsiAngka
              value={s.simetri.q}
              onChange={v => upd(d => { d.simetri.q = v })}
              disabled={!sumbuOk}
              status={s.simetri.q ? (qOk ? 'ok' : 'salah') : null}
              ariaLabel="Nilai q puncak"
            />
            <span>)</span>
            <Tombol varian="navy" className="h-11 px-4 text-[16px]" disabled={!sumbuOk} onClick={cekPuncak}>Cek</Tombol>
          </div>
          {s.simetri.coba.p >= 2 && !puncakOk && (
            <Petunjuk>
              p = sumbu simetri (jarak mendatarnya). q = tinggi titik yang tepat berada di sumbu itu —
              titik tertinggi kurvamu.
            </Petunjuk>
          )}
        </div>

        <div className="space-y-2">
          <p className="font-extrabold text-[#17345A]">5️⃣ Pahami arti p dan q pada lemparanmu — centang jawaban yang tepat.</p>
          <p className="text-[17px] font-extrabold text-[#17345A]">p = {fmt(kartu.peak.x)} m. p menunjukkan:</p>
          <PilihKapsul
            value={s.simetri.arti.p}
            onChange={v => upd(d => { d.simetri.arti.p = v as 'x' | 'y' })}
            disabled={!puncakOk}
            opsi={opsiArti(s.simetri.arti.p)}
          />
          <p className="text-[17px] font-extrabold text-[#17345A]">q = {fmt(kartu.peak.y)} m. q menunjukkan:</p>
          <PilihKapsul
            value={s.simetri.arti.q}
            onChange={v => upd(d => { d.simetri.arti.q = v as 'x' | 'y' })}
            disabled={!puncakOk}
            opsi={opsiArti(s.simetri.arti.q)}
          />
          {artiDiisi && (
            <div className="space-y-2">
              <BarisCek
                label="p"
                teks="jarak mendatar bola dari pemain saat berada di titik tertinggi"
                benar={s.simetri.arti.p === 'x'}
              />
              <BarisCek label="q" teks="tinggi maksimum bola" benar={s.simetri.arti.q === 'y'} />
              {!artiBenar && (
                <Petunjuk>
                  Ingat: <b>p</b> mendatar (jarak mendatar pada titik tertinggi), <b>q</b> vertikal
                  (tinggi maksimum bola).
                </Petunjuk>
              )}
            </div>
          )}
        </div>
      </Panel>

      {puncakOk && artiBenar && (
        <KotakHasil status="ok" judul={`Puncak Kartu ${s.kartu}: (${fmt(kartu.peak.x)} ; ${fmt(kartu.peak.y)})`}>
          Sumbu simetri x = {fmt(kartu.simX)}, puncak (p ; q) = ({fmt(kartu.peak.x)} ; {fmt(kartu.peak.y)}).
          Simpan baik-baik — p dan q ini dipakai di layar berikutnya!
        </KotakHasil>
      )}
    </div>
  )
}
