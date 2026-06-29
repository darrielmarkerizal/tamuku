# 09 — Edukasi (`/edukasi`)

## Tujuan
Pengetahuan ringan, mudah dicerna, muncul di momen relevan — terutama setelah log TTD agar terbentuk asosiasi positif.

## Bentuk Konten
- **Flashcard:** 1 judul + 1 paragraf ≤ 60 kata + opsional 1 gambar SVG.
- Kategori: `manfaat_ttd`, `makanan_penambah_darah`, `mitos_fakta_haid`, `kebersihan_haid`.
- Disimpan di kode (`src/content/flashcards.ts`) bukan DB — konten kurasi Lead Edukasi, di-review per rilis.

## Pop-up Setelah Log TTD
- Setelah Server Action `logTtd` sukses, pilih 1 flashcard acak (weighted: prioritas yang belum pernah dilihat user, fallback acak).
- Tampilkan sebagai modal full-screen mobile yang bisa di-swipe untuk lihat kartu berikutnya (maksimal 3 kartu lalu auto-close).
- Track di IndexedDB `seenFlashcards` (sync ke `users.seenFlashcards: string[]`).

## Halaman `/edukasi`
- Grid kartu kategori. Tap → daftar flashcard di kategori itu.
- Bookmark opsional (fase 2).
- Filter "Belum dibaca" / "Semua".

## Aksesibilitas & Bahasa
- Bahasa: santai, sapaan "kamu", hindari istilah klinis tanpa penjelasan.
- Validasi konten oleh Nisa Fredlina (Lead Edukasi) sebelum merge.
- Font scaleable, kontras AA.

## Komponen
`FlashcardModal`, `FlashcardDeck`, `CategoryGrid`, `FlashcardListItem`.
