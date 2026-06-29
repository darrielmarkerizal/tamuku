# 02 — Skema Database (MongoDB)

Single-user app: tidak ada role/admin. Setiap user mengelola data dirinya sendiri, termasuk stok TTD. Diperbarui dari versi awal dengan timestamps, indeks, dan soft-delete.

## `users`
```ts
{
  _id: ObjectId
  username: string          // unik, lowercase
  name: string
  email?: string            // opsional
  passwordHash: string
  school?: string           // opsional, informatif
  classroom?: string
  birthDate?: Date          // opsional, untuk konteks usia (tidak dipakai prediksi)
  inventory_ttd: number     // sisa pil — diisi/diupdate sendiri oleh user
  badges: string[]          // slug badge
  streak: { current: number, longest: number, lastWeekIso: string }
  reminderPrefs: {
    weeklyDay: 0|1|2|3|4|5|6   // 5 = Jumat default
    time: string                // "19:00" WITA
    pushEnabled: boolean
  }
  consent: {
    acceptedAt: Date
    guardianAware: boolean
  }
  seenFlashcards: string[]  // id flashcard yang sudah ditampilkan
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date          // soft delete
}
```
Indeks: `{ username: 1 } unique`.

## `menstruation_logs`
```ts
{
  _id: ObjectId
  userId: ObjectId
  start_date: Date
  end_date: Date | null     // null = sedang berlangsung
  cycle_length?: number     // selisih hari ke start sebelumnya, dihitung saat siklus baru
  period_length?: number    // end - start
  source: 'manual' | 'auto_close'
  createdAt: Date
  updatedAt: Date
}
```
Indeks: `{ userId: 1, start_date: -1 }`.

Invariant: maksimal **satu** log dengan `end_date = null` per user.

## `ttd_logs`
```ts
{
  _id: ObjectId
  userId: ObjectId
  consumed_date: Date       // tanggal lokal WITA
  status: 'weekly_routine' | 'menstruation_routine'
  flashcardShownId?: string
  createdAt: Date
}
```
Indeks: `{ userId: 1, consumed_date: -1 }`. Unique partial `{ userId: 1, consumed_date: 1 }` mencegah double-log.

## `journal_entries`
```ts
{
  _id: ObjectId
  userId: ObjectId
  date: Date                // tanggal lokal
  mood: 'happy'|'calm'|'sad'|'angry'|'tired'|'anxious'
  symptoms: ('cramp'|'headache'|'bloating'|'acne'|'fatigue'|'backpain')[]
  note?: string             // max 280 char, plain text
  createdAt: Date
  updatedAt: Date
}
```
Unique `{ userId: 1, date: 1 }`.

## `inventory_adjustments`
Histori perubahan stok TTD (self-managed). Berguna untuk audit pribadi dan koreksi.
```ts
{
  _id: ObjectId
  userId: ObjectId
  delta: number             // +N saat menambah, -1 saat log TTD
  reason: 'consumed' | 'received' | 'correction'
  note?: string             // mis. "Dapat 1 strip dari UKS"
  createdAt: Date
}
```
Indeks: `{ userId: 1, createdAt: -1 }`.

## `idempotency_keys` (untuk sync)
```ts
{
  _id: string               // UUID dari client
  userId: ObjectId
  createdAt: Date           // TTL 30 hari
}
```
TTL index: `{ createdAt: 1 }` expireAfterSeconds 2592000.

## Catatan
- **Dihapus dari plan awal:** `inventory_requests`, `audit_log` (tidak relevan tanpa admin).
- **Tidak ada field `role`** — semua user adalah siswi.
- Seed: cukup file `src/content/flashcards.ts` dan `src/lib/badges.ts` (in-code, bukan collection).
