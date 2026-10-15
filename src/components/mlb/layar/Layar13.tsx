'use client'

// Layar 13 — Formalisasi: rangkuman konsep, kesimpulan akhir
// (LKPD Bagian G, 3 isian pilihan kata), miskonsepsi tanda p,
// dan catatan akhir milik murid.

import { useMLB, KATA_G } from '@/lib/mlb/store'
import { JudulLayar, Panel, PilihKapsul, Chip, IsiTeks, BarisCek, KotakHasil } from '../bits'

const opsiKataG = KATA_G.map(k => ({ v: k, label: k }))
const KUNCI_G = ['tanda a', 'tinggi maksimum', 'tengah-tengah', 'a'] as const

export default function Layar13() {
  const { s, upd } = useMLB()
  const g = s.kesimpG

  const gOk = (i: number) => g[i] === KUNCI_G[i]
  const gDiisi = g.every(v => v !== '')
  const gSemua = g.every((_, i) => gOk(i))

  const kc = s.kesimpC
  const adaKesimpC =
    kc.puncakP !== '' || kc.puncakQ !== '' || kc.aPos !== '' || kc.aNeg !== '' || kc.geserP !== '' || kc.geserQ !== ''

  return (
    <div className="space-y-4">
      <JudulLayar fase={7} judul="Formalisasi" sub="Saatnya merapikan semua temuan menjadi pengetahuan utuh." />

      <Panel tone="navy" ikon="📌" title="Rangkuman Konsep">
        <ul className="space-y-2 text-[17px]">
          <li>🎯 <b>f(x) = a(x − p)² + q</b> → puncak <b>(p ; q)</b>, sumbu simetri <b>x = p</b>.</li>
          <li>↔️ <b>p</b> menggeser mendatar — tanda di dalam kurung <b>dibalik</b>: (x − 3) → kanan 3, (x + 3) → kiri 3.</li>
          <li>↕️ <b>q</b> menggeser vertikal: + 4 → naik 4 satuan.</li>
          <li>🥎 <b>a &gt; 0</b> terbuka ke atas (senyum); <b>a &lt; 0</b> terbuka ke bawah (lintasan bola).</li>
          <li>🧪 Uji fungsi lintasan: selalu <b>f(0) = 2</b>, karena bola lepas dari (0 ; 2).</li>
        </ul>
        {adaKesimpC && (
          <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 p-3.5">
            <p className="text-[13px] font-black uppercase tracking-wide text-[#FDBA74]">4 Kesimpulanmu di Layar 7</p>
            <ul className="mt-1 space-y-1 text-[16px] italic leading-relaxed">
              <li>1. Puncak di ( {kc.puncakP || '…'} ; {kc.puncakQ || '…'} )</li>
              <li>2. a positif → {kc.aPos || '…'} · a negatif → {kc.aNeg || '…'}</li>
              <li>3. (x − p) menggeser ke {kc.geserP || '…'} sejauh p satuan</li>
              <li>4. + q menggeser ke {kc.geserQ || '…'} sejauh q satuan</li>
            </ul>
          </div>
        )}
      </Panel>

      <Panel tone="hijau" ikon="📝" title="Kesimpulan Akhir (LKPD Bagian G)">
        <p className="flex flex-wrap items-center gap-2 text-[15px] font-extrabold text-[#17345A]">
          Pilihan kata:
          {KATA_G.map(w => <Chip key={w} tone="oranye">{w}</Chip>)}
        </p>

        <div className="space-y-4">
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-3.5 space-y-2.5">
            <div className="font-extrabold text-[#17345A] text-[17px]">
              1️⃣ Arah buka parabola ditentukan oleh
              <PilihKapsul value={g[0]} onChange={v => upd(d => { d.kesimpG[0] = v })} opsi={opsiKataG} />
              <span className="mt-1 block">
                Pada titik puncak (p ; q), p adalah jarak mendatar dan q adalah
              </span>
              <PilihKapsul value={g[1]} onChange={v => upd(d => { d.kesimpG[1] = v })} opsi={opsiKataG} />
              <span className="mt-1 block font-normal text-[16px] text-slate-500">bola.</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-3.5 space-y-2.5">
            <div className="font-extrabold text-[#17345A] text-[17px]">
              2️⃣ Sumbu simetri berada di
              <PilihKapsul value={g[2]} onChange={v => upd(d => { d.kesimpG[2] = v })} opsi={opsiKataG} />
              <span className="mt-1 block font-normal text-[16px] text-slate-500">antara dua titik yang tingginya sama.</span>
            </div>
          </div>

          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-3.5 space-y-2.5">
            <div className="font-extrabold text-[#17345A] text-[17px]">
              3️⃣ Fungsi kuadrat bisa dicari dari titik puncak dan satu titik lain karena hanya ada satu bilangan yang belum diketahui, yaitu
              <PilihKapsul value={g[3]} onChange={v => upd(d => { d.kesimpG[3] = v })} opsi={opsiKataG} />
            </div>
          </div>
        </div>

        {gDiisi && (
          <div className="space-y-2">
            <BarisCek label="1a" teks="arah buka ← tanda a" benar={gOk(0)} />
            <BarisCek label="1b" teks="q = tinggi maksimum bola" benar={gOk(1)} />
            <BarisCek label="2" teks="sumbu simetri ← tengah-tengah" benar={gOk(2)} />
            <BarisCek label="3" teks="satu-satunya bilangan belum diketahui ← a" benar={gOk(3)} />
          </div>
        )}

        {gSemua && (
          <KotakHasil status="ok" judul="Semua kesimpulan akhir tepat! 🏆">
            Arah buka ← tanda a · q = tinggi maksimum · sumbu simetri = tengah-tengah dua titik setinggi ·
            yang dicari dari puncak + satu titik hanyalah a. Hebat — misi analis selesai!
          </KotakHasil>
        )}
      </Panel>

      <Panel tone="kuning" ikon="⚠️" title="Miskonsepsi Tanda p — Hati-hati!">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-white ring-2 ring-[#B4E0C6] p-3.5 text-center">
            <p className="font-black text-[#17345A]">y = (x − 3)²</p>
            <p className="text-[15px] font-bold text-[#1F7A4D] mt-1.5">puncak di x = 3 ✓</p>
          </div>
          <div className="rounded-2xl bg-white ring-2 ring-[#F3C2CB] p-3.5 text-center">
            <p className="font-black text-[#17345A]">y = (x + 3)²</p>
            <p className="text-[15px] font-bold text-[#B03044] mt-1.5">puncak di x = −3 (bukan 3!)</p>
          </div>
        </div>
        <p className="text-[17px]">
          Tanda p <b>dibalik</b> dari tanda di dalam kurung. Ini jebakan paling sering di ulangan!
        </p>
      </Panel>

      <Panel tone="biru" ikon="✍️" title="Catatan Formalisasi">
        <p className="text-[17px]">
          Rapikan pengetahuanmu dengan bahasa sendiri — hal paling penting yang kamu bawa
          dari misi ini.
        </p>
        <IsiTeks
          value={s.formalCatatan}
          onChange={v => upd(d => { d.formalCatatan = v })}
          rows={2}
          placeholder="Catatanmu (opsional): puncak (p ; q), sumbu simetri x = p, dan f(5) menentukan masuk atau tidak…"
          ariaLabel="Catatan formalisasi"
        />
      </Panel>
    </div>
  )
}
