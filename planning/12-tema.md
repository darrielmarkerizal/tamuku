# 12 — Tema & Design System (Retro Pink / Neo-Brutalism)

Gaya: **neo-brutalism ala [retroui.dev](https://www.retroui.dev/)** dengan palet **pink** sebagai warna identitas. Karakter utama: border tebal hitam, hard drop shadow tanpa blur, sudut sedikit tumpul (bukan pill), tipografi display chunky, press effect translate.

> Filosofi: berani, ramah remaja, jauh dari kesan klinis. Setiap card terasa seperti stiker yang menempel di buku tulis.

## 1. Palet Inti

| Token | Hex | Pemakaian |
|-------|-----|-----------|
| `--color-ink` | `#1a0a14` | **Border, teks utama, shadow** — near-black warm |
| `--color-bg` | `#fff0f5` | Background utama (cream-pink) |
| `--color-surface` | `#ffffff` | Card, modal, sheet |
| `--color-primary` | `#ff3d8a` | Tombol utama, FAB, link aktif |
| `--color-primary-strong` | `#d11c63` | Pressed state |
| `--color-pink-soft` | `#ffd1e3` | Highlight kalender, chip aktif, surface sekunder |
| `--color-pink-cream` | `#ffe4ec` | Section background pengganti |
| `--color-accent-yellow` | `#ffd66b` | Aksen badge, streak chip, callout edukasi |
| `--color-accent-mint` | `#9ae6c4` | Aksen success, badge tercapai |
| `--color-accent-peach` | `#ffb088` | Aksen sekunder warm |
| `--color-period` | `#e11d48` | Hari haid tercatat di kalender |
| `--color-prediction` | `#ff8fb6` | Prediksi haid (border-dashed) |
| `--color-text-muted` | `#6b3a4c` | Teks sekunder |
| `--color-danger` | `#dc2626` | Error |

Map ke Tailwind v4 (`src/app/globals.css`):
```css
@import "tailwindcss";

@theme {
  --color-ink: #1a0a14;
  --color-bg: #fff0f5;
  --color-surface: #ffffff;
  --color-primary: #ff3d8a;
  --color-primary-strong: #d11c63;
  --color-pink-soft: #ffd1e3;
  --color-pink-cream: #ffe4ec;
  --color-accent-yellow: #ffd66b;
  --color-accent-mint: #9ae6c4;
  --color-accent-peach: #ffb088;
  --color-period: #e11d48;
  --color-prediction: #ff8fb6;
  --color-text-muted: #6b3a4c;

  --radius-retro: 8px;
  --shadow-retro: 4px 4px 0 0 var(--color-ink);
  --shadow-retro-sm: 2px 2px 0 0 var(--color-ink);
  --shadow-retro-lg: 6px 6px 0 0 var(--color-ink);

  --font-display: "Archivo Black", sans-serif;
  --font-sans: "Space Grotesk", sans-serif;
}
```

## 2. Border & Shadow — Signature Style

**Aturan emas:** elemen interaktif/penting punya `border: 2px solid ink` + `shadow: 4px 4px 0 0 ink`. Tidak ada blur shadow, tidak ada border tipis.

```css
.retro-box {
  background: var(--color-surface);
  border: 2px solid var(--color-ink);
  border-radius: var(--radius-retro);  /* 8px, tegas tapi tidak runcing */
  box-shadow: var(--shadow-retro);
}
```

Press / active state: shadow mengecil → 0 + elemen translate ke kanan-bawah.
```css
.retro-pressable {
  transition: transform 80ms, box-shadow 80ms;
}
.retro-pressable:hover {
  transform: translate(1px, 1px);
  box-shadow: var(--shadow-retro-sm);
}
.retro-pressable:active {
  transform: translate(4px, 4px);
  box-shadow: 0 0 0 0 var(--color-ink);
}
```

## 3. Tipografi

- **Display / Heading:** **Archivo Black** (chunky, mirip poster retro). Pakai untuk h1/h2, judul card, label tombol besar.
- **Body:** **Space Grotesk** (geometric grotesque, jelas di mobile). Pakai untuk paragraf, label form, teks list.
- **Mono (opsional):** **JetBrains Mono** untuk angka stat (mis. "12 PIL").

Sumber: Google Fonts via `next/font/google` di `app/layout.tsx`.

Aturan:
- Heading: tracking sedikit ketat (`tracking-tight`), bukan italic.
- Body: weight 400/500, ukuran minimal 15px di mobile.
- Jangan campur lebih dari 2 font family.

## 4. Komponen — Override shadcn/ui

shadcn jadi base, lalu di-rebrand. Edit file komponen hasil `npx shadcn add`.

### Button
```tsx
// variants
default: "bg-primary text-ink border-2 border-ink rounded-[8px] shadow-[4px_4px_0_0_var(--color-ink)] font-display uppercase tracking-wide
         hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_0_var(--color-ink)]
         active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all duration-75"
secondary: bg `--color-accent-yellow` text-ink
soft: bg `--color-pink-soft` text-ink
ghost: tanpa border/shadow, hover bg `--color-pink-soft`
destructive: bg `--color-danger` text-white
```

### Card
```
bg-surface border-2 border-ink rounded-[12px] shadow-[6px_6px_0_0_var(--color-ink)] p-4
```
Hover (untuk card clickable): shadow shrink + translate, sama seperti button.

### Input
```
bg-surface border-2 border-ink rounded-[8px] shadow-[2px_2px_0_0_var(--color-ink)] px-3 py-2
focus: shadow-[4px_4px_0_0_var(--color-primary)] outline-none
```

### Badge / Chip
```
border-2 border-ink rounded-full px-3 py-1 font-display text-xs uppercase
varian: bg-accent-yellow | bg-accent-mint | bg-pink-soft | bg-primary text-white
```

### Bottom Nav
- Bar putih dengan border-top 2px ink.
- Item aktif: ikon dalam lingkaran pink-soft border ink shadow-retro-sm.
- Label font-display uppercase, ukuran 10px.

### Modal / Sheet
- Backdrop: `bg-ink/40`.
- Panel: card retro besar, shadow-retro-lg, slide-up dari bawah.

### Kalender
- Cell hari: `border border-ink/20 rounded-[6px]`.
- Hari haid: bg `--color-period`, teks putih, border ink 2px, shadow-retro-sm.
- Prediksi haid: bg `--color-prediction`, border-dashed 2px ink.
- Hari ini: ring 3px primary di luar cell.
- Tanpa drop shadow di tiap cell — terlalu ramai. Hanya highlight haid yang punya shadow.

## 5. Ikonografi

- **Lucide Icons** stroke 2.5 (lebih tebal dari default agar match border tebal).
- Warna: `--color-ink` default; di tombol primary → putih untuk kontras.
- Hindari ikon outline tipis.

## 6. Maskot (Hemo)

- Karakter sel darah, kontur **outline ink 3px**, fill solid pink.
- State mapping:
  - `vibrant`: fill `--color-primary`, mata berkilau, ada kotak shadow di belakang.
  - `cheerful`: fill `--color-prediction`, senyum normal.
  - `tired`: fill `--color-pink-soft`, mata setengah tutup.
  - `pucat`: fill `--color-pink-cream`, mata bertanda silang kecil.
- Frame maskot: card retro besar dengan shadow-retro-lg, bg `--color-accent-yellow` untuk pop visual.
- Animasi idle: bobbing 1.6s ease-in-out infinite (translateY ±3px).

## 7. Iconography Aksesibilitas

- Kontras teks `--color-ink` di `--color-bg` ≈ 16:1 ✓ (AAA).
- Border tebal hitam **menambah** keterbacaan untuk siswi dengan low vision.
- Jangan andalkan warna saja — semua status disertai ikon + label.
- Focus ring: shadow-retro dengan warna `--color-primary` (sudah jelas tanpa outline tambahan).

## 8. Splash, Manifest, PWA

- Splash bg: `--color-pink-cream` dengan maskot tengah dalam frame retro.
- Manifest `theme_color`: `#ff3d8a`.
- Manifest `background_color`: `#fff0f5`.
- Ikon: maskot di card pink dengan border ink + shadow (maskable safe area dijaga).

## 9. Gerakan & Mikrointeraksi

- Press effect translate adalah **identitas** — pakai konsisten di semua tombol & card clickable.
- Hindari fade panjang; transisi default 80–120ms.
- Skeleton loader: kotak dengan border ink + bg pink-soft yang berkedip lembut (1.2s).
- Confetti saat dapat badge: kotak-kotak pink/yellow/mint, sudut tegas (square), bukan lingkaran.

## 10. Don'ts

- ❌ Border tipis 1px atau border abu-abu — selalu 2px ink minimum di elemen utama.
- ❌ Drop shadow blur (`shadow-md` Tailwind default) — pakai hard shadow custom.
- ❌ Border radius full (pill / rounded-full) untuk tombol — pakai 8–12px.
- ❌ Gradien kompleks — solid color blocks ala stiker.
- ❌ Neon pink menyala (#ff00aa) — `--color-primary` cukup hidup tanpa menyilaukan saat malam.
- ❌ Lebih dari 3 warna aksen dalam satu layar.

## 11. Library / Tooling Pilihan

- **Tailwind v4** dengan `@theme` block.
- **shadcn/ui** sebagai base — komponen yang di-add langsung di-rebrand retro.
- **Opsional:** install komponen dari retroui.dev langsung (mereka publish via CLI mirip shadcn). Cek kompatibilitas dengan Next.js 16 sebelum commit.
- **Font loader:** `next/font/google` untuk Archivo Black + Space Grotesk.
