# 14 — PWA Setup

## Manifest (`public/manifest.webmanifest`)
- `name: "Tamuku — Teman Haid & TTD"`
- `short_name: "Tamuku"`
- `start_url: "/dashboard"`
- `display: "standalone"`
- `theme_color`: `#ff3d8a` (primary retro pink).
- `background_color`: `#fff0f5` (cream-pink).
- Ikon: 192×192, 512×512, maskable.
- `categories: ["health", "education"]`.
- `lang: "id"`.

## Service Worker
- Pilihan: `next-pwa` (cepat) vs Workbox manual (lebih kontrol).
- Rekomendasi: **Workbox manual** karena `next-pwa` belum tentu kompatibel dengan Next.js 16 saat tulisan ini.
- File: `public/sw.js`, register di root layout client.

### Strategi Caching
- **App shell** (`/`, `/_next/static/*`): Cache First, versioned per build.
- **Halaman dinamis**: Network First, fallback ke offline page `/offline`.
- **Asset gambar maskot/edukasi**: Stale While Revalidate.
- **API GET sync snapshot**: Network First; jangan cache batch POST.

### Background Sync
- Daftarkan tag `outbox-flush` saat ada item antrian.
- Service worker listen `sync` event → call `/api/sync/batch`.

### Push Listener
- `push` event → tampilkan notifikasi.
- `notificationclick` → `clients.openWindow(payload.url)`.

## Install Prompt
- Trigger custom: di `/profil`, banner "Pasang Tamuku di HP-mu agar lebih cepat dibuka" muncul jika `beforeinstallprompt` ter-capture.
- iOS: tampilkan panduan manual karena tidak ada prompt otomatis.

## Halaman `/offline`
- Tampilkan maskot + pesan "Kamu sedang offline, tapi tenang — log kamu tetap tersimpan dan akan dikirim saat online."
- Link ke `/dashboard` agar SW serve dari cache.

## Lighthouse Targets (sebelum rilis)
- PWA: 100.
- Performance mobile: ≥ 85.
- Accessibility: ≥ 95.
- Bundle JS awal: < 150KB gzipped.
