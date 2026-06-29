# 07 — Gamifikasi (`/profil`)

Mesin retensi: maskot, streak, badge. Dievaluasi di server agar tidak bisa dimanipulasi via client.

## Maskot Virtual
- Karakter sel darah merah (nama: "Hemo"? — tentukan dengan Lead Edukasi).
- State berdasarkan skor kepatuhan 14 hari terakhir:
  - `vibrant`: ≥ 90% target TTD diminum.
  - `cheerful`: 70–89%.
  - `tired`: 40–69%.
  - `pucat`: < 40%.
- Asset: 4 SVG statis + animasi CSS sederhana (idle bobbing).
- Render: client component kecil, state dihitung di server lalu dipass sebagai prop.

## Streak
- 1 streak = 1 minggu di mana semua target TTD terpenuhi.
- Disimpan di `users.streak`.
- Reset jika ada minggu terlewat. Tampilkan animasi api 🔥 pada chip.
- Hari pertama minggu = Senin WITA.

## Badge — Retroaktif
File: `src/lib/badges.ts` + cron harian.

### Katalog Badge MVP
| Slug | Nama | Kriteria |
|------|------|----------|
| `iron_girl` | Iron Girl | 4 minggu berturut TTD mingguan tidak terlewat |
| `cycle_sync` | Cycle Sync | 3 siklus tercatat lengkap (start + end) |
| `journal_keeper` | Penulis Setia | 14 entry jurnal dalam 30 hari |
| `comeback` | Bangkit Kembali | Setelah miss minggu, kembali patuh 2 minggu |
| `first_step` | Langkah Awal | TTD pertama tercatat |

### Evaluasi
- Cron harian 06.10 WITA melewati semua user aktif (login dalam 30 hari terakhir), evaluasi fungsi tiap badge.
- Tambahkan ke `users.badges` jika kriteria terpenuhi dan belum ada.
- Trigger Web Push: "Kamu dapat lencana Iron Girl! 🏅".
- Idempotent: re-run aman karena set check.

## Halaman `/profil`
- Maskot besar di atas.
- Stat ringkas: streak, hari aktif, % kepatuhan 30 hari.
- Grid badge — yang sudah diraih berwarna, yang belum: silhouette dengan kriteria tooltip.
- Tombol "Edit profil", "Logout", "Ekspor data" (lihat [12-admin-uks.md](12-admin-uks.md) untuk admin parity).

## Server Actions
- `getProfileSnapshot(userId)` — pure read, cached, tag `user:${id}:profile`.

## Catatan
- Hindari leaderboard antar siswi — bisa jadi sensitif untuk topik haid. Gamifikasi tetap personal.
