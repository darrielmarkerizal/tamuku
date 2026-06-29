# Planning Index — Tamuku (Period & TTD Tracker)

Dokumen perencanaan dipecah per halaman/fitur. File ini adalah indeks + ringkasan hasil review terhadap [Planning.md](../Planning.md) versi awal.

## Ruang Lingkup (final)
- **Single-user app.** Tidak ada role admin/UKS/guru. Siswi mengelola data sendiri, termasuk stok TTD-nya.
- **Tema visual retro pink (neo-brutalism ala [retroui.dev](https://www.retroui.dev/))** — border tebal hitam, hard drop shadow tanpa blur, sudut tegas, tipografi display chunky, press effect translate. Detail di [12-tema.md](12-tema.md).
- **Offline-first PWA** untuk Android Chrome (target perangkat utama di Sepaku).

## Struktur Dokumen

| File | Cakupan |
|------|---------|
| [01-arsitektur.md](01-arsitektur.md) | Tech stack, Next.js 16, PWA, batas server/client |
| [02-database.md](02-database.md) | Skema MongoDB (single-user, tanpa role) |
| [03-auth-onboarding.md](03-auth-onboarding.md) | Halaman login, register, onboarding siswi |
| [04-dashboard.md](04-dashboard.md) | Halaman utama (status haid, TTD hari ini, maskot) |
| [05-period-tracker.md](05-period-tracker.md) | Kalender + one-click logging haid + SMA |
| [06-ttd-tracker.md](06-ttd-tracker.md) | Logging TTD, dynamic reminder, inventory mandiri |
| [07-gamifikasi.md](07-gamifikasi.md) | Maskot, streak, badge retroaktif |
| [08-jurnal.md](08-jurnal.md) | Pencatatan mood & gejala harian |
| [09-edukasi.md](09-edukasi.md) | Flashcard bite-sized education |
| [10-notifikasi.md](10-notifikasi.md) | Web Push, local notification, jadwal |
| [11-offline-sync.md](11-offline-sync.md) | IndexedDB (Dexie), strategi sinkronisasi |
| [12-tema.md](12-tema.md) | Palet pink, tipografi, komponen shadcn override |
| [13-api-routes.md](13-api-routes.md) | Daftar endpoint Route Handlers / Server Actions |
| [14-pwa-setup.md](14-pwa-setup.md) | Manifest, service worker, install prompt |
| [15-timeline.md](15-timeline.md) | Pembagian fase 8 minggu yang diperbarui |
| [16-stitch-prompts.md](16-stitch-prompts.md) | Prompt Google Stitch per halaman (English prompt, Indonesian copy) |

---

## Review terhadap Planning.md Awal

### Sudah Bagus
- **Latar belakang medis kuat** — referensi ke standar ACOG menunjukkan prediksi siklus tidak asal.
- **Offline-first beralasan** — sesuai kondisi jaringan di Sepaku, Penajam Paser Utara.
- **Pemilihan SMA (bukan ML)** tepat untuk skala data per-user yang kecil dan ringan dijalankan di edge.
- **Dynamic reminder TTD** (mingguan vs harian saat haid) adalah diferensiator paling berharga.
- **Pendekatan gamifikasi** cocok untuk persona siswi SMP.

### Kekurangan / Sudah Ditangani
1. **Notifikasi belum konkret.** PWA di iOS Safari punya batasan Web Push yang signifikan. → [10-notifikasi.md](10-notifikasi.md).
2. **Strategi sinkronisasi offline → online belum dirinci.** Idempotency, outbox pattern. → [11-offline-sync.md](11-offline-sync.md).
3. **Skema database minim metadata.** Tidak ada `createdAt/updatedAt`, indeks, soft-delete. → [02-database.md](02-database.md).
4. **Privasi & consent** data kesehatan remaja. → [03-auth-onboarding.md](03-auth-onboarding.md).
5. **Next.js 16 (Cache Components).** `AGENTS.md` memperingatkan API berbeda — disiplin `use cache`, `cacheTag`, `updateTag`. → [01-arsitektur.md](01-arsitektur.md).
6. **Definisi "haid selesai".** Cap maksimal 10 hari + auto-close. → [05-period-tracker.md](05-period-tracker.md).
7. **Strategi pengujian.** Unit test mesin SMA wajib. → [15-timeline.md](15-timeline.md).
8. **Identitas visual** tidak disebut di plan awal — diperinci di [12-tema.md](12-tema.md).

### Penyesuaian dari Permintaan User
- **Tidak ada role admin** — `inventory_ttd` ditambah sendiri oleh siswi saat menerima pil baru (dari sekolah/UKS sebagai sumber eksternal, tapi tidak terkait sistem). Collection `inventory_requests` dan `audit_log` dihapus dari skema.
- **Tema retro pink (neo-brutalism)** sebagai identitas utama — palet, border/shadow signature, override komponen shadcn didokumentasikan.

### Risiko Utama
- **PWA di iOS** terbatas (Web Push baru penuh di iOS 16.4+, harus "Add to Home Screen"). Fokuskan testing di Android.
- **Akurasi SMA** rendah untuk siklus tidak teratur (umum pada remaja awal). Tampilkan rentang prediksi, bukan tanggal pasti.
- **Stok TTD self-managed** — siswi bisa lupa update; tampilkan reminder lembut bulanan "Stok TTD-mu masih akurat?".

### Verdict
Planning awal **valid sebagai visi produk**. Setelah dipecah jadi dokumen per fitur, disederhanakan jadi single-user, dan ditambah tema pink, plan ini siap dijadikan brief implementasi untuk memulai Fase 1.
