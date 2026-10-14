# Worklog

---
Task ID: 1–11
Agent: Development Team (utama, seluruh tahap dikerjakan terpusat agar konsisten)
Task: Membangun web interaktif "Misi Lemparan Bebas" (Fungsi Kuadrat & Grafiknya — Fase E Kelas X) dari dokumen rancangan DOCX, di Next.js 16 + App Router, satu rute (/), tanpa backend.

Work Log:
- Membaca rancangan (upload/ddce6eca-….docx via gambar terlampir): 7 fase, 3 applet, kartu data A/B/C, aturan masuk |f(5)−3|≤0,1, Mode Guru, localStorage `mlb.v1.*`, palet oranye/creme/navy, font Nunito.
- Keputusan arsitektur: applet GeoGebra (deployggb.js butuh internet geogebra.org) DIGANTI dengan applet SVG buatan sendiri yang ringan, berbahasa Indonesia, dan jalan offline — semua spesifikasi interaksi (slider a/p/q, titik digeser, animasi bola, sumbu simetri, puncak, pembanding y=x²) tetap dipenuhi. Kriteria uji "bila geogebra.org tak terjangkau" otomatis terpenuhi.
- Task 1 — lib inti: `src/lib/mlb/data.ts` (kartu A/B/C + kunci + contoh terbimbing + jembatan konsep + bantuan + catatan guru), `util.ts` (parseNum koma/titik, fmt tampilan koma, eqTol, fitParabola, downloadFile), `store.tsx` (Context + localStorage `mlb.v1.state` debounce 250ms, try/catch semua akses, ?guru=1).
- Task 2 — `Graph.tsx` (kanvas koordinat SVG bersama: grid, sumbu berlabel, curvePath pemenggalan segmen, DataPoint circle/square/triangle), `AppletA` (Penjelajah Puncak: slider a,p,q + tween + Atur ulang), `AppletB` (Lintasan Bola: mode points/curves/animate, ring (5;3) + zona 2,9–3,1, animasi rAF 5,2 dtk + verdict masuk/kurang/lewat), `AppletC` (Plot Kartu Data: drag pointer + snap 0,1, toleransi 0,15, status ok/near/bad, garis patah & kurva mulus, overlay sumbu/puncak/f(x)).
- Task 3 — `bits.tsx`: WorkPanel (kiri isian, kanan applet; HP: applet di atas), Panel, NumIn (koma/titik), TextQ (counter min char), LockedBox (gerbang), GuruKey, Bubble, Scale, StepTitle, Chip.
- Task 4 — Fase 1 (Orientasi: titik ketuk-koordinat + 2 pertanyaan ≥5 char), Fase 2 (nama + pilih/undi kartu, kartu bak pemain), Fase 3 (kalimat dugaan A/B/C + alasan).
- Task 5 — Fase 4 (4a tebak puncak/arah 3 fungsi → 4b "Lihat grafik" aktif setelah lengkap + applet terkunci tween → 4c kesimpulan ≥10 char membuka kotak "Perubahan" → 4d 4 pilihan + kartu PETUA → 4e eksplorasi), Fase 5 (tab 1a plot drag + periksa titik → 1b pasangan setinggi/mid/puncak berantai → 2 hitung a dari (0;2) tol 0,001 + uji titik lain 0,05 + contoh → 3 empat langkah f(5) berantai + panel urutan operasi + keputusan disimpan → BARU animasi + pesan menuntun bila beda).
- Task 6 — Fase 6 (tabel kunci A/B/C + 3 kurva, coba rekomendasi a=(2−q)/p² live, tabel rekap auto-cek + baris "data teman" kunci muncul setelah diisi, bahan presentasi, formalisasi hotspot + slider miskonsepsi p, cek dugaan Terbukti/Perlu diperbaiki), Fase 7 (refleksi skala 1–4 TP1/TP2, kuis 3 soal boleh diulang + grafik bantuan, penutup, Unduh JSON, Cetak/PDF).
- Task 7 — `MlbApp.tsx`: header sticky (badge nama+kartu), stepper 7 fase, footer sticky (progres + Sebelumnya/Lanjut ter-gerbang + Bantuan), dialog Peta Alur (lompat bebas), Bantuan per fase, Mode Guru (sandi "guru": bar amber catatan per fase, semua gerbang terbuka, kunci inline, mode proyektor, ganti kartu, atur ulang data), PrintSummary khusus cetak.
- Task 8 — layout lang="id" + Nunito (CDN, fallback sistem), metadata; globals.css: palet, animasi pop/fade/bounce, scrollbar, mode proyektor, @media print.
- Task 9 — lint bersih (memperbaiki set-state-in-effect via rAF-only setState, useCallback×ref, directive tak terpakai, a11y DialogContent).
- Task 10 — verifikasi agent-browser end-to-end: alur golden path Fase 1→7 lengkap (termasuk drag 5 titik via mouse, "3,8" koma = "3.8" titik, animasi bola + verdict "Masuk! Tepat di ring"), reload tidak kehilangan isian & kembali ke fase terakhir, Peta Alur lompat, Bantuan, Mode Guru (bypass + proyektor 20px + catatan), Unduh JSON tervalidasi isinya, PDF cetak memuat lembar jawaban, mobile 360px (applet di atas, footer sticky, tak ada overlap). Konsol & page errors bersih.
- Perbaikan hasil verifikasi: kunci baris "data teman" kini tampil untuk murid (sebelumnya hanya guru), label zona/ring tidak bertumpuk, strip "karena" ganda pada kutipan dugaan, tombol "Lihat grafik" kuis menggulir ke grafik.

Stage Summary:
- Artefak: src/lib/mlb/{data,util,store}.tsx(ts), src/components/mlb/{Graph,AppletA,AppletB,AppletC,bits,MlbApp}.tsx, src/components/mlb/phases/Fase1..7.tsx, layout/page/globals.css.
- Tanpa backend/db — persistensi murni localStorage (bila gagal, web tetap jalan tanpa menyimpan).
- Lint: PASS. Dev server port 3000: PASS. Verifikasi browser: PASS (bukti screenshot & PDF di /home/z/my-project/download/verify-*.png|pdf).
- Kata sandi Mode Guru: "guru" (atau tautan ?guru=1). Penanda klien, bukan keamanan.

---
Task ID: 12
Agent: Development Team (utama, seluruh tahap dikerjakan terpusat agar konsisten)
Task: Mengubah total (rewrite) web "Misi Lemparan Bebas" mengikuti rancangan baru berformat 16 layar gaya web contoh misi-detektif-termometer.vercel.app (mobile-first, pindah layar seperti slide interaktif, tombol Lanjut/Kembali, Peta Alur hub, progres, hash navigation, tanpa GeoGebra tertanam).

Work Log:
- Membaca rancangan baru: 19 slide PPT → 16 layar (slide 7–9 digabung; Cek Jawaban jadi panel di layar 11), peta layar 0–15, aturan interaksi (2 kesempatan → petunjuk; tebak dulu baru lihat; uji tanda p via f(0)=2; urutan operasi f(5) 4 langkah; zona masuk 2,9–3,1 m; toleransi koma/titik; jawaban terbuka tak dinilai; tombol "Salin jawabanku").
- Keputusan: struktur lama 7 fase (MlbApp, Fase1–7, AppletA/B/C) dihapus; dipertahankan & dipakai ulang Graph.tsx (kanvas SVG, curvePath), util.ts (parseNum/fmt/eqTol + tambahan copyText), sebagian data (kartu, JEMBATAN, CONTOH) yang disesuaikan (Kartu C kini 5 titik sesuai rancangan: (0;2)(1;2,7)(2;3,2)(4;3,6)(6;3,2)).
- Baru — src/config/links.ts: tautan GeoGebra G1/G2/G3 dalam satu berkas pengaturan; kosong ("") → tombol "Buka di GeoGebra" otomatis disembunyikan (bukan tombol rusak); PENYUSUN.
- Baru — src/lib/mlb/store.tsx: state 16 layar (progres per layar, kartu, dugaan, tebakan, plot, simetri, a, f5, cek3, refleksi, kuis, transfer) + localStorage `mlb2.v1.state` + navigasi hash `#/layar-N` (tombol back browser berfungsi, posisi layar terakhir diingat saat reload) + goto/upd/resetAll.
- Baru — src/lib/mlb/data.ts: CARDS (kunci a, p, q, f(5), keputusan, selisih), ZONA 2,9–3,1, JEMBATAN 3 fungsi + penuntun, CONTOH a=−0,25, meta LAYAR (16) & FASES (7 + Penutup), KUIS 3 soal (TP-1/TP-2).
- Baru — src/lib/mlb/laporan.ts: buildLaporan (teks lengkap jawaban murid untuk ditempel ke LKPD/WhatsApp) via copyText.
- Baru — src/components/mlb/bits.tsx: Panel, JudulLayar + BadgeFase, Tombol (5 varian), IsiAngka/IsiTeks, Chip, KotakHasil, Petunjuk, Terkunci, PilihKapsul, BarisCek, PilihanKartu, Skala4, GGBButton.
- Baru — src/components/mlb/grafik.tsx: SceneLemparan (Gambar 1: 3 lintasan + ring (5;3), ketuk untuk menyorot), MiniKurva (grafik statis + pembanding y=x²), GridTap (ketuk kolom untuk plot, cek otomatis, kilat salah), AnatomiParabola, AnimasiBola (sampul, animateMotion).
- Baru — 16 layar src/components/mlb/layar/Layar0..15.tsx sesuai peta layar rancangan (Sampul, Peta Alur, Orientasi, Rumusan Masalah, Dugaan, Tebak Dulu, Hasil Tebakan, Kesimpulan Konsep, Plot dan Amati, Sumbu Simetri, Menemukan Fungsi, Hitung f(5)+Cek Jawaban A/B/C, Rekap, Formalisasi, Refleksi & Kuis, Penutup).
- Baru — src/components/mlb/MisiApp.tsx: header sticky (judul, layar x/16, progres bar oranye, tombol Peta), main max-w-2xl animasi fadein, navigasi bawah tetap (Kembali · Peta · Lanjut) + safe-area, sonner toast.
- page.tsx → MlbProvider + MisiApp; layout.tsx tanpa Toaster radix; globals.css → dasar biru tua gradient + aksen oranye, scrollbar gelap, selection oranye.
- Kualitas: eslint PASS; bunx tsc --noEmit bersih untuk kode proyek (menemukan & memperbaiki "r is not defined" di Layar12 + narrowing di Layar10).
- Perbaikan hasil verifikasi browser: cekBaris kini memakai/menyimpan nilai fallback kartu sendiri (baris kartu tidak lagi "—"), teks selisih tidak duplikatif ("f(5) = 0,5 m — 2,5 m di bawah ring").
- Verifikasi agent-browser end-to-end (screenshot di download/v2-*.png): alur golden path layar 0→15 lengkap; gate tebakan; sorot lintasan; plot 5 titik; pasangan setinggi; a=−0,2 koma; 4 langkah f(5) berantai (2 → 4 → −0,8 → 3); keputusan MASUK + selisih; cek jawaban B (0.5 titik) & C (3,5 koma); rekap ✓✓✓; dugaan TERBUKTI; kuis salah→penuntun→benar→pembahasan; Salin Jawabanku sukses; peta semua fase "✓ selesai"; tombol back browser; reload kembali ke layar terakhir; mobile 360px rapi; console bersih tanpa error.

Stage Summary:
- Artefak: src/config/links.ts; src/lib/mlb/{data,store,laporan,util}.ts(x); src/components/mlb/{Graph,bits,grafik,MisiApp}.tsx + layar/Layar0..15.tsx; page.tsx, layout.tsx, globals.css.
- Tema sesuai permintaan: biru tua sebagai dasar, oranye bola basket sebagai aksen, kartu bersudut bulat, huruf besar, lencana fase 1–7.
- Tanpa GeoGebra tertanam: semua grafik SVG buatan sendiri; GeoGebra hanya tombol tautan (config links.ts, disembunyikan bila kosong).
- Lint PASS · tsc PASS · dev server 3000 PASS · verifikasi browser PASS (16/16 layar).
- Petunjuk guru: isi GEOGEBRA.G1/G2/G3 di src/config/links.ts untuk mengaktifkan tombol GeoGebra; ganti PENYUSUN bila perlu.
