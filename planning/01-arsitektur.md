# 01 — Arsitektur & Tech Stack

## Stack Inti
- **Framework:** Next.js 16 (App Router) — versi baru, API berubah dari yang lazim diketahui. Selalu cek `node_modules/next/dist/docs/` sebelum mengasumsikan perilaku.
- **Bahasa:** TypeScript strict.
- **Styling:** Tailwind CSS v4.
- **UI Component:** shadcn/ui (di-add per komponen, hindari over-fetching).
- **Database:** PostgreSQL + Prisma ORM.
- **Auth:** Auth.js (NextAuth v5) — credentials provider, username + password sederhana. Single-user app, tidak ada role.
- **Local Store:** Dexie.js di atas IndexedDB.
- **PWA:** `next-pwa` atau Workbox custom service worker.
- **Validation:** Zod di boundary server (Route Handler & Server Action).
- **Notifikasi:** Web Push API + VAPID untuk Android, local Notification fallback.

## Pemisahan Server / Client
- **Server Components** default — semua halaman read-mostly (kalender, riwayat).
- **Client Components** dibatasi ke widget interaktif: tombol logging, kalender pemilih tanggal, modal flashcard.
- **Server Actions** untuk semua mutasi (log haid, log TTD, request stok). Hindari `useEffect`+`fetch` untuk write.

## Cache Components (Next.js 16)
- Gunakan `'use cache'` di fungsi server yang menghitung prediksi SMA — outputnya deterministik per user/siklus.
- Tag dengan `cacheTag('user:${id}:cycles')`. Setiap mutasi (log haid baru) panggil `updateTag` agar prediksi di-rebuild.
- Data realtime (inventory TTD) **tidak** di-cache; baca live dari DB tiap request.
- Halaman dashboard pakai PPR (Partial Prerendering): shell statis + Suspense untuk widget per-user.

## Background Tasks
- **Vercel Cron** harian jam 06.00 WITA: hitung ulang `cycle_length` rata-rata + assign badge retroaktif.
- **Trigger sinkronisasi** dipanggil saat `online` event di client — bukan cron — agar latensi rendah.

## Direktori
```
src/
  app/
    (auth)/login, register, onboarding
    (app)/dashboard, kalender, ttd, jurnal, profil, edukasi
    api/
  components/   # shadcn + custom
  lib/
    db/         # prisma instance
    sma/        # mesin prediksi (pure functions, mudah ditest)
    ttd/        # logika dynamic reminder
    sync/       # offline → online
    indexeddb/  # dexie schema
  hooks/
  styles/
```

## Revisi Keputusan Tech Stack
- **Database:** Awalnya direncanakan menggunakan MongoDB, namun direvisi menjadi **PostgreSQL** dengan **Prisma ORM** untuk integritas relasional yang lebih baik dan ekosistem tooling yang lebih stabil (Prisma dengan Postgres sangat mature).
- **Server Actions ATAU Route Handlers** — pilih **Server Actions** sebagai default, Route Handlers hanya untuk endpoint yang dipanggil service worker (sync) dan webhook cron.
