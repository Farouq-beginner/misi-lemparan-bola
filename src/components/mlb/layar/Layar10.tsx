'use client'

// Layar 10 — Menemukan Fungsi (LKPD Bagian E, 5 langkah):
// 1) isi p dan q ke bentuk puncak → 2) substitusi titik lepas (0 ; 2)
// → 3) kerjakan (0 − p)² lalu hitung a → 4) tulis fungsi lengkap
// → 5) uji dengan satu titik lain pada Kartu Data.

import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { CARDS, CONTOH, fxCard } from '@/lib/mlb/data'
import { eqTol, parseNum, fmt } from '@/lib/mlb/util'
import { JudulLayar, Panel, Chip, IsiAngka, IsiTeks, PilihKapsul, Tombol, KotakHasil, Petunjuk, PilihanKartu, BarisCek } from '../bits'
import { cn } from '@/lib/utils'

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
  const ac = s.aCari
  const pOk = eqTol(ac.p, p, 0.01)
  const qOk = eqTol(ac.q, q, 0.01)
  const l1 = pOk && qOk
  const l2 = eqTol(ac.kuadrat, p * p, 0.01)
  const aVal = parseNum(ac.a)
  const l3 = aVal !== null && Math.abs(aVal - kartu.a) <= 0.005
  // Langkah 4: fungsi dinilai dari keberadaan angka a, p, q di dalamnya.
  const fnAngka = (() => {
    const norm = ac.fungsi.replace(/−/g, '-').replace(/,/g, '.').replace(/\^2/g, '').replace(/\s/g, '')
    const m = norm.match(/-?\d+(?:\.\d+)?/g)
    return m ? m.map(Number) : []
  })()
  const fnAdaA = fnAngka.some(n => Math.abs(n - kartu.a) <= 0.01)
  const fnAdaP = fnAngka.some(n => Math.abs(Math.abs(n) - p) <= 0.01)
  const fnAdaQ = fnAngka.some(n => Math.abs(n - q) <= 0.01)
  const l4 = ac.fungsi.trim().length > 0 && /x/i.test(ac.fungsi) && fnAdaA && fnAdaP && fnAdaQ
  const ujiX = parseNum(ac.uji.x)
  // titik uji: salah satu titik kartu, kecuali titik lepas (x = 0)
  const ujiXOk =
    ujiX !== null &&
    kartu.points.some(pt => Math.abs(pt.x - ujiX) <= 0.01 && Math.abs(pt.x) > 0.01)
  const ujiFxOk = ujiX !== null && eqTol(ac.uji.fx, fxCard(kartu, ujiX), 0.01)
  const ujiYOk =
    ujiX !== null && kartu.points.some(pt => Math.abs(pt.x - ujiX) <= 0.01 && eqTol(ac.uji.y, pt.y, 0.01))
  const l5 = l3 && l4 && ujiXOk && ujiFxOk && ujiYOk && ac.uji.cocok === 'ya'
  const selesai = l1 && l2 && l3 && l4 && l5

  const coba = (k: 'p' | 'kuadrat' | 'a' | 'fungsi' | 'uji') => {
    upd(d => { d.aCari.coba[k] += 1 })
  }

  const cekL1 = () => {
    if (!pOk) { coba('p'); toast.error('p belum tepat — lihat kembali hasil Langkah 4 di layar sebelumnya.') ; return }
    if (!qOk) { coba('p'); toast.error('q belum tepat — lihat kembali hasil Langkah 4 di layar sebelumnya.'); return }
    toast.success('Bentuk puncakmu benar! Lanjut substitusi titik lepas. ✍️')
  }
  const cekL2 = () => {
    if (l2) { toast.success(`Tepat! (0 − ${fmt(p)})² = ${fmt(p * p)}. Sekarang cari a.`); return }
    coba('kuadrat')
    toast.error('Belum tepat — kerjakan dulu (0 − p)² sebelum mencari a.')
  }
  const cekL3 = () => {
    if (aVal === null) { toast.error('Isi dulu nilai a-nya ya.'); return }
    if (l3) { toast.success(`a ditemukan: ${fmt(kartu.a)}! 🎯`); return }
    coba('a')
    toast.error('Belum tepat — periksa hitungan dan tanda p.')
  }
  const cekL4 = () => {
    if (!ac.fungsi.trim()) { toast.error('Tulis dulu fungsi lengkapnya.'); return }
    if (!l4) { coba('fungsi'); toast.error('Fungsi belum cocok — pastikan tulisanmu memuat angka a, p, dan q dari langkah sebelumnya.'); return }
    if (!l3) { toast.error('Nilai a-nya belum benar — koreksi dulu Langkah 3.'); return }
    toast.success('Fungsi lengkap tertulis! Sekarang uji dengan titik lain. ✅')
  }
  const cekL5 = () => {
    if (!ujiXOk) { coba('uji'); toast.error('Pilih x = satu titik pada Kartu Data, bukan titik lepas (0 ; 2).'); return }
    if (!ujiFxOk) { coba('uji'); toast.error('Hasil f(x) belum tepat — masukkan x ke fungsi langkah 4.'); return }
    if (!ujiYOk) { coba('uji'); toast.error('Data kartu pada x itu belum tepat — lihat kembali titik di kartumu.'); return }
    if (ac.uji.cocok !== 'ya') { coba('uji'); toast.error('Karena hasil hitunganmu = data kartu, pilih “Ya, cocok!”.'); return }
    toast.success('Fungsi teruji — lintasan Kartu ' + s.kartu + ' resmi ditemukan! 🎉')
  }

  return (
    <div className="space-y-4">
      <JudulLayar fase={5} judul="Menemukan Fungsi Lintasan" sub="Puncak sudah ketemu (p ; q). Sekarang cari a lewat titik lepas (0 ; 2) — 5 langkah LKPD." />

      <Panel tone="oranye" ikon="🎓" title="Contoh dengan Kartu Latihan">
        <p className="text-[16px]">
          Diketahui puncak <b>(2 ; 3)</b> → f(x) = a(x − 2)² + 3. Bola lepas dari <b>(0 ; 2)</b>, artinya <b>f(0) = 2</b>:
        </p>
        <p className="text-[16px] font-bold text-[#17345A]">
          2 = a(0 − 2)² + 3 → (0 − 2)² = 4 → 2 = 4a + 3 → 4a = −1 → <span className="text-[#B45309]">a = −0,25</span>
        </p>
        <p className="text-[16px]">Jadi f(x) = <b>{CONTOH.fx}</b>. Tanda a negatif — grafik terbuka ke bawah seperti lintasan bola!</p>
      </Panel>

      <Panel tone="biru" ikon="🧩" title={`Kegiatan 2: Kartu ${s.kartu}`}>
        <div className="flex flex-wrap gap-2">
          <Chip tone="biru">p = {fmt(p)} &amp; q = {fmt(q)} (dari layar 9)</Chip>
          <Chip tone="kuning">titik lepas (0 ; 2) → f(0) = 2</Chip>
        </div>

        {/* Langkah 1 */}
        <div className={cn('rounded-2xl p-3.5 ring-2 transition-all', l1 ? 'ring-[#2E9E6B] bg-[#EAF7F0]' : 'ring-slate-200 bg-white')}>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={cn('size-8 shrink-0 rounded-xl grid place-items-center font-black text-white text-[16px]', l1 ? 'bg-[#2E9E6B]' : 'bg-[#17345A]')}>{l1 ? '✓' : '1'}</span>
            <span className="font-extrabold text-[#17345A] text-[17px] flex-1 min-w-[220px]">Masukkan p dan q dari Kegiatan 1 ke bentuk puncak.</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap text-[17px] font-extrabold text-[#17345A] mt-2">
            <span>f(x) = a(x −</span>
            <IsiAngka value={ac.p} onChange={v => upd(d => { d.aCari.p = v })} disabled={l1} status={ac.p ? (pOk ? 'ok' : 'salah') : null} ariaLabel="p di bentuk puncak" />
            <span>)² +</span>
            <IsiAngka value={ac.q} onChange={v => upd(d => { d.aCari.q = v })} disabled={l1} status={ac.q ? (qOk ? 'ok' : 'salah') : null} ariaLabel="q di bentuk puncak" />
            <Tombol varian="navy" className="h-11 px-4 text-[16px]" disabled={l1} onClick={cekL1}>Cek</Tombol>
          </div>
        </div>

        {/* Langkah 2 */}
        <div className={cn('rounded-2xl p-3.5 ring-2 transition-all', l2 ? 'ring-[#2E9E6B] bg-[#EAF7F0]' : l1 ? 'ring-slate-200 bg-white' : 'ring-slate-100 bg-slate-50 opacity-60')}>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={cn('size-8 shrink-0 rounded-xl grid place-items-center font-black text-white text-[16px]', l2 ? 'bg-[#2E9E6B]' : 'bg-[#17345A]')}>{l2 ? '✓' : '2'}</span>
            <span className="font-extrabold text-[#17345A] text-[17px] flex-1 min-w-[220px]">Titik lepas (0 ; 2) artinya saat x = 0, nilai f(x) = 2. Masukkan ke fungsi tadi.</span>
          </div>
          <p className="text-[17px] font-extrabold text-[#17345A] mt-2">
            2 = a(0 − {l1 ? fmt(p) : '____'})² + {l1 ? fmt(q) : '____'}
          </p>
          <div className="flex items-center gap-2.5 flex-wrap mt-2">
            <Tombol varian="navy" className="h-11 px-4 text-[16px]" disabled={!l1 || l2} onClick={cekL2}>{l2 ? '✓ Tersubstitusi' : 'Sudah, lanjut →'}</Tombol>
          </div>
        </div>

        {/* Langkah 3 */}
        <div className={cn('rounded-2xl p-3.5 ring-2 transition-all', l3 ? 'ring-[#2E9E6B] bg-[#EAF7F0]' : l2 ? 'ring-slate-200 bg-white' : 'ring-slate-100 bg-slate-50 opacity-60')}>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={cn('size-8 shrink-0 rounded-xl grid place-items-center font-black text-white text-[16px]', l3 ? 'bg-[#2E9E6B]' : 'bg-[#17345A]')}>{l3 ? '✓' : '3'}</span>
            <span className="font-extrabold text-[#17345A] text-[17px] flex-1 min-w-[220px]">Hitung nilai a. Kerjakan dulu (0 − p)², lalu cari a.</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap text-[17px] font-extrabold text-[#17345A] mt-2">
            <span>(0 − {l1 ? fmt(p) : 'p'})² =</span>
            <IsiAngka value={ac.kuadrat} onChange={v => upd(d => { d.aCari.kuadrat = v })} disabled={!l1 || l3} status={ac.kuadrat ? (l2 ? 'ok' : 'salah') : null} ariaLabel="Hasil (0 − p) kuadrat" />
            <span>→ a =</span>
            <IsiAngka value={ac.a} onChange={v => upd(d => { d.aCari.a = v })} disabled={!l2 || l3} status={ac.a ? (l3 ? 'ok' : 'salah') : null} ariaLabel="Nilai a" />
            <Tombol varian="navy" className="h-11 px-4 text-[16px]" disabled={!l2 || l3} onClick={cekL3}>Cek a</Tombol>
          </div>
          {ac.a && !l3 && aVal !== null && (
            <KotakHasil status="salah" judul="Uji f(0) = 2 gagal">
              Dengan a-mu: f(0) = {fmt(aVal)} × {l1 ? fmt(p * p) : '?'} + {l1 ? fmt(q) : '?'} = {l1 ? fmt(aVal * p * p + q) : '?'} ≠ 2. Coba hitung ulang!
            </KotakHasil>
          )}
          {ac.coba.a >= 1 && !l3 && (
            <Petunjuk>
              Rumus cepat: <b>a = (2 − q) : (0 − p)²</b> = (2 − {l1 ? fmt(q) : '…'}) : {l1 ? fmt(p * p) : '…'}.
            </Petunjuk>
          )}
          {ac.coba.a >= 2 && !l3 && (
            <div className="rounded-2xl bg-[#FFF8E2] ring-2 ring-[#F0E0A0] p-4 text-[#6B5508] text-[16px] font-semibold animate-fadein">
              <p className="font-extrabold flex items-center gap-2">⚠️ Cek tanda p!</p>
              <p className="mt-1.5 leading-relaxed">
                Bentuk kita <b>(x − {l1 ? fmt(p) : '…'})</b> → puncak di x = <b>{l1 ? fmt(p) : '…'}</b>. Kalau tertulis
                <b> (x + {l1 ? fmt(p) : '…'})</b>, puncaknya justru x = <b>−{l1 ? fmt(p) : '…'}</b>. Tanda p selalu <b>dibalik</b> dari
                tanda di dalam kurung!
              </p>
            </div>
          )}
        </div>

        {/* Langkah 4 */}
        <div className={cn('rounded-2xl p-3.5 ring-2 transition-all', l4 && l3 ? 'ring-[#2E9E6B] bg-[#EAF7F0]' : l3 ? 'ring-slate-200 bg-white' : 'ring-slate-100 bg-slate-50 opacity-60')}>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={cn('size-8 shrink-0 rounded-xl grid place-items-center font-black text-white text-[16px]', l4 && l3 ? 'bg-[#2E9E6B]' : 'bg-[#17345A]')}>{l4 && l3 ? '✓' : '4'}</span>
            <span className="font-extrabold text-[#17345A] text-[17px] flex-1 min-w-[220px]">Tulis fungsi lengkapnya.</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap text-[17px] font-extrabold text-[#17345A] mt-2">
            <span>f(x) =</span>
            <IsiTeks
              value={ac.fungsi}
              onChange={v => upd(d => { d.aCari.fungsi = v })}
              rows={1}
              disabled={!l3}
              placeholder={l3 ? `contoh: ${fmt(kartu.a)}(x − ${fmt(p)})² + ${fmt(q)}` : 'a ditemukan dulu di langkah 3'}
              className="flex-1 min-w-[220px] min-h-[44px] resize-none text-[17px] font-extrabold"
              ariaLabel="Fungsi lengkap f(x)"
            />
            <Tombol varian="navy" className="h-11 px-4 text-[16px]" disabled={!l3} onClick={cekL4}>Cek</Tombol>
          </div>
          {ac.coba.fungsi >= 2 && !l4 && ac.fungsi.trim() !== '' && (
            <Petunjuk>
              Pola fungsimu: <b>f(x) = {fmt(kartu.a)}(x − {fmt(p)})² + {fmt(q)}</b> — pastikan ketiga angka
              a, p, q muncul di tulisanmu (koma atau titik sama saja).
            </Petunjuk>
          )}
          {l4 && !l3 && <Petunjuk>Nilai a pada langkah 3 belum benar — perbaiki dulu.</Petunjuk>}
        </div>

        {/* Langkah 5 */}
        <div className={cn('rounded-2xl p-3.5 ring-2 transition-all', l5 ? 'ring-[#2E9E6B] bg-[#EAF7F0]' : l4 && l3 ? 'ring-slate-200 bg-white' : 'ring-slate-100 bg-slate-50 opacity-60')}>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className={cn('size-8 shrink-0 rounded-xl grid place-items-center font-black text-white text-[16px]', l5 ? 'bg-[#2E9E6B]' : 'bg-[#17345A]')}>{l5 ? '✓' : '5'}</span>
            <span className="font-extrabold text-[#17345A] text-[17px] flex-1 min-w-[220px]">Ujilah fungsimu dengan satu titik lain pada Kartu Data (bukan titik lepas).</span>
          </div>
          <div className="flex items-center gap-2.5 flex-wrap text-[17px] font-extrabold text-[#17345A] mt-2">
            <span>x =</span>
            <IsiAngka value={ac.uji.x} onChange={v => upd(d => { d.aCari.uji.x = v })} disabled={l5} status={ac.uji.x ? (ujiXOk ? 'ok' : 'salah') : null} ariaLabel="Nilai x uji" />
            <span>, hasil f(x) =</span>
            <IsiAngka value={ac.uji.fx} onChange={v => upd(d => { d.aCari.uji.fx = v })} disabled={l5} status={ac.uji.fx ? (ujiFxOk ? 'ok' : 'salah') : null} ariaLabel="Hasil f(x)" />
            <span>, data pada kartu y =</span>
            <IsiAngka value={ac.uji.y} onChange={v => upd(d => { d.aCari.uji.y = v })} disabled={l5} status={ac.uji.y ? (ujiYOk ? 'ok' : 'salah') : null} ariaLabel="Data kartu y" />
          </div>
          <div className="mt-2.5 space-y-2">
            <p className="font-extrabold text-[#17345A]">Hasilnya cocok?</p>
            <PilihKapsul
              value={ac.uji.cocok}
              onChange={v => upd(d => { d.aCari.uji.cocok = v as '' | 'ya' | 'belum' })}
              disabled={l5}
              opsi={[
                { v: 'ya', label: '☑ Ya, cocok!' },
                { v: 'belum', label: '☐ Belum, aku periksa lagi' },
              ]}
            />
            <Tombol varian="navy" className="h-11 px-4 text-[16px]" disabled={l5} onClick={cekL5}>Cek uji</Tombol>
          </div>
          {ac.coba.uji >= 2 && !l5 && (
            <Petunjuk>
              Ambil satu titik kartu selain (0 ; 2) — contoh Kartu {s.kartu}: x = {fmt(kartu.points[1].x)}, lalu masukkan ke
              f(x) kamu. Bandingkan hasilnya dengan y pada kartu.
            </Petunjuk>
          )}
        </div>

        {l1 && l2 && l3 && (
          <div className="space-y-2">
            <BarisCek label="a benar" teks={`a = ${fmt(kartu.a)} — f(0) = ${fmt(kartu.a)} × ${fmt(p * p)} + ${fmt(q)} = 2 ✓`} benar={l3} />
          </div>
        )}
      </Panel>

      {selesai && (
        <KotakHasil status="ok" judul={`Fungsi Lintasan Kartu ${s.kartu} ditemukan & teruji!`}>
          <p className="text-[18px] font-black">f(x) = {ac.fungsi || `${fmt(kartu.a)}(x − ${fmt(p)})² + ${fmt(q)}`}</p>
          <p className="mt-1.5">
            Teruji pada titik ({ujiX !== null ? fmt(ujiX) : '…'} ; {ac.uji.y || '…'}): hasil hitunganmu = data kartu ✓.
            Simpan fungsi ini — dipakai di layar berikutnya untuk menghitung f(5)!
          </p>
        </KotakHasil>
      )}
    </div>
  )
}
