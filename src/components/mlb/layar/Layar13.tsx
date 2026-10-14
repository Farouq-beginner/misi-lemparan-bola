'use client'

// Layar 13 — Formalisasi: rangkuman konsep, miskonsepsi tanda p,
// dan cek dugaan awal dari layar 4.

import { useMLB } from '@/lib/mlb/store'
import { CARDS } from '@/lib/mlb/data'
import { JudulLayar, Panel, Chip, KotakHasil, IsiTeks } from '../bits'

export default function Layar13() {
  const { s, upd } = useMLB()
  const d = s.dugaan

  return (
    <div className="space-y-4">
      <JudulLayar fase={7} judul="Formalisasi" sub="Saatnya merapikan semua temuan menjadi pengetahuan utuh." />

      <Panel tone="navy" ikon="📌" title="Rangkuman Konsep">
        <ul className="space-y-2 text-[14.5px]">
          <li>🎯 <b>f(x) = a(x − p)² + q</b> → puncak <b>(p ; q)</b>, sumbu simetri <b>x = p</b>.</li>
          <li>↔️ <b>p</b> menggeser mendatar — tanda di dalam kurung <b>dibalik</b>: (x − 3) → kanan 3, (x + 3) → kiri 3.</li>
          <li>↕️ <b>q</b> menggeser vertikal: + 4 → naik 4 satuan.</li>
          <li>🥎 <b>a &gt; 0</b> terbuka ke atas (senyum); <b>a &lt; 0</b> terbuka ke bawah (lintasan bola).</li>
          <li>🧪 Uji fungsi lintasan: selalu <b>f(0) = 2</b>, karena bola lepas dari (0 ; 2).</li>
        </ul>
        {s.kesimpulan.trim() && (
          <div className="rounded-2xl bg-white/10 ring-1 ring-white/20 p-3.5">
            <p className="text-[11.5px] font-black uppercase tracking-wide text-[#FDBA74]">Kesimpulanmu di Layar 7</p>
            <p className="mt-1 text-[14px] italic leading-relaxed">“{s.kesimpulan}”</p>
          </div>
        )}
      </Panel>

      <Panel tone="kuning" ikon="⚠️" title="Miskonsepsi Tanda p — Hati-hati!">
        <div className="grid grid-cols-2 gap-2.5">
          <div className="rounded-2xl bg-white ring-2 ring-[#B4E0C6] p-3.5 text-center">
            <p className="font-black text-[#17345A]">y = (x − 3)²</p>
            <p className="text-[13.5px] font-bold text-[#1F7A4D] mt-1.5">puncak di x = 3 ✓</p>
          </div>
          <div className="rounded-2xl bg-white ring-2 ring-[#F3C2CB] p-3.5 text-center">
            <p className="font-black text-[#17345A]">y = (x + 3)²</p>
            <p className="text-[13.5px] font-bold text-[#B03044] mt-1.5">puncak di x = −3 (bukan 3!)</p>
          </div>
        </div>
        <p className="text-[14.5px]">
          Tanda p <b>dibalik</b> dari tanda di dalam kurung. Ini jebakan paling sering di ulangan!
        </p>
      </Panel>

      <Panel tone="biru" ikon="🔎" title="Cek Dugaan Awalmu (Layar 4)">
        {d.lemparan ? (
          <>
            <p className="text-[15px] italic leading-relaxed text-[#17345A]">
              “Aku menduga lemparan <b>{d.lemparan}</b> masuk ring, karena {d.alasan || '…'}.”
            </p>
            <div className="flex flex-wrap gap-2">
              <Chip tone="abu">dugaanmu: {d.lemparan}</Chip>
              <Chip tone="hijau">fakta: lemparan A masuk (f(5) = 3)</Chip>
            </div>
            {d.lemparan === 'A' ? (
              <KotakHasil status="ok" judul="Dugaanmu TERBUKTI! 🎉">
                Analis teliti — dugaanmu sejalan dengan hitungan f(5) = 3, tepat di ring.
              </KotakHasil>
            ) : (
              <KotakHasil status="info" judul="Dugaan perlu dikoreksi">
                Ternyata lemparan {d.lemparan} tidak masuk ({CARDS[d.lemparan].selisih}).
                Dugaan meleset itu wajar — analis data mengoreksinya dengan hitungan, bukan perasaan. 💪
              </KotakHasil>
            )}
          </>
        ) : (
          <p className="italic text-[14.5px]">
            Kamu belum mengisi dugaan di Layar 4. Tidak apa — yang penting sekarang kamu tahu:
            <b> lemparan A masuk</b> karena f(5) = 3 (pas di ring).
          </p>
        )}
        <IsiTeks
          value={s.formalCatatan}
          onChange={v => upd(d => { d.formalCatatan = v })}
          rows={2}
          placeholder="Catatanmu sekarang (opsional): setelah belajar ini, dugaanku berubah menjadi…"
          ariaLabel="Catatan formalisasi"
        />
      </Panel>
    </div>
  )
}
