'use client'

// Layar 14 — Refleksi: skala 1–4 untuk TP-1 & TP-2, isian bebas,
// pilihan tindak lanjut, dan kuis 3 soal (boleh diulang).

import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { KUIS } from '@/lib/mlb/data'
import { JudulLayar, Panel, Chip, IsiTeks, Skala4, PilihKapsul, Petunjuk, KotakHasil } from '../bits'
import { cn } from '@/lib/utils'

export default function Layar14() {
  const { s, upd } = useMLB()

  const pilihOpsi = (qi: number, oi: number) => {
    const soal = KUIS[qi]
    if (s.kuis.pilih[qi] === soal.benar) return
    upd(d => {
      d.kuis.pilih[qi] = oi
      if (oi !== soal.benar) d.kuis.coba[qi] += 1
    })
    if (oi === soal.benar) toast.success(`Soal ${qi + 1}: benar! 🎉`)
    else toast.error(s.kuis.coba[qi] + 1 >= 2 ? `Soal ${qi + 1}: baca pembahasannya di bawah.` : `Soal ${qi + 1}: belum tepat — baca penuntun, coba lagi!`)
  }

  return (
    <div className="space-y-4">
      <JudulLayar fase={7} judul="Refleksi & Kuis" sub="Nilai dirimu dengan jujur — ini peta untuk belajarmu selanjutnya." />

      <Panel tone="biru" ikon="🪞" title="Kartu Refleksi">
        <div className="space-y-3">
          <div>
            <p className="font-extrabold text-[#17345A] text-[17px]">🎯 TP-1 — Aku bisa menentukan puncak dan arah buka dari f(x) = a(x − p)² + q</p>
            <Skala4 value={s.refleksi.tp1} onChange={v => upd(d => { d.refleksi.tp1 = v })} ariaLabel="Skala TP-1" />
            <p className="text-[13px] font-bold text-slate-400">1 = belum bisa · 2 = dengan bantuan · 3 = bisa sendiri · 4 = bisa + bisa menjelaskan</p>
          </div>
          <div>
            <p className="font-extrabold text-[#17345A] text-[17px]">🏀 TP-2 — Aku bisa menghitung f(5) lalu memutuskan lemparan masuk/tidak</p>
            <Skala4 value={s.refleksi.tp2} onChange={v => upd(d => { d.refleksi.tp2 = v })} ariaLabel="Skala TP-2" />
          </div>
          <div>
            <p className="font-extrabold text-[#17345A] text-[17px]">✍️ Hal paling berharga / yang masih membingungkan:</p>
            <IsiTeks
              value={s.refleksi.tulis}
              onChange={v => upd(d => { d.refleksi.tulis = v })}
              rows={3}
              placeholder="Contoh: aku akhirnya paham tanda p dibalik… / aku masih bingung saat mencari a…"
              ariaLabel="Catatan refleksi"
            />
          </div>
          <div>
            <p className="font-extrabold text-[#17345A] text-[17px]">🚀 Tindak lanjutku:</p>
            <PilihKapsul
              value={s.refleksi.lanjut}
              onChange={v => upd(d => { d.refleksi.lanjut = v })}
              opsi={[
                { v: 'siap', label: '💪 Siap topik berikutnya' },
                { v: 'latihan', label: '🏀 Latihan soal serupa' },
                { v: 'guru', label: '🙋 Perlu bantuan guru' },
              ]}
            />
          </div>
        </div>
      </Panel>

      <Panel ikon="🧠" title="Kuis 3 Soal — boleh diulang, tak ada nilai merah!">
        <div className="space-y-4">
          {KUIS.map((soal, qi) => {
            const pilih = s.kuis.pilih[qi]
            const coba = s.kuis.coba[qi]
            const benar = pilih === soal.benar
            return (
              <div key={qi} className={cn('rounded-2xl p-4 ring-2 space-y-3', benar ? 'ring-[#B4E0C6] bg-[#EAF7F0]' : 'ring-slate-200 bg-white')}>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="size-8 rounded-xl bg-[#17345A] text-white font-black grid place-items-center text-[16px]">{qi + 1}</span>
                  <Chip tone={soal.tp === 1 ? 'biru' : 'oranye'}>TP-{soal.tp}</Chip>
                  {benar && <Chip tone="hijau">✓ tepat</Chip>}
                  {!benar && coba >= 2 && <Chip tone="kuning">pembahasan terbuka</Chip>}
                </div>
                <p className="font-extrabold text-[#17345A] text-[17px] leading-snug">{soal.tanya}</p>
                <div className="grid sm:grid-cols-2 gap-2" role="group" aria-label={`Opsi soal ${qi + 1}`}>
                  {soal.opsi.map((o, oi) => {
                    const dipilih = pilih === oi
                    const tampilBenar = (benar && dipilih) || (!benar && coba >= 2 && oi === soal.benar)
                    return (
                      <button
                        key={oi}
                        type="button"
                        disabled={benar}
                        aria-pressed={dipilih}
                        onClick={() => pilihOpsi(qi, oi)}
                        className={cn(
                          'h-12 rounded-2xl font-extrabold text-[16px] border-2 transition-all active:scale-95 px-3 disabled:opacity-70',
                          tampilBenar
                            ? 'bg-[#2E9E6B] border-[#248A5C] text-white shadow-md'
                            : dipilih
                              ? 'bg-[#FDECEF] border-[#F0AEBB] text-[#A32B3E]'
                              : 'bg-white border-slate-200 text-[#17345A] hover:border-orange-300',
                        )}
                      >
                        {o}
                      </button>
                    )
                  })}
                </div>
                {!benar && coba >= 1 && <Petunjuk>{soal.penuntun}</Petunjuk>}
                {(benar || coba >= 2) && (
                  <KotakHasil status={benar ? 'ok' : 'info'} judul={benar ? 'Pembahasan' : 'Pembahasan (karena sudah 2× mencoba)'}>
                    {soal.jelas}
                  </KotakHasil>
                )}
              </div>
            )
          })}
        </div>
      </Panel>
    </div>
  )
}
