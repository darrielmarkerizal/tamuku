# 05 — Period Tracker (`/kalender`)

## Halaman & Subhalaman
- `/kalender` — kalender bulanan utama.
- `/kalender/log` — modal/sheet untuk mencatat siklus secara manual (back-fill).
- `/kalender/[year]/[month]` — navigasi bulan tertentu (deep-linkable).

## Kalender
- View bulanan, satu kolom hari (mobile). Swipe kiri/kanan untuk ganti bulan.
- **Color coding:**
  - Merah pekat: hari haid tercatat.
  - Pink lembut + putus-putus: prediksi haid berikutnya.
  - Hijau muda: jendela subur estimasi (opsional, off-by-default karena audience SMP).
  - Abu-abu: hari biasa.
- Tap hari → bottom sheet: jurnal hari itu + opsi catat haid.

## One-Click Logging (di Dashboard)
- Tombol "Haid Dimulai" → buat `menstruation_log { start_date: today, end_date: null }`. Tolak jika sudah ada log open.
- Tombol "Haid Selesai" → set `end_date = today`, hitung `period_length`. Tampilkan konfirmasi singkat.

## Auto-Close
- Jika `start_date` lebih dari **10 hari** lalu dan `end_date` masih null → cron pagi mengisi `end_date = start_date + 7` dengan `source: 'auto_close'` dan kirim notifikasi: "Kami tutup catatan haidmu otomatis ya — kamu bisa edit di kalender."
- Tujuan: hindari `cycle_length` rusak gara-gara user lupa menekan selesai.

## Mesin Prediksi SMA
File: `src/lib/sma/`.

Logika:
1. Ambil siklus tercatat user, urutkan menaik.
2. Hitung `cycle_length` antar `start_date` berturut-turut.
3. Jika ada < 1 siklus penuh → pakai default 28 hari.
4. Jika ada 1–2 siklus → rata-ratakan apa yang ada.
5. Jika ada ≥ 3 siklus → SMA dari 3 terakhir.
6. Clamp hasil ke rentang [21, 45] hari (di luar itu, fallback default + tampilkan peringatan "siklus belum stabil, ini wajar di usia remaja").

Output: `{ predictedStart: Date, confidence: 'low'|'medium'|'high', range: [Date, Date] }`. UI tampilkan rentang, **bukan** tanggal tunggal, kecuali confidence high.

`'use cache'` dengan `cacheTag('user:${id}:cycles')`. `updateTag` dipanggil di Server Action yang mencatat haid.

## Server Actions
- `startPeriod()` — validasi, insert log open, updateTag.
- `endPeriod()` — set end_date, hitung length, updateTag.
- `manualLogPeriod({ start, end })` — back-fill historis.
- `deletePeriodLog(id)` — soft delete, hanya log milik user.

## Edge Cases
- User mencoba mencatat dua haid bertumpuk → tolak, sarankan edit log existing.
- User mengedit start_date sehingga lebih lambat dari end_date → tolak.
- Timezone — semua tanggal disimpan sebagai `Date` UTC pada tengah malam WITA. Helper `lib/date/wita.ts`.

## Testing
- Unit test SMA dengan fixtures: < 3 siklus, ≥ 3 siklus, siklus liar (60 hari), siklus pendek (15 hari).
- Snapshot output range untuk regresi.
