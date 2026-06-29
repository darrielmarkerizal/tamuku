# 15 — Timeline & Fase Pengembangan

Estimasi awal 1–2 bulan dipertahankan, dibagi tegas antara **MVP must-ship** dan **fase 2 nice-to-have**. Solo dev mode (1 lead dev).

## Definisi MVP (yang dirilis ke siswi target)
- Auth + Onboarding (4 langkah inti, izin notifikasi).
- Dashboard dengan one-click logging haid & TTD.
- Kalender bulanan + prediksi SMA dengan rentang.
- TTD logging + dynamic reminder + inventory self-managed.
- Maskot 4 state + streak + 3 badge inti.
- Jurnal harian (mood + gejala + note opsional).
- Notifikasi via Web Push (Android).
- Offline-first untuk semua mutasi.
- Tema retro pink (neo-brutalism: border ink + hard shadow, font Archivo Black + Space Grotesk).

## Out of MVP (fase 2)
- Bookmark flashcard.
- Heatmap mood di kalender.
- Ekspor data pribadi (JSON/CSV).
- Reset password via email.
- Dark mode.
- iOS PWA push polish.

## Fase per Minggu

### Fase 1 — Setup & Kerangka (Minggu 1–2)
- Hari 1–2: init Next.js 16, Tailwind v4 dengan `@theme` retro pink, shadcn (rebrand button/card/input ke style brutalism), font Archivo Black + Space Grotesk via `next/font`, Auth.js, Mongoose, Dexie skeleton.
- Hari 3–5: layout app + bottom nav + halaman placeholder (login, dashboard, kalender, ttd, profil, edukasi).
- Hari 6–8: skema MongoDB + auth e2e (register + login).
- Hari 9–10: PWA manifest (pink theme color), service worker dasar, offline page.
- **Deliverable:** app bisa di-install, login, navigasi semua tab kosong, sudah berwarna pink konsisten.

### Fase 2 — Logika Inti (Minggu 3–4)
- Hari 1–3: Period tracker + SMA + kalender visual (color-coded pink) + unit test SMA.
- Hari 4–5: TTD tracker + dynamic reminder + inventory self-managed + flashcard pop-up.
- Hari 6–8: IndexedDB outbox + `/api/sync/*` + skenario airplane mode.
- Hari 9–10: Jurnal harian + integrasi ke kalender.
- **Deliverable:** semua fitur jalan online dan offline.

### Fase 3 — Gamifikasi & Polish (Minggu 5–6)
- Hari 1–3: Maskot state engine + streak + 3 badge inti + cron evaluasi.
- Hari 4–5: Notifikasi Web Push + cron reminder + auto-close haid + cek stok bulanan.
- Hari 6–8: Polishing UI — animasi maskot (bobbing), mikrointeraksi press-effect translate, skeleton retro, copy edit oleh Lead Edukasi.
- Hari 9–10: Edukasi flashcard isi konten + halaman `/profil` lengkap.
- **Deliverable:** app rasa "produk", bukan prototype.

### Fase 4 — Pengujian & Deployment (Minggu 7–8)
- Hari 1–2: QA matriks device (Android Chrome low-end, mid-range).
- Hari 3–4: Test offline → online di lapangan (mock kondisi Sepaku via throttling).
- Hari 5: Penetration sederhana — Zod, rate limit, CSRF Server Actions.
- Hari 6: Deploy production ke Vercel + MongoDB Atlas (region Singapore terdekat).
- Hari 7–8: Onboarding di sekolah, sesi edukasi langsung oleh Lead Edukasi, kumpul feedback.

## Risiko Jadwal
- **Fase 2 paling padat** — siapkan buffer 2 hari.
- **Vercel Cron** butuh akun pro untuk jadwal lebih sering dari harian — pastikan plan mencukupi atau pindah ke cron eksternal (mis. cron-job.org pull ke `/api/cron/*`).
- **iOS support**: jangan blok rilis MVP untuk iOS — dokumentasikan limitasi.

## Definition of Done per Fitur
- TypeScript strict, tidak ada `any` yang tidak dijustifikasi.
- Server Action ditest unit + happy path manual.
- Mobile viewport 360px tidak overflow.
- Sesuai tema retro pink ([12-tema.md](12-tema.md)) — gunakan token CSS (`--color-*`, `--shadow-retro`), jangan hex hardcoded; semua elemen interaktif pakai press-effect translate.
- Copy di-review Lead Edukasi.
- Offline behavior diverifikasi (airplane mode).
