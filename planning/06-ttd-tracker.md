# 06 — TTD Tracker (`/ttd`)

Single-user app: stok TTD dikelola sendiri oleh siswi. Tidak ada flow request ke admin.

## Halaman
- `/ttd` — ringkasan: stok saat ini, jadwal pengingat aktif, riwayat 30 hari (heatmap kecil), tombol tambah stok.
- `/ttd/riwayat` — daftar log lengkap (konsumsi + penyesuaian stok), paginated.
- `/ttd/tambah-stok` — sheet/dialog untuk menambah stok saat dapat pil baru (mis. dari UKS/sekolah).

## Logika Dynamic Reminder
File: `src/lib/ttd/schedule.ts`.

```
isMenstruationActive(userId, today):
  cari menstruation_log dengan start ≤ today ≤ (end ?? start + 10)
  return boolean

shouldRemindToday(userId, today, userPrefs):
  if isMenstruationActive(userId, today): return true   // harian
  if today.day_of_week == userPrefs.reminderDay: return true  // mingguan
  return false
```

Reminder dijalankan oleh:
- **Server cron** (Vercel Cron, 06.00 WITA) — kirim Web Push ke user yang `shouldRemindToday`.
- **Local scheduling** di service worker sebagai cadangan jika Web Push gagal terdaftar.

## One-Click Log
- Tombol "Sudah minum TTD hari ini" → Server Action `logTtd()`:
  - Tolak jika sudah ada log hari ini (unique index).
  - Kurangi `inventory_ttd` jika > 0; jika 0, tetap izinkan log tapi tampilkan banner "stok habis — ingat tambah stok ya".
  - Tulis `inventory_adjustments { delta: -1, reason: 'consumed' }`.
  - Status: `menstruation_routine` jika `isMenstruationActive` else `weekly_routine`.
  - Trigger flashcard edukasi acak ([09-edukasi.md](09-edukasi.md)).
  - Update streak.

## Inventory (Self-Managed)
- Field `inventory_ttd` di `users` ditambah/dikurangi sendiri oleh user.
- Sumber tambah: tombol "Tambah Stok" → Server Action `addStock({ pills, note? })`.
  - Tulis `inventory_adjustments { delta: +pills, reason: 'received', note }`.
  - Update `users.inventory_ttd`.
- Sumber kurang otomatis: setiap `logTtd` mengurangi 1.
- Koreksi manual: tombol "Atur ulang stok" → `correctStock({ newValue, note })` (untuk kasus salah hitung).
- Reminder bulanan lembut: "Stok TTD-mu masih akurat? Sekarang tertulis N pil." → biar self-managed tetap reliable.

## UX `/ttd/tambah-stok`
- Input angka pil (default 4 = 1 strip).
- Catatan opsional ("Dari UKS sekolah", "Beli sendiri di apotek").
- Tombol shortcut: +4, +10, +30 (umum dari distribusi UKS).

## Banner Stok Menipis
- Sisa ≤ 1: banner kuning di `/dashboard` dan `/ttd` dengan tombol "Tambah Stok".
- Sisa = 0: banner merah lembut, copy: "Stok TTD habis. Yuk tambah stok agar streak tetap aman."

## Komponen
`TtdSummaryCard`, `TtdLogButton`, `TtdHeatmap30d`, `AddStockSheet`, `StockBadge`, `LowStockBanner`.

## Edge Cases
- Double log per hari → unique constraint, UI tampilkan "sudah tercatat hari ini".
- User offline → log + adjustment masuk antrian sync ([11-offline-sync.md](11-offline-sync.md)).
- Stok bernilai negatif → tidak boleh, tolak di server.

## Testing
- Unit test `shouldRemindToday` dengan kombinasi: sedang haid, hari pengingat tepat, hari pengingat saat haid, di luar haid bukan hari pengingat.
- Unit test inventory math (add/subtract/correct) — harus konsisten dengan jumlah adjustments.
