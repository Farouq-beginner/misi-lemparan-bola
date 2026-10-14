// Util umum Misi Lemparan Bebas — angka koma/titik, format, cek toleransi

/** "3,8" / "3.8" / " −2,5 " → -2.5 ; kembali null bila bukan angka */
export function parseNum(s: string | number | null | undefined): number | null {
  if (s === null || s === undefined) return null
  if (typeof s === 'number') return isFinite(s) ? s : null
  let t = String(s).trim()
  if (!t) return null
  t = t.replace(/−/g, '-').replace(/,/g, '.').replace(/\s/g, '')
  if (!/^-?\d*\.?\d+$/.test(t)) return null
  const v = parseFloat(t)
  return isFinite(v) ? v : null
}

/** 3.8 → "3,8" ; -0.25 → "-0,25" ; 3 → "3" (tampilan selalu koma) */
export function fmt(v: number, maxDec = 2): string {
  if (!isFinite(v)) return '?'
  let t = v.toFixed(maxDec)
  if (t.includes('.')) t = t.replace(/0+$/, '').replace(/\.$/, '')
  return t.replace('.', ',').replace(/-/g, '−')
}

/** titik → "(3 ; 3,8)" */
export function fmtPt(p: { x: number; y: number }): string {
  return `(${fmt(p.x)} ; ${fmt(p.y)})`
}

/** sama dalam toleransi */
export function eqTol(input: string | number | null | undefined, target: number, tol = 0.01): boolean {
  const v = parseNum(input)
  return v !== null && Math.abs(v - target) <= tol
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v))
}

/** salin teks ke clipboard; true bila berhasil */
export async function copyText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return true
    }
  } catch { /* coba cara lama di bawah */ }
  try {
    const ta = document.createElement('textarea')
    ta.value = text
    ta.style.position = 'fixed'
    ta.style.opacity = '0'
    document.body.appendChild(ta)
    ta.select()
    const ok = document.execCommand('copy')
    ta.remove()
    return ok
  } catch {
    return false
  }
}

/** unduh teks sebagai berkas */
export function downloadFile(name: string, content: string, mime = 'application/json') {
  try {
    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = name
    document.body.appendChild(a)
    a.click()
    a.remove()
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  } catch {
    // bila gagal, biarkan UI tetap jalan
  }
}

/** parabola kuadrat-terkecil lewat sekumpulan titik (untuk "kurva mulus") */
export function fitParabola(pts: { x: number; y: number }[]): { a: number; b: number; c: number } | null {
  const n = pts.length
  if (n < 3) return null
  let S0 = n, S1 = 0, S2 = 0, S3 = 0, S4 = 0, T0 = 0, T1 = 0, T2 = 0
  for (const p of pts) {
    const x2 = p.x * p.x
    S1 += p.x; S2 += x2; S3 += x2 * p.x; S4 += x2 * x2
    T0 += p.y; T1 += p.x * p.y; T2 += x2 * p.y
  }
  // sistem normal (unknowns [c, b, a]): [S0 S1 S2; S1 S2 S3; S2 S3 S4]·[c b a] = [T0 T1 T2]
  const m = [
    [S0, S1, S2, T0],
    [S1, S2, S3, T1],
    [S2, S3, S4, T2],
  ]
  for (let i = 0; i < 3; i++) {
    const piv = m[i][i] || 1e-9
    for (let j = i + 1; j < 3; j++) {
      const r = m[j][i] / piv
      for (let k = i; k < 4; k++) m[j][k] -= r * m[i][k]
    }
  }
  const x = [0, 0, 0]
  for (let i = 2; i >= 0; i--) {
    let s = m[i][3]
    for (let j = i + 1; j < 3; j++) s -= m[i][j] * x[j]
    x[i] = s / (m[i][i] || 1e-9)
  }
  const [c, b, a] = x
  if (!isFinite(a) || !isFinite(b) || !isFinite(c)) return null
  return { a, b, c }
}
