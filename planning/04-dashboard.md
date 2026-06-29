# 04 — Halaman Dashboard (`/dashboard`)

Halaman utama setelah login. Mobile-first, satu kolom, scrollable. Semua aksi penting dapat dijangkau tanpa scroll panjang.

## Susunan (dari atas ke bawah)
1. **Header tipis** — sapaan ("Halo, Nisa 👋"), ikon profil di kanan, ikon notifikasi.
2. **Card Status Hari Ini** — pesan kontekstual:
   - Sedang haid: "Hari ke-3 haid kamu — ingat minum TTD ya!"
   - Prediksi mendekat: "Perkiraan haid 4 hari lagi (±2 hari)."
   - Normal: "Siklus kamu lagi tenang."
3. **Tombol One-Click Logging Haid**
   - Jika tidak sedang haid: tombol besar **"Haid Dimulai"**.
   - Jika sedang haid: tombol **"Haid Selesai"** + indikator hari ke-N.
4. **Card TTD Hari Ini**
   - Mode mingguan: hanya tampil di hari pengingat (mis. Jumat), tombol "Log Minum TTD".
   - Mode menstruasi: tampil setiap hari, tombol "Sudah minum TTD hari ini".
   - Sisa stok di pojok ("Sisa: 6 pil").
5. **Maskot** — gambar maskot dengan state sesuai kepatuhan; tap → ke `/profil` halaman koleksi badge.
6. **Card Jurnal Cepat** — emoji mood + chip gejala; tap → `/jurnal/today`.
7. **Streak chip** — "🔥 3 minggu berturut-turut".
8. **Bottom nav** — Beranda, Kalender, Edukasi, Profil.

## Aturan Render
- Server Component shell, dengan Suspense untuk:
  - `<TodayStatusCard>` (butuh prediksi SMA → cached, tag `user:${id}:cycles`).
  - `<TtdTodayCard>` (live, tidak cached).
  - `<MascotState>` (cached, tag `user:${id}:adherence`).
- Tombol Logging adalah Client Component yang memanggil Server Action; on success → `revalidatePath('/dashboard')` + `updateTag`.

## Edge Cases
- User belum punya log apapun → status: "Kamu belum mencatat siklus. Tekan tombol Haid Dimulai saat haid ya."
- Inventory ≤ 1 → tampilkan banner kuning di atas status: "Stok TTD menipis. [Minta stok]" yang membuka modal request.
- Offline → semua card tampil dari IndexedDB; tombol logging menulis ke local queue (lihat [11-offline-sync.md](11-offline-sync.md)).

## Komponen
`StatusTodayCard`, `LogPeriodButton`, `TtdTodayCard`, `MascotState`, `JournalQuickCard`, `StreakChip`, `LowStockBanner`.
