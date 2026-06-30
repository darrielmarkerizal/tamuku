# Project Requirements Document (PRD): Sistem Pelacak Menstruasi & TTD Terintegrasi

## 1. Informasi Proyek

- **Fokus Proyek:** Digitalisasi pemantauan siklus menstruasi dan kepatuhan konsumsi Tablet Tambah Darah (TTD).
- **Target Implementasi:** Siswi Sekolah Menengah Pertama (SMP) pada program KKN Sepaku, Penajam Paser Utara.
- **Lead Developer / System Analyst:** Darriel Markerizal
- **Lead Edukasi & Distribusi Medis:** Nisa Fredlina Mahardika Saputri
- **Estimasi Waktu Pengembangan:** 1 hingga 2 Bulan
- **Platform:** Progressive Web App (PWA) Mobile-First

---

## 2. Latar Belakang & Pendekatan Masalah

Kepatuhan remaja putri dalam meminum Tablet Tambah Darah (TTD) seringkali rendah karena lupa jadwal yang bervariasi (mingguan vs harian saat menstruasi) dan kurangnya pemahaman edukasi. Aplikasi ini dibangun untuk menjembatani distribusi fisik TTD dengan _tracking_ digital harian melalui pendekatan gamifikasi, tanpa menggunakan antarmuka medis yang kaku.

Mengingat infrastruktur jaringan di kawasan Sepaku, Penajam Paser Utara yang mungkin masih fluktuatif, sistem mengadopsi pendekatan _offline-first_ menggunakan arsitektur PWA. Prediksi siklus tidak menggunakan AI/Machine Learning, melainkan logika deterministik _Simple Moving Average_ (SMA) yang ringan dan berstandar medis (ACOG - _American College of Obstetricians and Gynecologists_).

---

## 3. Spesifikasi Fitur Utama (Core Features)

### A. Modul Period Tracker (Pelacak Haid)

- **Kalender Pintar (Color-Coded):** Visualisasi siklus dengan warna pastel (Merah/Pink untuk masa haid, putus-putus untuk prediksi).
- **One-Click Logging:** Tombol "Haid Dimulai" dan "Haid Selesai" di _dashboard_ utama tanpa perlu navigasi kalender yang rumit.
- **Mesin Prediksi SMA:** Menggunakan rata-rata 3 siklus terakhir (atau standar _default_ 28 hari) untuk memprediksi tanggal haid bulan berikutnya dengan akurasi tinggi.
- **Jurnal Visual:** Pencatatan _mood_ dan gejala fisik harian menggunakan representasi emoji.

### B. Modul TTD Tracker (Logika Dinamis)

- **Dynamic Reminders:**
  - Kondisi Normal: Pengingat 1x seminggu (misal: setiap Jumat).
  - Kondisi Menstruasi: Pengingat otomatis berubah menjadi setiap hari selama masa haid aktif.
- **Inventory Tracker:** Menampilkan sisa pil TTD yang dimiliki _user_ dan memberikan notifikasi untuk meminta suplai baru ke tim KKN/UKS jika stok menipis (sisa < 2 pil).
- **Bite-Sized Education:** _Pop-up flashcard_ berisi informasi manfaat TTD, anjuran makanan penambah darah, dan aturan minum yang muncul sesaat setelah menekan tombol "Log Minum TTD".

### C. Modul Gamifikasi (Retention Engine)

- **Virtual Health Mascot:** Maskot digital (misal: karakter sel darah) yang berevolusi atau berubah _state_ (sehat/pucat) berdasarkan kepatuhan minum TTD dan kelengkapan jurnal.
- **Streak Indicator:** Penanda beruntun (api/🔥) untuk rutinitas mingguan yang tidak terputus.
- **Retroactive Auto-Assign Badge System:** Evaluasi historis di _background_ untuk memberikan lencana pencapaian (_Iron Girl_, _Cycle Sync_) jika _user_ memenuhi kriteria pencapaian tertentu secara otomatis saat data tersinkronisasi ke _server_.

---

## 4. Arsitektur Teknis & Tech Stack

Sistem dibangun menggunakan arsitektur modern berbasisi _JavaScript/TypeScript Ecosystem_ secara penuh, menyatukan _frontend_ dan _backend_ dalam satu _repository_ (_monorepo_).

### Fullstack Framework (Frontend & Backend)

- **Framework:** Next.js (App Router disarankan untuk performa optimal)
- **Bahasa:** TypeScript
- **Styling:** Tailwind CSS
- **Arsitektur Client:** Progressive Web App (PWA) dengan integrasi _Service Worker_ (menggunakan `next-pwa`).
- **Local Storage:** Menggunakan `IndexedDB` (bisa dibantu _library_ seperti `Dexie.js`) untuk menyimpan log harian dan prediksi sementara saat _offline_.
- **API & Logic Engine:** Menggunakan **Next.js Route Handlers** (`app/api/...`) atau **Server Actions** untuk mengeksekusi logika _Simple Moving Average_ (SMA) dan aturan _Dynamic Reminders_ TTD.
- **Background Tasks:** Menggunakan _Cron Jobs_ (misal: Vercel Cron) atau _trigger_ asinkron pada API Route untuk memproses _Retroactive Badge System_ agar tidak menghalangi UI _thread_.

---

## 5. Struktur Database Ringkas (PostgreSQL Relational)

Menggunakan pendekatan relasional (SQL) dengan PostgreSQL dan Prisma ORM. Skema dirancang untuk menjaga integritas data antar pengguna dan log (referential integrity) agar pelaporan dan _query_ analitik menjadi lebih akurat.

1. **Table `users`**
   - `id` (UUID, Primary Key)
   - `name`, `username`, `password`
   - `inventory_ttd` (Int) - Menyimpan sisa pil yang dimiliki.
   - `badges` (JSON/String array) - Pencapaian _badge_ (bisa juga tabel terpisah, tapi JSON array lebih praktis untuk pembacaan profil yang cepat).

2. **Table `menstruation_logs`**
   - `id` (UUID, Primary Key)
   - `userId` (UUID, Foreign Key ke `users`)
   - `start_date` (DateTime)
   - `end_date` (DateTime, nullable)
   - `cycle_length` (Int) - Dikalkulasi otomatis saat siklus baru dicatat untuk keperluan SMA.

3. **Table `ttd_logs`**
   - `id` (UUID, Primary Key)
   - `userId` (UUID, Foreign Key ke `users`)
   - `consumed_date` (DateTime)
   - `status` (Enum/String: 'weekly_routine', 'menstruation_routine', 'stock_added')

---

## 6. Fase Pengembangan (Timeline 1 - 2 Bulan)

- **Fase 1 (Minggu 1-2): Setup & Kerangka Dasar**
  - Inisialisasi proyek Next.js dengan TypeScript dan Tailwind CSS.
  - Konfigurasi PWA _manifest_ dan _service worker_.
  - Setup PostgreSQL Database (misal: Supabase/Neon/Lokal) dan inisialisasi Prisma ORM.
  - Pembuatan UI/UX dasar untuk _Dashboard_.
- **Fase 2 (Minggu 3-4): Logika Core & API Routes**
  - Implementasi _IndexedDB_ untuk penyimpanan lokal (_offline mode_).
  - Pembuatan _Next.js API Routes_ untuk sinkronisasi _offline-to-online_.
  - Implementasi logika _Simple Moving Average_ di sisi _server/API_.
  - Integrasi tombol logika _Dynamic Reminders_ TTD.
- **Fase 3 (Minggu 5-6): Gamifikasi & Integrasi Penuh**
  - Pengembangan logika _Retroactive Auto-Assign Badge System_ melalui pemicu API sinkronisasi.
  - Integrasi visual maskot pada _Frontend_ dan penyempurnaan UI _bite-sized education_.
- **Fase 4 (Minggu 7-8): Pengujian & Deployment**
  - Pengujian sinkronisasi data dari keadaan _offline_ (tanpa sinyal) ke _online_.
  - Deployment aplikasi (direkomendasikan di Vercel atau _server node_ mandiri).
  - Peluncuran dan transisi penggunaan di SMP target wilayah Sepaku.
