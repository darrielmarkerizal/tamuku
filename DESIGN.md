# Tamuku — Design Brief untuk Stitch

> Single-user PWA mobile-first untuk siswi SMP: pelacak menstruasi + Tablet Tambah Darah (TTD). Konteks: program KKN Sepaku, Penajam Paser Utara. Gaya visual **retro / neo-brutalism** dengan palet **pink hangat**.

## 1. Brand Voice & Mood

- Hangat, ramah, jauh dari kesan klinis/medis.
- Berani, tegas, terasa seperti "stiker di buku tulis" — bukan dashboard rumah sakit.
- Personal: gunakan sapaan "kamu", hindari istilah klinis tanpa penjelasan.
- Bahasa: **Bahasa Indonesia** untuk semua copy.

## 2. Visual Language — Neo-Brutalism

Setiap elemen interaktif (button, card, input) wajib:
- **Border 2px solid `#1a0a14`** (near-black warm, bukan hitam mati).
- **Hard drop shadow `4px 4px 0 0 #1a0a14`** — tidak ada blur, offset tegas.
- **Sudut tumpul 8–12px** (bukan pill, bukan runcing).
- **Press effect**: hover translate `(1px,1px)` shadow shrink, active translate `(4px,4px)` shadow hilang.
- **Tanpa gradient kompleks** — solid color blocks ala stiker.

## 3. Color Palette

| Token | Hex | Pemakaian |
|-------|-----|-----------|
| `ink` | `#1a0a14` | Border, teks utama, shadow |
| `bg` | `#fff0f5` | Background app (cream-pink) |
| `surface` | `#ffffff` | Card, modal |
| `primary` | `#ff3d8a` | Tombol utama, FAB, link aktif |
| `primary-strong` | `#d11c63` | Pressed state |
| `pink-soft` | `#ffd1e3` | Highlight kalender, chip aktif |
| `pink-cream` | `#ffe4ec` | Section background sekunder |
| `accent-yellow` | `#ffd66b` | Badge, streak chip, edukasi callout |
| `accent-mint` | `#9ae6c4` | Success, badge tercapai |
| `accent-peach` | `#ffb088` | Aksen warm sekunder |
| `period` | `#e11d48` | Hari haid tercatat di kalender |
| `prediction` | `#ff8fb6` | Prediksi haid (border-dashed) |
| `text-muted` | `#6b3a4c` | Teks sekunder |
| `danger` | `#dc2626` | Error |

**Light mode only** (dark mode opsional fase 2).

## 4. Typography

- **Display / Heading:** **Plus Jakarta Sans** weight 800, tracking-tight, untuk h1/h2, judul card, label tombol besar.
- **Body:** **Space Grotesk** weight 400/500, untuk paragraf, label form, teks list.
- Maksimal 2 font family.
- Ukuran minimal 15px di mobile.
- Heading **tidak italic**, **tidak ALL CAPS** kecuali label tombol & chip.

## 5. Shape & Spacing

- **Border radius:**
  - Tombol & input: `8px`
  - Card: `12px`
  - Chip: `9999px` (pill — pengecualian, lebih playful)
- **Spacing skala 4px:** `4, 8, 12, 16, 24, 32`.
- **Container mobile:** padding kiri-kanan `16px`, antar-card `16px`.

## 6. Iconography

- **Lucide Icons**, stroke `2.5px` (lebih tebal dari default agar match border tebal).
- Warna: `ink` default; di tombol primary → putih.
- Hindari ikon outline tipis.

## 7. Komponen Inti

### Button (primary)
```
bg #ff3d8a, text #1a0a14, border 2px #1a0a14, radius 8px,
shadow 4px 4px 0 0 #1a0a14, font Plus Jakarta Sans 800 uppercase
press: translate(4px,4px) shadow none
```

### Button (secondary)
```
bg #ffd66b (yellow), sisanya sama
```

### Card
```
bg #ffffff, border 2px #1a0a14, radius 12px, shadow 6px 6px 0 0 #1a0a14,
padding 16px
```

### Input
```
bg #ffffff, border 2px #1a0a14, radius 8px, shadow 2px 2px 0 0 #1a0a14,
focus: shadow 4px 4px 0 0 #ff3d8a
```

### Badge / Chip
```
border 2px #1a0a14, radius pill, padding 4px 12px,
font Plus Jakarta Sans 800 uppercase 12px
variants: bg accent-yellow / accent-mint / pink-soft / primary
```

### Bottom Nav
```
bg #ffffff, border-top 2px #1a0a14, 4 ikon (Beranda, Kalender, Edukasi, Profil)
item aktif: ikon dalam lingkaran pink-soft border ink shadow-sm
label uppercase 10px Plus Jakarta Sans
```

### Modal / Sheet
```
backdrop: #1a0a14 opacity 40%
panel: card retro shadow 6px 6px 0 0 ink, slide-up dari bawah
```

## 8. Maskot — "Hemo"

Karakter sel darah merah, **outline ink 3px solid**, fill pink.

State berdasar kepatuhan TTD 14 hari terakhir:
- `vibrant` (≥90%): fill `primary`, mata berkilau, kotak shadow di belakang.
- `cheerful` (70–89%): fill `prediction`, senyum normal.
- `tired` (40–69%): fill `pink-soft`, mata setengah tutup.
- `pucat` (<40%): fill `pink-cream`, mata bertanda silang kecil.

Frame maskot: card retro bg `accent-yellow` dengan shadow-lg.
Animasi idle: bobbing 1.6s ease-in-out infinite (translateY ±3px).

## 9. Daftar Screen (14 halaman)

### Auth (3)
1. **Login** — username + password, link "Daftar" dan "Lupa password".
2. **Register** — username, nama, sekolah, kelas, password, checkbox consent.
3. **Onboarding** — 4 langkah wizard: kenalan maskot → tanggal haid terakhir (opsional) → stok TTD awal → set pengingat & izin notifikasi.

### Inti / Bottom Nav (4)
4. **Dashboard** (`/dashboard`) — header sapaan, card status hari ini, tombol "Haid Dimulai/Selesai", card TTD (mode mingguan/menstruasi), card maskot, streak chip 🔥, bottom nav.
5. **Kalender** (`/kalender`) — kalender bulanan color-coded: hari haid (merah period), prediksi (pink prediction border-dashed), hari ini (ring primary). Swipe ganti bulan.
6. **Edukasi** (`/edukasi`) — grid 4 kategori flashcard: Manfaat TTD, Makanan Penambah Darah, Mitos & Fakta Haid, Kebersihan Haid. Filter "Belum dibaca / Semua".
7. **Profil** (`/profil`) — maskot besar dalam frame yellow, stat ringkas (streak, % kepatuhan), grid koleksi badge (raih = berwarna, belum = silhouette), tombol Edit profil/Logout.

### TTD (3)
8. **TTD Ringkasan** (`/ttd`) — card stok sekarang, jadwal pengingat aktif, heatmap 30 hari (kotak retro), tombol "Tambah Stok".
9. **TTD Riwayat** (`/ttd/riwayat`) — daftar log konsumsi + adjustment stok, kronologis.
10. **Tambah Stok TTD** (`/ttd/tambah-stok`) — sheet dengan input angka pil, shortcut +4/+10/+30, catatan opsional.

### Kalender Lanjutan (1)
11. **Catat Haid Manual** (`/kalender/log`) — modal/sheet dengan date range picker untuk back-fill siklus historis.

### Jurnal (2)
12. **Jurnal List** (`/jurnal`) — daftar entry 14 hari terakhir, kartu per hari dengan emoji mood + chip gejala.
13. **Jurnal Hari Ini / Detail** (`/jurnal/today`) — grid emoji mood (6 pilihan), multi-select chip gejala (6 pilihan), text area note 280 char.

### Sistem (1)
14. **Offline** (`/offline`) — maskot pucat, pesan "Kamu sedang offline, tapi tenang — log kamu tetap tersimpan."

## 10. Pop-up Edukasi (overlay, bukan halaman)

Muncul setelah user log TTD. Modal full-screen mobile:
- Judul singkat (1 baris).
- Paragraf ≤ 60 kata.
- 1 SVG ilustrasi sederhana opsional.
- Swipe untuk kartu berikutnya (max 3), atau tombol "Mengerti" untuk tutup.

## 11. Layout & Hirarki

- **Mobile-first**, target viewport `360px` ke atas.
- **Bottom nav fixed** 64px tinggi di semua halaman utama.
- **Header tipis** 56px dengan sapaan + ikon notifikasi (tidak di onboarding/login).
- **Safe area** untuk PWA standalone: padding bottom tambahan saat ada bottom nav.

## 12. Aksesibilitas

- Kontras teks `ink` di `bg` ≥ 7:1 (AAA ✓).
- Border tebal hitam membantu low-vision.
- Status jangan andalkan warna saja — selalu ikon + label pendamping.
- Focus ring: shadow retro warna `primary` (sudah jelas, tidak perlu outline tambahan).
- Touch target minimal `44×44px`.

## 13. Don'ts

- ❌ Border tipis 1px atau abu-abu.
- ❌ Drop shadow blur (`shadow-md` Tailwind default).
- ❌ Border radius full (pill) untuk tombol — pakai 8–12px.
- ❌ Gradien kompleks — solid color blocks.
- ❌ Neon pink menyala (`#ff00aa`) — terlalu menyilaukan malam hari.
- ❌ Lebih dari 3 warna aksen dalam satu layar.
- ❌ Bahasa medis tanpa penjelasan (mis. "menstrual flow intensity").
