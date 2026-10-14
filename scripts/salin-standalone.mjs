// Salin aset yang dibutuhkan keluaran "standalone" Next.js.
// Dipakai oleh `bun run build`. Ditulis dengan Node (bukan `cp`) supaya
// perintahnya sama jalan di Linux, macOS, dan Windows.
import { cpSync, existsSync } from 'node:fs'

const pasangan = [
  ['.next/static', '.next/standalone/.next/static'],
  ['public', '.next/standalone/public'],
]

let gagal = 0
for (const [dari, ke] of pasangan) {
  if (!existsSync(dari)) {
    console.warn(`⚠️  Lewati "${dari}" — tidak ditemukan`)
    gagal++
    continue
  }
  cpSync(dari, ke, { recursive: true })
  console.log(`✓ disalin: ${dari} → ${ke}`)
}

if (gagal) {
  console.error(`✗ ${gagal} langkah gagal — keluaran standalone belum lengkap`)
  process.exit(1)
}
console.log('✓ keluaran standalone siap dijalankan')
