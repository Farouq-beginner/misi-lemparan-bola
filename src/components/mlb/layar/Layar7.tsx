'use client'

// Layar 7 — Kesimpulan Konsep: murid menulis kesimpulan dulu,
// baru kartu penguat (anatomi f(x) = a(x − p)² + q) terbuka.

import { toast } from 'sonner'
import { useMLB } from '@/lib/mlb/store'
import { JudulLayar, Panel, IsiTeks, Tombol } from '../bits'
import { AnatomiParabola } from '../grafik'

export default function Layar7() {
  const { s, upd } = useMLB()
  const cukup = s.kesimpulan.trim().length >= 10

  return (
    <div className="space-y-4">
      <JudulLayar fase={4} judul="Kesimpulan Konsep" sub="Dari tiga grafik tadi, kamu pasti sudah menangkap polanya. Tulis dulu dengan bahasamu sendiri!" />

      <Panel tone="navy" ikon="🧠" title="Rangkai Kesimpulanmu">
        <p className="text-[17px]">
          Perhatikan ketiga grafik tadi: <b>(x − 3)²</b>, <b>(x − 3)² + 4</b>, <b>−(x − 3)² + 4</b>.
          Apa efek angka di dalam kurung? Angka di luar? Tanda di depan?
        </p>
        <IsiTeks
          value={s.kesimpulan}
          onChange={v => upd(d => { d.kesimpulan = v })}
          rows={4}
          placeholder="Grafik f(x) = a(x − p)² + q memiliki puncak di …, bergeser …, dan tanda a menentukan …"
          ariaLabel="Kesimpulan konsep"
        />
        <div className="flex items-center gap-3 flex-wrap">
          <Tombol
            disabled={!cukup || s.penguat}
            onClick={() => {
              upd(d => { d.penguat = true })
              toast.success('Kartu penguat terbuka! 🎉')
            }}
          >
            {s.penguat ? '✓ Kartu terbuka' : '🔓 Buka Kartu Penguat'}
          </Tombol>
          {!cukup && !s.penguat && <span className="text-[13.5px] font-bold text-slate-400">tulis minimal 10 huruf dulu</span>}
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
        <p className="text-center text-white/50 text-[16px] font-bold">🔒 Kartu penguat menunggu kesimpulanmu…</p>
      )}
    </div>
  )
}
