# 13 — API & Server Actions

Default: **Server Actions** untuk semua mutasi. Route Handlers hanya untuk: sync (dipanggil service worker), cron, dan push subscribe.

## Server Actions
File `src/app/(app)/_actions.ts`:
- `startPeriod()`
- `endPeriod()`
- `manualLogPeriod({ start, end })`
- `deletePeriodLog(id)`
- `logTtd({ date? })` — default today
- `addStock({ pills, note? })` — tambah inventory_ttd
- `correctStock({ newValue, note })` — set absolut + tulis adjustment delta
- `upsertJournal({ date, mood, symptoms, note })`
- `completeOnboarding(payload)`
- `updateReminderPrefs({ day, time, channels })`
- `updateProfile({ name, school, classroom })`
- `deleteAccount()` — soft delete + hapus push subscription

Semua action:
- Validasi Zod.
- `requireSession()` helper di awal.
- `revalidatePath` atau `updateTag` setelah sukses.
- Return `{ ok: true, data? } | { ok: false, code, message }`.

## Route Handlers
| Path | Method | Tujuan |
|------|--------|--------|
| `/api/sync/snapshot` | GET | Hydration awal (semua data user) |
| `/api/sync/batch` | POST | Outbox flush dari service worker |
| `/api/push/subscribe` | POST | Daftarkan push subscription |
| `/api/push/unsubscribe` | POST | Hapus subscription |
| `/api/cron/reminders` | GET | Vercel Cron — kirim push harian |
| `/api/cron/badges` | GET | Vercel Cron — evaluasi badge retroaktif |
| `/api/cron/auto-close` | GET | Vercel Cron — auto-close haid lama |
| `/api/cron/stock-check` | GET | Vercel Cron — reminder cek stok bulanan |
| `/api/health` | GET | Uptime check |

Cron endpoint dilindungi header `Authorization: Bearer ${CRON_SECRET}`.

## Format Error
```json
{ "ok": false, "code": "PERIOD_OPEN_EXISTS", "message": "Masih ada catatan haid yang belum ditutup." }
```

Kode error sentralisasi di `src/lib/errors.ts`.

## Rate Limiting
- `/api/sync/batch` dan login: 30 req/menit per IP.
- Pakai upstash/ratelimit atau in-memory bucket sederhana untuk MVP.
