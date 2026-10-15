'use client'

// Layar 7 — Kesimpulan Konsep (LKPD Bagian C): 4 rangkaian
// pertanyaan isi dengan pilihan kata (kanan, kiri, atas, bawah),
// baru kartu penguat (anatomi f(x) = a(x − p)² + q) terbuka.

import { toast } from 'sonner'
import { useMLB, KATA_GESER } from '@/lib/mlb/store'
import { JudulLayar, Panel, IsiAngka, PilihKapsul, Tombol, Chip, BarisCek, Petunjuk } from '../bits'
import { AnatomiParabola } from '../grafik'

const opsiKata = KATA_GESER.map(k => ({ v: k, label: k }))

export default function Layar7() {
  const { s, upd } = useMLB()
  const k = s.kesimpC

  const no1 = k.puncakP.trim().toLowerCase() === 'p' && k.puncakQ.trim().toLowerCase() === 'q'
  const no2 = k.aPos === 'atas' && k.aNeg === 'bawah'
  const no3 = k.geserP === 'kanan'
  const no4 = k.geserQ === 'atas'
  const semua = no1 && no2 && no3 && no4
  const diisi = k.puncakP !== '' && k.puncakQ !== '' && k.aPos !== '' && k.aNeg !== '' && k.geserP !== '' && k.geserQ !== ''

  const bukaPenguat = () => {
    upd(d => { d.penguat = true })
    toast.success('Kartu penguat terbuka! 🎉')
  }

  const coba1 = k.coba[0], coba2 = k.coba[1], coba3 = k.coba[2], coba4 = k.coba[3]

  return (
    <div className="space-y-4">
      <JudulLayar fase={4} judul="Kesimpulan Konsep" sub="Rangkai 4 kesimpulan dari ketiga grafik tadi dengan pilihan kata yang tepat." />

      <Panel tone="navy" ikon="🧠" title="Rangkai Kesimpulanmu — 4 Pertanyaan">
        <p className="text-[17px]">
          Perhatikan ketiga grafik tadi: <b>(x − 3)²</b>, <b>(x − 3)² + 4</b>, <b>−(x − 3)² + 4</b>.
          Lalu lengkapi pernyataan berikut.
        </p>
        <p className="flex flex-wrap items-center gap-2 text-[15px] font-extrabold text-[#17345A]">
          Pilihan kata:
          {KATA_GESER.map(w => <Chip key={w} tone="oranye">{w}</Chip>)}
        </p>

        <div className="space-y-4">
          {/* 1 */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-3.5 space-y-2">
            <div className="font-extrabold text-[#17345A] text-[17px]">
              1️⃣ Grafik f(x) = a(x − p)² + q mempunyai titik puncak di (
              <span className="inline-flex items-center gap-1">
                <IsiAngka
                  value={k.puncakP}
                  onChange={v => upd(d => { d.kesimpC.puncakP = v })}
                  className="w-14 text-lg"
                  status={k.puncakP ? (no1 ? 'ok' : 'salah') : null}
                  ariaLabel="Koordinat p pertama"
                />
                ;
                <IsiAngka
                  value={k.puncakQ}
                  onChange={v => upd(d => { d.kesimpC.puncakQ = v })}
                  className="w-14 text-lg"
                  status={k.puncakQ ? (no1 ? 'ok' : 'salah') : null}
                  ariaLabel="Koordinat p kedua"
                />
              </span>
              ).
            </div>

            {coba1 >= 2 && !no1 && (
              <Petunjuk>Isi dengan huruf <b>p</b> dan <b>q</b> — sesuai bentuk a(x − p)² + q tadi.</Petunjuk>
            )}
          </div>

          {/* 2 */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-3.5 space-y-2.5">
            <div className="font-extrabold text-[#17345A] text-[17px]">
              2️⃣ Tanda a menentukan arah buka. Jika a positif, grafik terbuka ke
              <PilihKapsul
                value={k.aPos}
                onChange={v => { const ok = v === 'atas'; upd(d => { d.kesimpC.aPos = v as typeof k.aPos }); if (!ok) upd(d => { d.kesimpC.coba[1] += 1 }) }}
                opsi={opsiKata}
              />
              <span className="mt-1 block">Jika a negatif, grafik terbuka ke</span>
              <PilihKapsul
                value={k.aNeg}
                onChange={v => { const ok = v === 'bawah'; upd(d => { d.kesimpC.aNeg = v as typeof k.aNeg }); if (!ok) upd(d => { d.kesimpC.coba[1] += 1 }) }}
                opsi={opsiKata}
              />
            </div>
            {coba2 >= 2 && !no2 && (
              <Petunjuk>
                Ingat contoh tadi: <b>y = x²</b> (a positif) seperti senyum → buka ke <b>atas</b>;
                <b> −(x − 3)² + 4</b> seperti gunung → buka ke <b>bawah</b>.
              </Petunjuk>
            )}
          </div>

          {/* 3 */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-3.5 space-y-2.5">
            <div className="font-extrabold text-[#17345A] text-[17px]">
              3️⃣ Bentuk (x − p) menggeser grafik ke
              <PilihKapsul
                value={k.geserP}
                onChange={v => { const ok = v === 'kanan'; upd(d => { d.kesimpC.geserP = v as typeof k.geserP }); if (!ok) upd(d => { d.kesimpC.coba[2] += 1 }) }}
                opsi={opsiKata}
              />
              <span className="mt-1 block font-normal text-[16px] text-slate-500">sejauh p satuan.</span>
            </div>
            {coba3 >= 2 && !no3 && (
              <Petunjuk>
                Lihat Fungsi 1: (x − <b>3</b>) menggeser puncak dari (0 ; 0) ke (<b>3</b> ; 0) — ke arah mana?
              </Petunjuk>
            )}
          </div>

          {/* 4 */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-3.5 space-y-2.5">
            <div className="font-extrabold text-[#17345A] text-[17px]">
              4️⃣ Menambah q menggeser grafik ke
              <PilihKapsul
                value={k.geserQ}
                onChange={v => { const ok = v === 'atas'; upd(d => { d.kesimpC.geserQ = v as typeof k.geserQ }); if (!ok) upd(d => { d.kesimpC.coba[3] += 1 }) }}
                opsi={opsiKata}
              />
              <span className="mt-1 block font-normal text-[16px] text-slate-500">sejauh q satuan.</span>
            </div>
            {coba4 >= 2 && !no4 && (
              <Petunjuk>
                Bandingkan Fungsi 1 dan 2: (x − 3)² lalu (x − 3)² <b>+ 4</b> — puncaknya naik 4 satuan.
              </Petunjuk>
            )}
          </div>
        </div>

        {diisi && (
          <div className="space-y-2">
            <BarisCek label="1. Puncak" teks="titik puncak (p ; q)" benar={no1} />
            <BarisCek label="2. Arah buka" teks="a positif → atas · a negatif → bawah" benar={no2} />
            <BarisCek label="3. (x − p)" teks="menggeser ke kanan sejauh p satuan" benar={no3} />
            <BarisCek label="4. + q" teks="menggeser ke atas sejauh q satuan" benar={no4} />
          </div>
        )}

        <div className="flex items-center gap-3 flex-wrap">
          <Tombol
            disabled={!semua || s.penguat}
            onClick={bukaPenguat}
          >
            {s.penguat ? '✓ Kartu terbuka' : '🔓 Buka Kartu Penguat'}
          </Tombol>
          {!semua && !s.penguat && (
            <span className="text-[13.5px] font-bold text-slate-400">
              lengkapi keempat kesimpulan dengan tepat dulu
            </span>
          )}
        </div>
      </Panel>

      {s.penguat ? (
        <Panel tone="hijau" ikon="📌" title="Kartu Penguat: Anatomi Parabola">
          <div className="rounded-2xl bg-white ring-1 ring-[#BCE3CC] p-2">
            <AnatomiParabola className="w-full h-auto" />
          </div>
          <ul className="space-y-2 text-[17px]">
            <li>🎯 Puncak grafik: <b>(p ; q)</b> — langsung terlihat dari bentuk a(x − p)² + q.</li>
            <li>➡️ Dari y = ax²: <b>p menggeser mendatar</b> (ke kanan bila p &gt; 0), <b>q menggeser vertikal</b> (ke atas bila q &gt; 0).</li>
            <li>↕️ <b>a &gt; 0</b> terbuka ke atas (bentuk senyum); <b>a &lt; 0</b> terbuka ke bawah — seperti lintasan bola!</li>
            <li>📏 Sumbu simetri: garis <b>x = p</b>.</li>
            <li>🏀 Contoh kartu misi: −0,2(x − 3)² + 3,8 → puncak (3 ; 3,8), terbuka ke bawah.</li>
          </ul>
        </Panel>
      ) : (
        <p className="text-center text-white/50 text-[16px] font-bold">🔒 Kartu penguat menunggu 4 kesimpulanmu…</p>
      )}
    </div>
  )
}
