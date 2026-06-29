# 11 — Offline & Sinkronisasi

## Prinsip
- **Read offline:** semua data user (siklus, log TTD, jurnal 30 hari) di-mirror ke IndexedDB sehingga UI tetap responsif tanpa jaringan.
- **Write offline:** mutasi masuk ke antrian, di-flush saat online.
- **Server adalah source of truth.** Konflik diselesaikan dengan strategi last-write-wins dengan timestamp client, kecuali unique constraint.

## Skema IndexedDB (Dexie)
```ts
db.version(1).stores({
  users: 'id',
  menstruation_logs: 'id, userId, start_date',
  ttd_logs: 'id, userId, consumed_date',
  journal_entries: 'id, userId, date',
  flashcards_seen: 'id',
  outbox: '++localId, type, createdAt, status', // antrian mutasi
})
```

## Outbox Pattern
Setiap mutasi UI:
1. Tulis optimistik ke store lokal dengan `id` lokal (UUID v7).
2. Tambah entry `outbox` `{ type: 'logTtd', payload, status: 'pending' }`.
3. Jika online: panggil Server Action; jika sukses, ganti `id` lokal dengan `_id` server, hapus outbox entry.
4. Jika offline: tetap di outbox.

## Flush
- Dijalankan oleh:
  - Event `online` di window.
  - Service worker `sync` event (Background Sync API, fallback untuk Android Chrome).
  - Saat app dibuka di `/dashboard`.
- Urutan: FIFO berdasarkan `createdAt`.
- Tiap mutasi punya `idempotencyKey` (UUID dari client) — server cek collection `idempotency_keys` agar replay aman.

## Konflik & Error
- **Unique conflict** (mis. log TTD double untuk tanggal sama): server kembalikan 409 → client mark outbox entry resolved, sinkronkan record server.
- **Network error transient**: retry exponential backoff (1s, 5s, 30s, 2m, 10m). Setelah 5 gagal, masuk status `failed`, tampil di `/profil/sync` untuk debug manual.
- **Server validation error** (mis. start > end): mark `failed`, tampil notif di app saat user buka.

## API untuk Sync
`POST /api/sync/batch` — body: `{ ops: Operation[] }`, response: `{ results: { localId, status, serverId? }[] }`.

Operation:
```ts
type Operation =
  | { type: 'logTtd'; localId; payload; idempotencyKey }
  | { type: 'startPeriod'; ... }
  | { type: 'endPeriod'; ... }
  | { type: 'upsertJournal'; ... }
```

## Hydration Awal
- Saat login berhasil & online: `GET /api/sync/snapshot` — kembalikan semua data user yang relevan (siklus, log TTD 90 hari, jurnal 30 hari, profil).
- Disimpan ke IndexedDB; UI render dari local store untuk konsistensi.

## Service Worker
- Cache strategi:
  - App shell (HTML, JS, CSS): Cache First.
  - API GET: Network First dengan fallback cache 1 jam.
  - API POST: tidak di-cache, mengantri ke outbox jika offline.

## Testing
- Skenario "airplane mode": log haid, log TTD, jurnal, semua offline 30 menit, lalu online → semua tersinkronkan tanpa duplikat.
- Skenario dua device sama user (jarang, tapi mungkin di lab sekolah).
