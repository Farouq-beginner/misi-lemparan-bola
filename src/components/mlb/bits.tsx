'use client'

// ============================================================
// bits — komponen kecil bersama untuk 15 layar
// Tema: biru tua (dasar) + oranye bola basket (aksen)
// ============================================================

import React, { useEffect, useState } from 'react'
import { Check, X, Lock, Lightbulb, ExternalLink, Maximize, Minimize } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { GEOGEBRA, type GeoGebraKey } from '@/config/links'
import type { CardId } from '@/lib/mlb/data'

export const NAVY = '#17345A'
export const ORANGE = '#F97316'

export type StatusCek = 'ok' | 'salah' | null

// ---------- Panel (kartu putih besar bersudut bulat) ----------
type Tone = 'white' | 'biru' | 'oranye' | 'navy' | 'hijau' | 'kuning' | 'merah'

const toneCls: Record<Tone, string> = {
  white: 'bg-white ring-slate-200/80',
  biru: 'bg-[#EFF5FC] ring-[#C9DCF0]',
  oranye: 'bg-[#FFF3E8] ring-[#F8D2AF]',
  navy: 'bg-[#17345A] ring-[#0F2542] text-white',
  hijau: 'bg-[#EAF7F0] ring-[#BCE3CC]',
  kuning: 'bg-[#FFF8E2] ring-[#F0E0A0]',
  merah: 'bg-[#FDECEF] ring-[#F3C2CB]',
}

export function Panel({
  title, ikon, tone = 'white', children, className,
}: {
  title?: React.ReactNode
  ikon?: React.ReactNode
  tone?: Tone
  children: React.ReactNode
  className?: string
}) {
  return (
    <Card className={cn('rounded-3xl shadow-xl shadow-black/10 ring-1 border-0', toneCls[tone], className)}>
      {title && (
        <div className="flex items-center gap-2 px-5 pt-4">
          {ikon && <span aria-hidden>{ikon}</span>}
          <h3 className={cn('font-extrabold leading-snug text-[18px] sm:text-[19px]', tone === 'navy' ? 'text-white' : 'text-[#17345A]')}>
            {title}
          </h3>
        </div>
      )}
      <CardContent className={cn('p-5 pt-3 space-y-3 text-[17px] sm:text-[18px] font-semibold leading-relaxed', tone === 'navy' ? 'text-white/90' : 'text-[#2A4166]')}>
        {children}
      </CardContent>
    </Card>
  )
}

// ---------- Judul layar + lencana fase ----------
export function BadgeFase({ n }: { n: number }) {
  return (
    <span
      className="shrink-0 size-10 rounded-2xl bg-gradient-to-b from-[#FB923C] to-[#F97316] text-white font-black grid place-items-center shadow-lg shadow-orange-950/40 text-xl"
      aria-label={`Fase ${n}`}
    >
      {n}
    </span>
  )
}

export function JudulLayar({ judul, sub, fase }: { judul: string; sub?: string; fase?: number }) {
  return (
    <div className="flex items-start gap-3">
      {fase ? <BadgeFase n={fase} /> : null}
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight drop-shadow">{judul}</h1>
        {sub && <p className="text-white/70 text-[15px] sm:text-[17px] font-semibold mt-1">{sub}</p>}
      </div>
    </div>
  )
}

// ---------- Tombol ----------
type Varian = 'primer' | 'navy' | 'lembut' | 'putih' | 'bahaya'

const varianCls: Record<Varian, string> = {
  primer: 'bg-gradient-to-b from-[#FB923C] to-[#F97316] text-white shadow-lg shadow-orange-950/40 hover:from-[#F97316] hover:to-[#EA580C]',
  navy: 'bg-[#17345A] text-white hover:bg-[#1E4372] shadow-md',
  lembut: 'bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20 backdrop-blur',
  putih: 'bg-white text-[#17345A] hover:bg-orange-50 shadow-md',
  bahaya: 'bg-[#D1495B] text-white hover:bg-[#B93B4C]',
}

export function Tombol({ varian = 'primer', className, ...props }: React.ComponentProps<'button'> & { varian?: Varian }) {
  return (
    <button
      {...props}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-extrabold px-5 h-12 text-[17px] transition-all active:scale-95 disabled:opacity-45 disabled:pointer-events-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDBA74]',
        varianCls[varian],
        className,
      )}
    />
  )
}

// ---------- Isian ----------
export function IsiAngka({
  value, onChange, placeholder = '…', className, disabled, ariaLabel, status = null,
}: {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  className?: string
  disabled?: boolean
  ariaLabel?: string
  status?: StatusCek
}) {
  const ring = status === 'ok'
    ? 'border-[#2E9E6B] ring-2 ring-[#2E9E6B]/30 bg-[#EAF7F0]'
    : status === 'salah'
      ? 'border-[#F2B705] ring-2 ring-[#F2B705]/40 bg-[#FFF8E2]'
      : ''
  return (
    <Input
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
      inputMode="decimal"
      className={cn('h-11 rounded-2xl border-2 border-slate-200 bg-white font-bold text-[#17345A] text-center text-xl w-24', ring, className)}
    />
  )
}

export function IsiTeks({
  value, onChange, rows = 3, placeholder, ariaLabel, className, disabled,
}: {
  value: string
  onChange: (v: string) => void
  rows?: number
  placeholder?: string
  ariaLabel?: string
  className?: string
  disabled?: boolean
}) {
  return (
    <Textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      rows={rows}
      placeholder={placeholder}
      disabled={disabled}
      aria-label={ariaLabel}
      className={cn('rounded-2xl border-2 border-slate-200 bg-white font-semibold text-[#17345A] text-[17px] resize-y min-h-[76px] leading-relaxed', className)}
    />
  )
}

// ---------- Layar penuh (proyektor / papan tulis digital) ----------
type DocFullscreen = Document & {
  webkitFullscreenElement?: Element | null
  webkitExitFullscreen?: () => Promise<void> | void
}
type ElFullscreen = HTMLElement & {
  webkitRequestFullscreen?: () => Promise<void> | void
}

/** Elemen yang sedang tampil layar penuh (lintas peramban). */
function elemenLayarPenuh(): Element | null {
  const d = document as DocFullscreen
  return d.fullscreenElement ?? d.webkitFullscreenElement ?? null
}

/** Masuk / keluar layar penuh — dipakai tombol, pintasan F, dsb. */
export function toggleLayarPenuhFS() {
  try {
    const d = document as DocFullscreen
    if (!elemenLayarPenuh()) {
      const el = document.documentElement as ElFullscreen
      void (el.requestFullscreen?.bind(el) ?? el.webkitRequestFullscreen?.bind(el))?.()
    } else {
      void (d.exitFullscreen?.bind(d) ?? d.webkitExitFullscreen?.bind(d))?.()
    }
  } catch { /* sebagian peramban/penyematan menolak — abaikan */ }
}

export function TombolLayarPenuh({
  className, denganLabel = false, varian = 'lembut',
}: {
  className?: string
  denganLabel?: boolean
  varian?: 'lembut' | 'putih'
}) {
  const [penuh, setPenuh] = useState(false)

  useEffect(() => {
    const ubah = () => setPenuh(Boolean(elemenLayarPenuh()))
    ubah()
    document.addEventListener('fullscreenchange', ubah)
    document.addEventListener('webkitfullscreenchange', ubah)
    return () => {
      document.removeEventListener('fullscreenchange', ubah)
      document.removeEventListener('webkitfullscreenchange', ubah)
    }
  }, [])

  const toggle = () => toggleLayarPenuhFS()

  const Ikon = penuh ? Minimize : Maximize
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={penuh}
      aria-label={penuh ? 'Keluar dari layar penuh' : 'Tampilkan layar penuh'}
      title={penuh ? 'Keluar layar penuh (F)' : 'Layar penuh (F)'}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-extrabold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FDBA74]',
        varian === 'putih'
          ? 'bg-white text-[#17345A] hover:bg-orange-50 shadow-md ring-1 ring-slate-200'
          : 'bg-white/10 text-white ring-1 ring-white/25 hover:bg-white/20 backdrop-blur',
        denganLabel ? 'h-11 px-4 text-[16px]' : 'size-11',
        className,
      )}
    >
      <Ikon className="size-5" aria-hidden />
      {denganLabel && <span>{penuh ? 'Layar Normal' : 'Layar Penuh'}</span>}
    </button>
  )
}

// ---------- Chip ----------
type ChipTone = 'abu' | 'oranye' | 'hijau' | 'merah' | 'biru' | 'kuning' | 'navy' | 'kaca'

const chipCls: Record<ChipTone, string> = {
  abu: 'bg-slate-100 text-slate-600 ring-slate-200',
  oranye: 'bg-[#FFF1E2] text-[#B45309] ring-[#F8CFA0]',
  hijau: 'bg-[#E4F6EC] text-[#1F7A4D] ring-[#B4E0C6]',
  merah: 'bg-[#FDECEF] text-[#B03044] ring-[#F3C2CB]',
  biru: 'bg-[#EBF3FC] text-[#1D5FA8] ring-[#C3DCF5]',
  kuning: 'bg-[#FFF8DC] text-[#8A6D0B] ring-[#EFDFA0]',
  navy: 'bg-[#17345A] text-white ring-[#17345A]',
  kaca: 'bg-white/10 text-white ring-white/25 backdrop-blur',
}

export function Chip({ tone = 'abu', children, className }: { tone?: ChipTone; children: React.ReactNode; className?: string }) {
  return <span className={cn('inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[13.5px] font-bold ring-1', chipCls[tone], className)}>{children}</span>
}

// ---------- Kotak hasil cek ----------
export function KotakHasil({ status, judul, children }: { status: 'ok' | 'salah' | 'info'; judul?: string; children?: React.ReactNode }) {
  const map = {
    ok: 'bg-[#EAF7F0] ring-[#9BDDB8] text-[#17603C]',
    salah: 'bg-[#FFF4F6] ring-[#F0AEBB] text-[#A32B3E]',
    info: 'bg-[#EBF3FC] ring-[#BCD9F5] text-[#1D5FA8]',
  } as const
  const ikon = status === 'ok' ? '🎉' : status === 'salah' ? '🤔' : 'ℹ️'
  return (
    <div className={cn('rounded-2xl ring-2 p-4 animate-pop', map[status])} role="status">
      {judul && <p className="font-extrabold flex items-center gap-2">{ikon} {judul}</p>}
      {children && <div className={cn('text-[17px] font-semibold leading-relaxed', judul && 'mt-1.5')}>{children}</div>}
    </div>
  )
}

// ---------- Petunjuk (setelah 2 kesempatan) ----------
export function Petunjuk({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-[#FFF8DC] ring-2 ring-[#EFDFA0] p-3.5 text-[#6B5508] text-[16px] font-semibold flex gap-2.5 animate-fadein">
      <Lightbulb className="size-5 shrink-0 text-[#D19A00] mt-0.5" aria-hidden />
      <div className="leading-relaxed">{children}</div>
    </div>
  )
}

// ---------- Kotak terkunci ----------
export function Terkunci({ pesan, children }: { pesan: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-slate-100 ring-2 ring-slate-200 p-4 text-slate-500 flex items-start gap-3">
      <Lock className="size-5 shrink-0 mt-0.5" aria-hidden />
      <div className="font-semibold text-[16px] leading-relaxed">
        <p>{pesan}</p>
        {children}
      </div>
    </div>
  )
}

// ---------- Pemilih kapsul (arah buka, keputusan, tindak lanjut) ----------
export function PilihKapsul({
  value, onChange, opsi, disabled,
}: {
  value: string
  onChange: (v: string) => void
  opsi: { v: string; label: string }[]
  disabled?: boolean
}) {
  return (
    <div className="flex gap-2 flex-wrap" role="group">
      {opsi.map(o => (
        <button
          key={o.v}
          type="button"
          disabled={disabled}
          aria-pressed={value === o.v}
          onClick={() => onChange(o.v)}
          className={cn(
            'h-11 px-4 rounded-2xl font-extrabold text-[16px] border-2 transition-all active:scale-95 disabled:opacity-50',
            value === o.v
              ? 'bg-[#F97316] border-[#EA580C] text-white shadow-md'
              : 'bg-white border-slate-200 text-[#17345A] hover:border-orange-300',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

// ---------- Baris cek (tebakan vs hasil) ----------
export function BarisCek({ label, teks, benar }: { label: string; teks: string; benar: boolean | null }) {
  return (
    <div className="flex items-center gap-2.5 rounded-xl bg-white ring-1 ring-slate-200 px-3 py-2.5">
      <span
        className={cn('size-6 shrink-0 rounded-full grid place-items-center text-white', benar === null ? 'bg-slate-300' : benar ? 'bg-[#2E9E6B]' : 'bg-[#D1495B]')}
        aria-hidden
      >
        {benar === null ? '?' : benar ? <Check className="size-4" /> : <X className="size-4" />}
      </span>
      <div className="min-w-0 text-[16px] leading-snug">
        <span className="font-extrabold text-[#17345A]">{label}: </span>
        <span className="font-semibold text-[#2A4166]">{teks}</span>
      </div>
    </div>
  )
}

// ---------- Pilihan kartu A/B/C ----------
export function PilihanKartu({ value, onChange, kecil }: { value: '' | CardId; onChange: (k: '' | CardId) => void; kecil?: boolean }) {
  const meta: Record<CardId, { emoji: string; warna: string }> = {
    A: { emoji: '🏀', warna: '#E8702A' },
    B: { emoji: '🔵', warna: '#3D6DB5' },
    C: { emoji: '🟢', warna: '#2E9E6B' },
  }
  return (
    <div className="grid grid-cols-3 gap-2" role="group" aria-label="Pilih kartu data">
      {(['A', 'B', 'C'] as const).map(k => {
        const aktif = value === k
        return (
          <button
            key={k}
            type="button"
            aria-pressed={aktif}
            onClick={() => onChange(k)}
            className={cn(
              'rounded-2xl border-2 font-extrabold transition-all active:scale-95 text-center',
              kecil ? 'p-2.5' : 'p-3.5',
              aktif
                ? 'border-[#F97316] bg-[#FFF3E8] ring-4 ring-[#F97316]/25 scale-[1.02] shadow-md'
                : 'border-slate-200 bg-white text-[#17345A] hover:border-orange-300',
            )}
          >
            <span className="block text-3xl leading-none mb-1" aria-hidden>{meta[k].emoji}</span>
            <span className="block text-xl" style={{ color: meta[k].warna }}>Kartu {k}</span>
            {!kecil && <span className="block text-[12.5px] font-bold text-slate-400 mt-0.5">5 titik data</span>}
          </button>
        )
      })}
      {/* Tombol hapus kartu dipilih selalu tampil di kolom ke-4 */}
      <button
        key="hapus"
        type="button"
        aria-pressed={value === ''}
        onClick={() => onChange('') as any}
        className={cn(
          'rounded-2xl border-2 font-extrabold transition-all active:scale-95 text-center',
          'p-3.5',
          'border-[#6B7280] bg-[#F3F4F6] text-[#6B7280] hover:border-gray-400',
        )}
      >
        <span className="block text-3xl leading-none mb-1" aria-hidden>🗑️</span>
        <span className="block text-xs">Hapus</span>
      </button>
    </div>
  )
}

// ---------- Skala refleksi 1–4 ----------
export function Skala4({ value, onChange, ariaLabel }: { value: number; onChange: (v: number) => void; ariaLabel: string }) {
  const ket = ['', 'Belum bisa', 'Dengan bantuan', 'Bisa sendiri', 'Bisa + bisa jelaskan']
  return (
    <div className="flex gap-1.5" role="group" aria-label={ariaLabel}>
      {[1, 2, 3, 4].map(n => (
        <button
          key={n}
          type="button"
          aria-pressed={value === n}
          title={`${n} · ${ket[n]}`}
          onClick={() => onChange(n)}
          className={cn(
            'h-10 flex-1 rounded-xl font-black border-2 transition-all active:scale-90 text-[17px]',
            value >= n
              ? 'bg-gradient-to-b from-[#FB923C] to-[#F97316] border-[#EA580C] text-white shadow'
              : 'bg-white border-slate-200 text-slate-400 hover:border-orange-300',
          )}
        >
          {n}
        </button>
      ))}
    </div>
  )
}

// ---------- Tombol tautan GeoGebra (sembunyi bila kosong) ----------
export function GGBButton({ g, label = 'Buka di GeoGebra' }: { g: GeoGebraKey; label?: string }) {
  const url = GEOGEBRA[g]
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center justify-center gap-2 rounded-full bg-[#17345A] text-white font-extrabold px-4 h-11 hover:bg-[#1E4372] transition-colors shadow-md text-[16px]"
    >
      <ExternalLink className="size-4" aria-hidden />
      {label}
    </a>
  )
}
