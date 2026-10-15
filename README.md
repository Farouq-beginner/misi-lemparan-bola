# 🏀 Misi Lemparan Bebas

Web belajar **interaktif 15 layar** untuk Matematika **Fase E · Kelas X**: fungsi kuadrat
sebagai model lintasan parabola. Murid berperan sebagai *analis data* pelatih basket yang
harus membongkar misteri: **mengapa dari 3 lemparan bebas hanya 1 yang masuk ring?**

Setiap layar adalah satu langkah misi — murid mengamati, menduga, memplot titik, menemukan
fungsi `f(x) = a(x − p)² + q`, menghitung `f(5)`, lalu memutuskan lemparan mana yang masuk
beserta alasannya.

> Dibangun tanpa backend. Seluruh jawaban murid disimpan otomatis di perangkat
> (localStorage), sehingga misi bisa dilanjutkan kapan saja. Semua grafik adalah SVG buatan
> sendiri — web tetap jalan tanpa internet.

---

## 1. Menjalankan

Prasyarat: **Node.js ≥ 20** atau **Bun ≥ 1.3**.

```bash
bun install          # atau: npm install
bun run dev          # http://localhost:3000
```

Perintah lain:

| Perintah | Kegunaan |
| --- | --- |
| `bun run dev` | Server pengembangan di port 3000 (hot reload) |
| `bun run build` | Build produksi + menyalin aset ke keluaran `standalone` |
| `bun run start` | Menjalankan hasil build (keluaran `standalone`) |
| `bun run lint` | ESLint (`eslint .`) |
| `npx tsc --noEmit` | Pemeriksaan tipe |

---

## 2. Peta 15 layar

| # | Layar | Fase | Isi |
| --- | --- | --- | --- |
| 0 | Sampul | — | Judul, penyusun, animasi bola masuk ring, tombol Mulai |
| 1 | Peta Alur | — | Tujuan pembelajaran + 7 fase & Penutup; lompat bebas antar layar |
| 2 | Orientasi | 1 | Amati tiga titik lemparan + 2 pertanyaan pemantik |
| 3 | Rumusan Masalah | 2 | Misi pelatih, aturan koordinat, **pintasan GeoGebra**, 4 aturan kerja, **pilih/hapus Kartu A/B/C** |
| 5 | Tebak Dulu | 3 | Tebak puncak & arah buka tiga grafik sebelum melihatnya |
| 6 | Hasil Tebakan | 3 | Grafik terbuka; bandingkan dengan tebakan |
| 7 | Kesimpulan Konsep | 4 | Bentuk `a(x − p)² + q`, kartu penguat, anatomi parabola |
| 8 | Plot dan Amati | 5 | Ketuk kolom grid untuk memplot 5 titik Kartu Data |
| 9 | Sumbu Simetri | 5 | Cari pasangan titik setinggi → sumbu `x = p` dan puncak |
| 10 | Menemukan Fungsi | 5 | Hitung `a` lewat titik lepas `(0 ; 2)`, uji pada titik lain |
| 11 | Hitung f(5) | 6 | Empat langkah berurutan + keputusan masuk/tidak + panel **Cek Jawaban** |
| 12 | Rekap Misi | 6 | Tabel rekap ketiga lemparan + pertanyaan pembanding |
| 13 | Formalisasi | 7 | Rangkuman konsep + miskonsepsi tanda `p` |
| 14 | Refleksi & Kuis | 7 | Skala TP1/TP2 + kuis 3 soal (boleh diulang) |
| 15 | Penutup | — | Tiga hal yang dibawa pulang, pertanyaan transfer, topik berikutnya, salin jawaban |

Fase pada lencana mengikuti urutan: **1** Orientasi → **2** Rumusan Masalah → **3** Tebak
Dulu → **4** Kesimpulan Konsep → **5** Plot & Analisis → **6** Hitung & Keputusan →
**7** Formalisasi & Refleksi.

> Angka `#` pada tabel adalah **nomor berkas** `LayarN.tsx`. Layar 4 ("Dugaan Pertama")
> sudah dihapus dari rancangan awal — karena itu kolomnya melompati 4 dan totalnya
> **15 layar** (state lama dengan 16 layar otomatis dimigrasi saat halaman dibuka).

### Fitur Baru: Menghapus Kartu Data

Di layar **3 (Rumusan Masalah)**, tombol **Hapus** di komponen **Pilihan Kartu** memungkinkan penganalis untuk menghapus kartu data yang dipilih. Ketuk tombol **Hapus** (ikone 🗑️) pada kolom ke-4, dan:

- Kartu yang dipilih (`A`, `B`, atau `C`) dikembalikan ke state kosong
- Semua jawaban terkait kartu (plot, simetri, aCari, f5) direset
- Progres layar dan hash `#/layar-N` tetap terjaga
- Murid bisa memilih kartu baru dari nol

> Perhatian: ini berbeda dengan berganti kartu — memilih kartu baru akan **menyimpan** jawaban kartu lama sebelum memuat kartu baru. Fungsi hapus benar-benar mereset semuanya ke state awal.

---

## 3. Konten matematika

Tiga Kartu Data (semua titik tepat di parabolanya dan selalu `f(0) = 2`):

| Kartu | Fungsi | Puncak | `f(5)` | Keputusan |
| --- | --- | --- | --- | --- |
| A | `−0,2(x − 3)² + 3,8` | (3 ; 3,8) | 3 m | ✅ **MASUK** — tepat di ring |
| B | `−0,3(x − 2)² + 3,2` | (2 ; 3,2) | 0,5 m | ❌ tidak — 2,5 m di bawah ring |
| C | `−0,1(x − 4)² + 3,6` | (4 ; 3,6) | 3,5 m | ❌ tidak — 0,5 m di atas ring |

- Titik lepas bola: **(0 ; 2)** — bola meninggalkan tangan setinggi 2 m.
- Ring basket: **(5 ; 3)**.
- Aturan masuk: tinggi bola di `x = 5` harus berada pada **2,9 m – 3,1 m** (ring 3 m, toleransi ±10 cm).
- Murid boleh menulis koma atau titik desimal (`3,8` = `3.8`).

---

## 4. Struktur proyek

```
src/
├─ app/
│  ├─ layout.tsx          # <html lang="id">, font Nunito, metadata
│  ├─ page.tsx            # rute tunggal "/" → MlbProvider + MisiApp
│  └─ globals.css         # Tailwind 4, palet, animasi, skala layar lebar, gaya cetak
├─ components/
│  ├─ mlb/
│  │  ├─ MisiApp.tsx      # kerangka: header + progres, konten, navigasi bawah, peta alur
│  │  ├─ bits.tsx         # komponen dasar: Panel, Tombol, IsiAngka, IsiTeks, Chip, …
│  │  ├─ grafik.tsx       # SVG: titik lemparan A/B/C, anatomi parabola, grid plot, animasi bola
│  │  ├─ Graph.tsx        # kanvas koordinat bersama (grid, sumbu, kurva, titik)
│  │  ├─ SplashScreen.tsx # layar pembuka penuh layar (memudar otomatis)
│  │  ├─ BackgroundRumus.tsx # rumus & kurva samar yang naik-turun di latar
│  │  └─ layar/Layar0..3,5..15.tsx   # 15 layar (Layar4 — Dugaan Pertama — dihapus)
│  └─ ui/                 # komponen shadcn yang dipakai saja: card, input, table, textarea, sonner
├─ config/links.ts        # tautan GeoGebra + nama penyusun
└─ lib/
   ├─ mlb/data.ts         # Kartu A/B/C, kunci jawaban, zona masuk, kuis, meta layar
   ├─ mlb/store.tsx       # state 15 layar + localStorage + navigasi hash + migrasi skema
   ├─ mlb/util.ts         # parseNum (koma/titik), fmt, eqTol, copyText
   ├─ mlb/laporan.ts      # "Salin Jawabanku" — rangkuman jawaban siap tempel
   └─ utils.ts            # cn() (clsx + tailwind-merge)
scripts/salin-standalone.mjs  # menyalin aset untuk keluaran standalone (portabel)
```

---

## 5. Cara kerja data

- **Satu state global** di `src/lib/mlb/store.tsx` (`MlbProvider` + `useMLB()`).
- **Tersimpan otomatis** ke `localStorage` dengan kunci `mlb2.v1.state`, ditulis tertunda
  250 ms. Semua akses dibungkus `try/catch` — bila penyimpanan diblokir, web tetap jalan
  tanpa menyimpan.
- **Navigasi hash** `#/layar-N`: tombol back/forward peramban berfungsi dan posisi layar
  terakhir diingat saat halaman dimuat ulang.
- **Jawaban per kartu.** Jawaban yang bergantung pada Kartu Data (plot titik, sumbu simetri,
  nilai `a`, dan `f(5)`) disimpan terpisah untuk A, B, dan C di dalam `perKartu`. Saat murid
  berganti kartu, jawaban kartu lama disimpan lebih dulu lalu jawaban kartu baru dimuat —
  jadi jawaban Kartu A tidak pernah bocor ke Kartu B/C, dan kembali ke Kartu A memulihkan
  pekerjaan semula.
- Data tersimpan yang rusak/sebagian tetap aman: `loadState()` dan `gabungJawaban()`
  membandingkan dengan bentuk baku sebelum dipakai.
- **Fitur baru:** Ketuk tombol **Hapus** di layar 3 untuk mereset kartu data beserta semua jawabannya ke state kosong. State tetap disimpan di localStorage dan bisa dipulihkan nanti.

---

## 6. Menyesuaikan

Semua di satu berkas: [`src/config/links.ts`](src/config/links.ts)

```ts
export const GEOGEBRA = {
  G1: '', // Layar 5–6  — tiga fungsi + pembanding y = x²
  G2: '', // Layar 8    — bidang koordinat + titik kartu
  G3: '', // Layar 11   — simulator lemparan (slider a, p, q)
  G4: 'https://www.geogebra.org/geometry', // Layar 3 — pintasan "Masuk ke GeoGebra"
}
export const PENYUSUN = 'Nama Penyusun'
```

- Selama tautan masih `''`, tombol **“Buka di GeoGebra”** otomatis **disembunyikan**
  (bukan tampil sebagai tombol rusak). `G4` sudah terisi tautan GeoGebra umum sebagai
  contoh — ganti dengan tautan materimu sendiri.
- Mengubah kartu, kunci jawaban, kuis, atau judul layar: [`src/lib/mlb/data.ts`](src/lib/mlb/data.ts).

---

## 7. Tampilan & aksesibilitas

- **Layar penuh** lewat tombol di header (dan mengambang di sampul) atau **pintasan `F`**;
  diabaikan saat sedang mengetik. Memakai fallback `webkit*` untuk Safari/iOS.
- **Skala layar lebar:** konten diperbesar bertingkat pada ≥900 / ≥1200 / ≥1600 / ≥2000 px
  agar tulisan tetap terbaca saat diproyeksikan.
- **Ukuran huruf** dinaikkan langsung pada kelas tipografinya (bukan hanya zoom tampilan),
  jadi teks juga lebih besar pada layar biasa dan di ponsel.
- Menghormati `prefers-reduced-motion`: seluruh animasi latar dimatikan.
- Tema biru tua + aksen oranye bola basket, huruf Nunito, sudut membulat, target sentuh besar.
- `globals.css` menyiapkan gaya cetak (`@media print`): header, navigasi, dan tombol
  disembunyikan sehingga hasil **Ctrl+P / Simpan PDF** rapi sebagai lembar jawaban.

---

## 8. Catatan pembersihan template

Repo ini semula memakai kerangka template Next.js + shadcn/ui yang jauh lebih besar dari
kebutuhan. Berkas yang tidak terpakai sudah dihapus dari repo:

- Boilerplate template: `examples/` (demo websocket), `mini-services/`, `prisma/`,
  `db/custom.db`, `tests/`.
- Komponen shadcn/ui yang tidak dirujuk siapa pun (43 berkas) dan hook `use-mobile`/`use-toast`.
- Sisa akses basis data (`src/lib/db.ts`) dan rute contoh `src/app/api/route.ts` — aplikasi ini
  sengaja tanpa backend.
- Dependensi tak terpakai di `package.json` (dari **65 menjadi 8** dependensi runtime) dan
  skrip `db:*`; `bun.lock` ikut diperbarui.
- Fungsi util yang tidak dirujuk siapa pun: `fmtPt`, `clamp`, `downloadFile`, `fitParabola`.
- Langkah `cp -r` pada skrip `build` diganti skrip Node `scripts/salin-standalone.mjs` supaya
  build jalan di Linux, macOS, maupun Windows; `typescript.ignoreBuildErrors` dihapus karena
  pemeriksaan tipe sudah bersih.
- `tailwind.config.ts` (Tailwind 4 memakai konfigurasi CSS di `globals.css`).
- Tangkapan layar verifikasi `download/` dikeluarkan dari repo dan dimasukkan `.gitignore`
  (berkasnya masih ada di perangkat).

Pemeriksaan yang dijalankan setelah pembersihan: `tsc --noEmit` bersih, `eslint .` bersih,
`bun run build` berhasil (exit 0), dan halaman utama diuji di peramban.

---

## 9. Riwayat pengembangan

Catatan rinci tiap tahap pembangunan (rancangan, keputusan arsitektur, hasil verifikasi
peramban) ada di [`worklog.md`](worklog.md).


---

## 3. Konten matematika

Tiga Kartu Data (semua titik tepat di parabolanya dan selalu `f(0) = 2`):

| Kartu | Fungsi | Puncak | `f(5)` | Keputusan |
| --- | --- | --- | --- | --- |
| A | `−0,2(x − 3)² + 3,8` | (3 ; 3,8) | 3 m | ✅ **MASUK** — tepat di ring |
| B | `−0,3(x − 2)² + 3,2` | (2 ; 3,2) | 0,5 m | ❌ tidak — 2,5 m di bawah ring |
| C | `−0,1(x − 4)² + 3,6` | (4 ; 3,6) | 3,5 m | ❌ tidak — 0,5 m di atas ring |

- Titik lepas bola: **(0 ; 2)** — bola meninggalkan tangan setinggi 2 m.
- Ring basket: **(5 ; 3)**.
- Aturan masuk: tinggi bola di `x = 5` harus berada pada **2,9 m – 3,1 m** (ring 3 m, toleransi ±10 cm).
- Murid boleh menulis koma atau titik desimal (`3,8` = `3.8`).

---

## 4. Struktur proyek

```
src/
├─ app/
│  ├─ layout.tsx          # <html lang="id">, font Nunito, metadata
│  ├─ page.tsx            # rute tunggal "/" → MlbProvider + MisiApp
│  └─ globals.css         # Tailwind 4, palet, animasi, skala layar lebar, gaya cetak
├─ components/
│  ├─ mlb/
│  │  ├─ MisiApp.tsx      # kerangka: header + progres, konten, navigasi bawah, peta alur
│  │  ├─ bits.tsx         # komponen dasar: Panel, Tombol, IsiAngka, IsiTeks, Chip, …
│  │  ├─ grafik.tsx       # SVG: titik lemparan A/B/C, anatomi parabola, grid plot, animasi bola
│  │  ├─ Graph.tsx        # kanvas koordinat bersama (grid, sumbu, kurva, titik)
│  │  ├─ SplashScreen.tsx # layar pembuka penuh layar (memudar otomatis)
│  │  ├─ BackgroundRumus.tsx # rumus & kurva samar yang naik-turun di latar
│  │  └─ layar/Layar0..3,5..15.tsx   # 15 layar (Layar4 — Dugaan Pertama — dihapus)
│  └─ ui/                 # komponen shadcn yang dipakai saja: card, input, table, textarea, sonner
├─ config/links.ts        # tautan GeoGebra + nama penyusun
└─ lib/
   ├─ mlb/data.ts         # Kartu A/B/C, kunci jawaban, zona masuk, kuis, meta layar
   ├─ mlb/store.tsx       # state 15 layar + localStorage + navigasi hash + migrasi skema
   ├─ mlb/util.ts         # parseNum (koma/titik), fmt, eqTol, copyText
   ├─ mlb/laporan.ts      # "Salin Jawabanku" — rangkuman jawaban siap tempel
   └─ utils.ts            # cn() (clsx + tailwind-merge)
scripts/salin-standalone.mjs  # menyalin aset untuk keluaran standalone (portabel)
```

---

## 5. Cara kerja data

- **Satu state global** di `src/lib/mlb/store.tsx` (`MlbProvider` + `useMLB()`).
- **Tersimpan otomatis** ke `localStorage` dengan kunci `mlb2.v1.state`, ditulis tertunda
  250 ms. Semua akses dibungkus `try/catch` — bila penyimpanan diblokir, web tetap jalan
  tanpa menyimpan.
- **Navigasi hash** `#/layar-N`: tombol back/forward peramban berfungsi dan posisi layar
  terakhir diingat saat halaman dimuat ulang.
- **Jawaban per kartu.** Jawaban yang bergantung pada Kartu Data (plot titik, sumbu simetri,
  nilai `a`, dan `f(5)`) disimpan terpisah untuk A, B, dan C di dalam `perKartu`. Saat murid
  berganti kartu, jawaban kartu lama disimpan lebih dulu lalu jawaban kartu baru dimuat —
  jadi jawaban Kartu A tidak pernah bocor ke Kartu B/C, dan kembali ke Kartu A memulihkan
  pekerjaan semula.
- Data tersimpan yang rusak/sebagian tetap aman: `loadState()` dan `gabungJawaban()`
  membandingkan dengan bentuk baku sebelum dipakai.

---

## 6. Menyesuaikan

Semua di satu berkas: [`src/config/links.ts`](src/config/links.ts)

```ts
export const GEOGEBRA = {
  G1: '', // Layar 5–6  — tiga fungsi + pembanding y = x²
  G2: '', // Layar 8    — bidang koordinat + titik kartu
  G3: '', // Layar 11   — simulator lemparan (slider a, p, q)
  G4: 'https://www.geogebra.org/geometry', // Layar 3 — pintasan "Masuk ke GeoGebra"
}
export const PENYUSUN = 'Nama Penyusun'
```

- Selama tautan masih `''`, tombol **“Buka di GeoGebra”** otomatis **disembunyikan**
  (bukan tampil sebagai tombol rusak). `G4` sudah terisi tautan GeoGebra umum sebagai
  contoh — ganti dengan tautan materimu sendiri.
- Mengubah kartu, kunci jawaban, kuis, atau judul layar: [`src/lib/mlb/data.ts`](src/lib/mlb/data.ts).

---

## 7. Tampilan & aksesibilitas

- **Layar penuh** lewat tombol di header (dan mengambang di sampul) atau **pintasan `F`**;
  diabaikan saat sedang mengetik. Memakai fallback `webkit*` untuk Safari/iOS.
- **Skala layar lebar:** konten diperbesar bertingkat pada ≥900 / ≥1200 / ≥1600 / ≥2000 px
  agar tulisan tetap terbaca saat diproyeksikan.
- **Ukuran huruf** dinaikkan langsung pada kelas tipografinya (bukan hanya zoom tampilan),
  jadi teks juga lebih besar pada layar biasa dan di ponsel.
- Menghormati `prefers-reduced-motion`: seluruh animasi latar dimatikan.
- Tema biru tua + aksen oranye bola basket, huruf Nunito, sudut membulat, target sentuh besar.
- `globals.css` menyiapkan gaya cetak (`@media print`): header, navigasi, dan tombol
  disembunyikan sehingga hasil **Ctrl+P / Simpan PDF** rapi sebagai lembar jawaban.

---

## 8. Catatan pembersihan template

Repo ini semula memakai kerangka template Next.js + shadcn/ui yang jauh lebih besar dari
kebutuhan. Berkas yang tidak terpakai sudah dihapus dari repo:

- Boilerplate template: `examples/` (demo websocket), `mini-services/`, `prisma/`,
  `db/custom.db`, `tests/`.
- Komponen shadcn/ui yang tidak dirujuk siapa pun (43 berkas) dan hook `use-mobile`/`use-toast`.
- Sisa akses basis data (`src/lib/db.ts`) dan rute contoh `src/app/api/route.ts` — aplikasi ini
  sengaja tanpa backend.
- Dependensi tak terpakai di `package.json` (dari **65 menjadi 8** dependensi runtime) dan
  skrip `db:*`; `bun.lock` ikut disegarkan.
- Fungsi util yang tidak dirujuk siapa pun: `fmtPt`, `clamp`, `downloadFile`, `fitParabola`.
- Langkah `cp -r` pada skrip `build` diganti skrip Node `scripts/salin-standalone.mjs` supaya
  build jalan di Linux, macOS, maupun Windows; `typescript.ignoreBuildErrors` dihapus karena
  pemeriksaan tipe sudah bersih.
- `tailwind.config.ts` (Tailwind 4 memakai konfigurasi CSS di `globals.css`).
- Tangkapan layar verifikasi `download/` dikeluarkan dari repo dan dimasukkan `.gitignore`
  (berkasnya masih ada di perangkat).

Pemeriksaan yang dijalankan setelah pembersihan: `tsc --noEmit` bersih, `eslint .` bersih,
`bun run build` berhasil (exit 0), dan halaman utama diuji di peramban.

---

## 9. Riwayat pengembangan

Catatan rinci tiap tahap pembangunan (rancangan, keputusan arsitektur, hasil verifikasi
peramban) ada di [`worklog.md`](worklog.md).
