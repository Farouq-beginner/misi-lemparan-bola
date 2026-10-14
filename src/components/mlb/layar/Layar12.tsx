'use client'

// Layar 12 — Rekap: tabel a, p, q, f(5), keputusan untuk A, B, C
// terisi dari data murid (panel cek jawaban layar 11) + pertanyaan
// pembanding.

import { useMLB } from '@/lib/mlb/store'
import { CARDS } from '@/lib/mlb/data'
import { parseNum, fmt } from '@/lib/mlb/util'
import { JudulLayar, Panel, Chip, KotakHasil, IsiTeks, Petunjuk } from '../bits'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { cn } from '@/lib/utils'

export default function Layar12() {
  const { s, upd } = useMLB()

  const baris = (['A', 'B', 'C'] as const).map(k => {
    const c = CARDS[k]
    const r = s.cek3[k]
    const f5 = parseNum(r.f5)
    const ada = f5 !== null && r.keputusan !== '' && r.dicek
    const f5Benar = f5 !== null && Math.abs(f5 - c.f5) <= 0.01
    const kepBenar = r.keputusan !== '' && ((r.keputusan === 'masuk') === c.masuk)
    return { k, c, r, f5, ada, f5Benar, kepBenar }
  })
  const adaBaris = baris.filter(b => b.ada).length

  return (
    <div className="space-y-4">
      <JudulLayar fase={6} judul="Rekap Misi" sub="Gabungkan seluruh temuan tim analis dalam satu tabel." />

      <Panel ikon="📊" title="Tabel Rekap Ketiga Lemparan">
        <div className="overflow-x-auto rounded-2xl ring-1 ring-slate-200">
          <Table>
            <TableHeader>
              <TableRow className="bg-[#17345A] hover:bg-[#17345A]">
                <TableHead className="text-white font-black">Kartu</TableHead>
                <TableHead className="text-white font-black text-center">a</TableHead>
                <TableHead className="text-white font-black text-center">p</TableHead>
                <TableHead className="text-white font-black text-center">q</TableHead>
                <TableHead className="text-white font-black text-center">f(5)</TableHead>
                <TableHead className="text-white font-black">Keputusan</TableHead>
                <TableHead className="text-white font-black text-center">Cek</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {baris.map(({ k, c, r, f5, ada, f5Benar, kepBenar }) => (
                <TableRow key={k}>
                  <TableCell className="font-black text-[#17345A]">{k}</TableCell>
                  <TableCell className="text-center font-bold text-[#2A4166]">{fmt(c.a)}</TableCell>
                  <TableCell className="text-center font-bold text-[#2A4166]">{fmt(c.peak.x)}</TableCell>
                  <TableCell className="text-center font-bold text-[#2A4166]">{fmt(c.peak.y)}</TableCell>
                  <TableCell className="text-center font-bold text-[#2A4166]">{f5 !== null ? fmt(f5) : '—'}</TableCell>
                  <TableCell className="font-bold text-[#2A4166]">
                    {r.keputusan === 'masuk' ? 'Masuk' : r.keputusan === 'tidak' ? 'Tidak masuk' : '—'}
                  </TableCell>
                  <TableCell className="text-center">
                    {ada ? (
                      f5Benar && kepBenar ? (
                        <Chip tone="hijau">✓</Chip>
                      ) : (
                        <Chip tone="merah">✗</Chip>
                      )
                    ) : (
                      <span className="text-slate-300 font-bold">—</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <p className="text-[12px] text-slate-400 font-bold">
          a, p, q dari data tim analis · f(5) dan keputusan dari hitunganmu di Layar 11.
        </p>
        {adaBaris < 3 && (
          <Petunjuk>
            Ada {3 - adaBaris} kartu yang belum dicek. Buka kembali <b>panel Cek Jawaban</b> di layar
            sebelumnya agar tabel ini terisi lengkap.
          </Petunjuk>
        )}
      </Panel>

      {adaBaris >= 3 && (
        <KotakHasil status="info" judul="Pola yang terlihat">
          Hanya <b>A</b> yang f(5)-nya berada di zona 2,9 – 3,1 m. <b>B</b> kalah tinggi
          (0,5 m — 2,5 m di bawah ring), <b>C</b> justru kelewatan (3,5 m — 0,5 m di atas ring).
        </KotakHasil>
      )}

      <Panel tone="oranye" ikon="🤝" title="Pertanyaan Pembanding">
        <p className="text-[14.5px]">
          Semua bola lepas dari titik yang sama <b>(0 ; 2)</b>. Mengapa hanya lemparan <b>A</b> yang masuk?
          Bandingkan <b>f(5)</b> tiap kartu dengan tinggi ring 3 m dan tulis kesimpulanmu.
        </p>
        <IsiTeks
          value={s.rekapTulis}
          onChange={v => upd(d => { d.rekapTulis = v })}
          rows={3}
          placeholder="Contoh: f(5) A = 3 pas dengan ring, B hanya 0,5 m karena puncaknya rendah, C 3,5 m karena puncaknya terlalu maju/tinggi…"
          ariaLabel="Jawaban pertanyaan pembanding"
        />
        <p className={cn('text-[11.5px] font-bold', s.rekapTulis.trim() ? 'text-[#1F7A4D]' : 'text-slate-400')}>
          {s.rekapTulis.trim() ? '✓ tersimpan' : 'jawaban terbuka — tidak dinilai'}
        </p>
      </Panel>
    </div>
  )
}
