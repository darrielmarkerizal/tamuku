# 10 — Notifikasi

## Strategi Berlapis
1. **Web Push (utama)** — Android Chrome, desktop. Pakai VAPID, library `web-push` di server.
2. **Local Notification via Service Worker** — fallback bila push gagal terdaftar.
3. **In-app banner** — fallback terakhir saat user membuka app.

iOS Safari: Web Push hanya jalan jika PWA "Add to Home Screen" + iOS 16.4+. Dokumentasikan di onboarding sebagai "Buka di Safari → Bagikan → Tambah ke Layar Awal".

## Jenis Notifikasi
| Jenis | Pemicu | Jam |
|-------|--------|-----|
| TTD reminder mingguan | Hari pengingat user, bukan saat haid | 19:00 WITA default |
| TTD reminder harian | Saat sedang haid aktif | 19:00 WITA |
| Prediksi haid mendekat | 2 hari sebelum prediksi | 09:00 WITA |
| Auto-close haid | Cron menutup log haid yang terlupa | 06:00 WITA |
| Badge baru | Setelah cron badge | 06:10 WITA |
| Stok menipis | Sisa ≤ 1 setelah log TTD | Realtime |
| Cek stok bulanan | Tanggal 1 tiap bulan | 19:00 WITA |

## Implementasi
- **Endpoint subscribe**: `POST /api/push/subscribe` simpan `pushSubscription` di sub-collection `users.pushSubscriptions[]`.
- **Worker server**: Vercel Cron memanggil `/api/cron/send-reminders` yang query target user dan kirim push.
- **Quiet hours**: Tidak kirim sebelum 06.00 atau setelah 21.00 WITA.
- **Preferensi user**: di `/profil/notifikasi` user bisa atur jam pengingat dan toggle kategori.

## Payload
```json
{
  "title": "Saatnya minum TTD! 💪",
  "body": "Jangan lupa minum TTD-mu hari ini ya.",
  "url": "/dashboard",
  "tag": "ttd-daily"  // sehingga notifikasi sebelumnya tergantikan
}
```

## Permission Flow
- Diminta di langkah 4 onboarding, bukan saat load pertama.
- Jika ditolak: tampilkan banner ringan di `/profil` untuk mengaktifkan ulang.

## Catatan
- Tidak ada SMS / WhatsApp di MVP — biaya gateway tidak masuk anggaran KKN.
- Audit kirim notifikasi disimpan di collection `notification_log` (opsional fase 2) untuk debug.
