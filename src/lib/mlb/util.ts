// Util umum Misi Lemparan Bebas — angka koma/titik, format, salin, cek toleransi

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

/** sama dalam toleransi */
export function eqTol(input: string | number | null | undefined, target: number, tol = 0.01): boolean {
  const v = parseNum(input)
  return v !== null && Math.abs(v - target) <= tol
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
