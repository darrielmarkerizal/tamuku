# 08 — Jurnal (`/jurnal`)

## Halaman
- `/jurnal` — list entry 14 hari terakhir, scroll ke bawah untuk lebih lama.
- `/jurnal/[date]` — entry harian (edit/buat baru).
- `/jurnal/today` — shortcut ke entry hari ini.

## Bentuk Entry
- **Mood** — satu pilih dari grid emoji: 😀 senang, 😌 tenang, 😢 sedih, 😠 kesal, 😩 lelah, 😟 cemas.
- **Gejala** — multi-select chip: kram, sakit kepala, kembung, jerawat, lemas, sakit pinggang.
- **Catatan** — opsional, max 280 karakter, plain text.

## UX
- Single bottom sheet pada `/jurnal/today` agar 2 detik selesai input.
- Auto-save on change (debounce 500ms) → Server Action `upsertJournal({ date, mood, symptoms, note })`.
- Tidak ada delete; user bisa kosongkan semua field → entry akan dianggap kosong tapi tidak dihapus (audit).

## Visualisasi
- Halaman list: kartu per hari menampilkan emoji + chip gejala kecil.
- Heatmap mood bulanan opsional di `/kalender` (fase 2).

## Privasi
- Note plain text — di-trim, tidak diizinkan HTML.
- Semua data jurnal sepenuhnya milik user, tidak ada akses pihak ketiga.

## Komponen
`MoodGrid`, `SymptomChips`, `JournalNoteInput`, `JournalDayCard`.

## Server Actions
- `upsertJournal({ date, mood, symptoms, note })` — unique per date.
- `getJournalRange({ from, to })` — read, cached, tag `user:${id}:journal`.
