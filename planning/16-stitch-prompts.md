# 16 — Google Stitch Prompts (Per Page)

How to use:
1. Open [stitch.withgoogle.com](https://stitch.withgoogle.com/) and start a new project.
2. Paste **Prompt 00** first to establish the shared design system in the session.
3. After it generates, paste the next prompt (01, 02, ...) one by one in the **same session** so Stitch reuses the established visual language. Each prompt explicitly says "continue the design system from the previous screens" so consistency is preserved.
4. Keep Indonesian copywriting **verbatim** — do not let Stitch translate it.

> Target device for all screens: **Mobile portrait, 390×844 (iPhone 14 safe area)**. PWA standalone — no browser chrome shown.

---

## Prompt 00 — Design System Foundation (paste first)

```
Project: Tamuku — a period and iron-tablet (TTD) tracker PWA for Indonesian middle-school girls.

Establish a SHARED design system for all upcoming screens in this session. Visual direction: NEO-BRUTALISM in the style of retroui.dev, with a PINK identity. Every screen we design after this must follow this system exactly.

DESIGN TOKENS:
- Background: #fff0f5 (cream-pink)
- Surface (cards): #ffffff
- Primary action: #ff3d8a (hot pink)
- Primary pressed: #d11c63
- Soft pink (chips, highlights): #ffd1e3
- Yellow accent: #ffd66b
- Mint accent (success): #9ae6c4
- Peach accent: #ffb088
- Period day (calendar marker): #e11d48
- Prediction day (calendar): #ff8fb6 with dashed border
- Ink (borders, body text, shadows): #1a0a14
- Muted text: #6b3a4c

SIGNATURE STYLE RULES — apply to EVERY interactive element:
- Border: 2px solid #1a0a14 (the ink color)
- Corner radius: 8px for buttons/inputs, 12px for cards (NOT pill, NOT sharp)
- Drop shadow: HARD shadow with NO blur. Format: 4px 4px 0 0 #1a0a14. Use 6px 6px for large hero cards, 2px 2px for inputs/small chips.
- Press effect (visual hint): button looks slightly offset to suggest it can be pressed down.
- NO gradients. NO soft shadows. NO thin 1px borders. NO pill-shaped buttons.

TYPOGRAPHY:
- Display / headings / button labels: "Archivo Black", uppercase, tight tracking.
- Body / paragraphs / form labels: "Space Grotesk", regular and medium weights.
- Numbers and stats: "JetBrains Mono" bold.

LAYOUT:
- Mobile first, 390px wide, 844px tall, safe area respected.
- Generous padding inside cards (16-20px).
- Vertical rhythm 12-16px between sections.
- Bottom navigation bar fixed at bottom for in-app screens (NOT auth screens). 4 tabs: BERANDA, KALENDER, EDUKASI, PROFIL. Active tab has the icon inside a pink-soft circle with 2px ink border and a small hard shadow.

MASCOT:
- Name: "Hemo" — a friendly red blood cell character.
- Round body, big shiny eyes, small smile, soft cheeks.
- Drawn with 3px solid ink (#1a0a14) outline, flat fill, no gradient.
- 4 states: vibrant (bright #ff3d8a), cheerful (#ff8fb6), tired (#ffd1e3, sleepy eyes), pucat (#ffe4ec, X eyes).

LANGUAGE: All UI copy is in Bahasa Indonesia, casual teen tone ("kamu"), warm and friendly, NEVER clinical.

Confirm you understand and produce a one-page style sheet showing: the color swatches, a sample button (default/hover/pressed), a sample card with shadow, the mascot in its 4 states, and a sample bottom-nav. We will use this as the visual reference for every subsequent screen.
```

---

## Prompt 01 — `/login`

```
Continue the same retro-pink neo-brutalism design system established in this session.

Screen: LOGIN. Mobile portrait, 390x844, PWA standalone.

Layout top to bottom:
1. Top 1/3: pink-cream background area with the mascot "Hemo" in vibrant state, centered, inside a yellow accent (#ffd66b) card with 2px ink border and 6px 6px 0 0 hard shadow. Above the mascot card, the word "tamuku" as the app wordmark in Archivo Black, uppercase, ink color.
2. Middle: white card with 2px ink border and 4px 4px 0 0 hard shadow. Inside the card:
   - Heading (Archivo Black, uppercase): "MASUK DULU YUK"
   - Subtext (Space Grotesk): "Catat siklus dan TTD-mu di sini."
   - Input field labeled "Username" — placeholder "namamu_di_sini".
   - Input field labeled "Password" — type password.
   - Small text link aligned right: "Lupa password?"
   - Primary button full-width: "MASUK" — hot pink (#ff3d8a), white text, ink border, hard shadow.
3. Below the card, smaller text centered: "Belum punya akun? Daftar di sini" with "Daftar di sini" as a pink underlined link.

Inputs follow the system: 2px ink border, 8px radius, 2px 2px hard shadow, white background. Focus state shows shadow becoming pink (#ff3d8a).

No bottom navigation on this screen.
```

---

## Prompt 02 — `/register`

```
Continue the same design system.

Screen: REGISTER. Mobile portrait, 390x844.

Layout:
1. Top: back arrow button (square with 2px ink border, 8px radius, hard shadow), top-left.
2. Heading (Archivo Black, uppercase, ink): "BIKIN AKUN BARU"
3. Subtext (Space Grotesk): "Cukup isi info dasar aja, ga ribet."
4. White card with brutalist border and shadow containing these inputs stacked:
   - "Nama Lengkap" — placeholder "Mis. Nisa Fredlina"
   - "Username" — placeholder "min. 4 huruf/angka"
   - "Sekolah (opsional)" — placeholder "SMP 1 Sepaku"
   - "Kelas (opsional)" — placeholder "8A"
   - "Password" — type password, with show/hide eye icon
5. Below inputs, a checkbox row with a custom checkbox that looks like a small square button (2px ink border, hard shadow, with pink fill + ink checkmark when checked). Label next to it (Space Grotesk, 14px):
   "Aku sudah memberi tahu orang tua/wali bahwa aku pakai aplikasi ini."
6. Small italic disclaimer below in muted text: "Datamu disimpan pribadi dan tidak dibagikan ke siapa pun."
7. Full-width primary button: "DAFTAR SEKARANG" — hot pink, ink border, hard shadow.
8. Below: link centered "Sudah punya akun? Masuk"

No bottom nav.
```

---

## Prompt 03 — `/onboarding` (4-step wizard)

```
Continue the same design system.

Screen: ONBOARDING WIZARD. Mobile portrait, 390x844. Show ALL FOUR steps as separate frames laid out left-to-right in one canvas so we can see the full flow.

Common to all 4 frames:
- Step progress indicator at top: 4 small squares (8px radius, 2px ink border). Active step filled with hot pink, others white. Spaced evenly.
- "Lewati" (Skip) text-link top-right (except step 4).
- Bottom of screen: primary button "LANJUT" on steps 1-3, "SELESAI" on step 4. Full-width, retro style.

STEP 1 — Kenalan dengan Hemo:
- Mascot Hemo (vibrant state) huge, centered, inside a yellow accent card with 6px 6px hard shadow.
- Heading: "HALO, AKU HEMO!"
- Paragraph (Space Grotesk): "Aku bakal nemenin kamu catat siklus haid dan minum TTD biar selalu sehat ya."

STEP 2 — Tanggal haid terakhir:
- Heading: "KAPAN HAID TERAKHIRMU?"
- Subtext: "Boleh di-skip kalau lupa. Kita pakai 28 hari default."
- A retro calendar widget showing one month. Selected date highlighted with the period red (#e11d48), white text, ink border, small hard shadow.
- Hint chip below in soft pink: "Lupa? Tekan Lewati."

STEP 3 — Jumlah TTD sekarang:
- Heading: "PUNYA BERAPA PIL TTD?"
- Subtext: "Hitung pil yang masih kamu simpan."
- Big number input (JetBrains Mono, 64px bold) centered with - and + square buttons on either side (retro buttons with hard shadow). Default value "4".
- Below: 3 quick-pick chips: "+4 (1 strip)", "+10", "+30". Each chip is a retro pill-less button.

STEP 4 — Pengingat:
- Heading: "ATUR PENGINGAT"
- Subtext: "Kapan kamu mau diingatkan minum TTD?"
- Row 1: Day picker — 7 round-square chips (Sen Sel Rab Kam Jum Sab Min). "Jum" selected by default (hot pink filled, ink border, hard shadow).
- Row 2: Time picker — large display showing "19:00" with up/down arrow squares. JetBrains Mono.
- Bottom card (yellow accent): "Aktifkan notifikasi biar ga lupa ya!" with a primary toggle switch (custom brutalist style: square track with 2px border + a square thumb that shifts).
- Bottom button: "SELESAI"
```

---

## Prompt 04 — `/dashboard`

```
Continue the same design system.

Screen: DASHBOARD (BERANDA). Mobile portrait, 390x844. This is the main home screen with bottom navigation.

Layout top to bottom:
1. Header row: greeting "Halo, Nisa 👋" (Archivo Black uppercase ink) on the left; small circular profile avatar with 2px ink border on the right; bell notification icon next to it.

2. STATUS CARD (most prominent, white card with 2px ink border + 6px 6px hard shadow):
   - Small label uppercase muted: "STATUS HARI INI"
   - Big heading (Archivo Black): "HARI KE-3 HAID KAMU"
   - Subtext (Space Grotesk): "Ingat minum TTD ya, biar ga lemas."
   - Inside this card, on the right, the mascot Hemo (vibrant state) at 80x80.

3. PERIOD LOGGING BUTTON:
   - Full width, very tall (72px), retro primary style.
   - Label: "TANDAI HAID SELESAI" (because user is currently on period). Below the label small text: "Hari ke-3 dimulai 27 Jun".
   - Background hot pink, white text, ink border, hard shadow.

4. TTD CARD (white card, 4px 4px shadow):
   - Top row: "TTD HARI INI" label uppercase muted on left; small chip "Sisa: 6 pil" on right (soft pink chip, ink border).
   - Mode info (Space Grotesk): "Mode harian — kamu sedang haid."
   - Full-width button (mint accent #9ae6c4 fill, ink text): "SUDAH MINUM TTD HARI INI ✓"

5. MASCOT + STREAK ROW: two side-by-side cards:
   - Left card (taller): mascot Hemo (cheerful state) inside yellow card, small label below: "Hemo lagi ceria!"
   - Right card: streak with big fire emoji 🔥 and number "3" (JetBrains Mono 48px), label "MINGGU BERTURUT".

6. JOURNAL QUICK CARD (white card):
   - Label "JURNAL HARI INI" uppercase muted.
   - Row of 6 emoji mood options (😀 😌 😢 😠 😩 😟), each in a small soft-pink square with ink border.
   - Small text: "Tambahkan catatan →"

7. BOTTOM NAV (fixed, 64px tall): white background, 2px ink top border. 4 tabs:
   - BERANDA (active — icon in pink-soft circle with ink border + small shadow)
   - KALENDER
   - EDUKASI
   - PROFIL
   Each tab has an icon (Lucide-style, stroke 2.5px ink) above a tiny uppercase label.

Tone of copy: warm, encouraging, very teen-friendly.
```

---

## Prompt 05 — `/kalender`

```
Continue the same design system.

Screen: KALENDER (calendar). Mobile portrait, 390x844. Tab "KALENDER" active in bottom nav.

Layout:
1. Top header: month/year selector "JUNI 2026" (Archivo Black uppercase), with left/right square arrow buttons (retro style, 2px ink border, hard shadow).
2. Below: a row of weekday letters S M S R K J S (Space Grotesk, uppercase muted).
3. Calendar grid 7 columns × 6 rows. Each cell is 40x40, no border around regular days. Day types:
   - Regular day: just the number, ink color.
   - Today: number wrapped in a 3px hot-pink ring.
   - Logged period day (e.g., 25, 26, 27 June): solid #e11d48 red fill, white number, 2px ink border, small hard shadow, rounded 8px.
   - Predicted next period (e.g., 23-27 July would be shown if visible): #ff8fb6 fill with DASHED 2px ink border, 8px radius.
   - Future days: ink color, regular weight.
4. LEGEND CARD below grid (white card with brutalist border + 4px 4px shadow): small legend chips for "Haid tercatat", "Prediksi", "Hari ini".
5. BIG CTA BUTTON below: "+ CATAT HAID MANUAL" — hot pink, retro shadow, full width. Tapping opens /kalender/log (next screen).
6. CYCLE INSIGHTS CARD (yellow accent fill, ink border, hard shadow):
   - "RATA-RATA SIKLUSMU"
   - Big number "28" (JetBrains Mono 48px) + "HARI" next to it.
   - Subtext: "Berdasarkan 3 siklus terakhir."
   - Small label chip "Kepercayaan: Sedang" (soft pink chip).
7. Bottom nav with KALENDER active.

Make sure the calendar reads cleanly and the brutalist style is consistent.
```

---

## Prompt 06 — `/kalender/log`

```
Continue the same design system.

Screen: CATAT HAID MANUAL (manual back-fill of a period log). Modal sheet that slides up from bottom over /kalender. Mobile portrait, 390x844.

Layout:
1. Sheet panel with rounded top corners 16px, white surface, 2px ink top-border (no border at bottom). Top has a small ink drag handle (32x4 pill).
2. Heading (Archivo Black): "CATAT HAID MANUAL"
3. Subtext: "Isi tanggal mulai dan selesai. Bisa juga cuma mulai kalau masih berlangsung."
4. Two date pickers stacked:
   - "TANGGAL MULAI" label, input showing chosen date like "25 Juni 2026", calendar icon at right. Retro input border + shadow.
   - "TANGGAL SELESAI (opsional)" — same style.
5. Info chip yellow accent: "ⓘ Maksimal 10 hari. Lebih dari itu otomatis ditutup."
6. Footer two buttons side by side:
   - "BATAL" (white card style, ink text)
   - "SIMPAN" (hot pink primary)

Behind the sheet, /kalender is dimmed with ink overlay at 40% opacity.
```

---

## Prompt 07 — `/ttd`

```
Continue the same design system.

Screen: TTD (iron tablet tracker overview). Mobile portrait, 390x844. Reached from the dashboard via the TTD button or via deep-link. No tab in bottom nav directly highlights it — show BERANDA still active for now.

Layout:
1. Top header row: back arrow square button (top-left), title "TTD KAMU" (Archivo Black uppercase, centered).
2. BIG STOCK CARD (white card, 6px 6px hard shadow):
   - Tiny label uppercase muted: "SISA PIL"
   - Huge number: "6" (JetBrains Mono, 96px, ink color), with " PIL" suffix (Archivo Black, 24px) baseline-aligned.
   - Small chip below: "Cukup buat ~6 minggu" (yellow accent chip).
   - Button row: full-width primary button "+ TAMBAH STOK" (hot pink, retro shadow).
3. JADWAL PENGINGAT CARD:
   - Label "JADWAL PENGINGAT" uppercase muted.
   - Two info rows with icons (clock and droplet):
     - "Mingguan: Jumat, 19:00"
     - "Saat haid: Setiap hari, 19:00"
   - Small text-link bottom-right: "Ubah jadwal →"
4. HEATMAP 30-HARI CARD:
   - Label "30 HARI TERAKHIR" uppercase muted.
   - A 5-row × 7-column grid of small squares (each 28x28). Squares colored: mint #9ae6c4 (taken), soft pink #ffd1e3 (skipped/not due), white with ink border (not due). All squares have 2px ink border and 1px radius.
   - Legend chips below.
5. Bottom card text-link: "Lihat riwayat lengkap →" (leads to /ttd/riwayat).
6. Bottom nav present.
```

---

## Prompt 08 — `/ttd/riwayat`

```
Continue the same design system.

Screen: RIWAYAT TTD (TTD history list). Mobile portrait, 390x844.

Layout:
1. Top header: back arrow + title "RIWAYAT TTD" (Archivo Black uppercase).
2. Filter chip row: "SEMUA" (active hot pink chip), "DIMINUM", "STOK MASUK". Each chip is a retro chip with ink border + shadow.
3. Grouped list — sections by week. Each section header is uppercase muted text "MINGGU INI", "MINGGU LALU", "2 MINGGU LALU".
4. Inside each section, list items as small white cards (4px 4px hard shadow):
   - Left: a colored square icon — mint for "diminum", yellow for "stok masuk".
   - Middle: 2 lines — top: action label ("Minum TTD" / "+10 pil dari UKS"); bottom: date in JetBrains Mono "Kam, 25 Jun • 19:14".
   - Right: small status chip — "HARIAN" or "MINGGUAN" or "+10".
5. Example items:
   - "Minum TTD" — "Sen, 28 Jun • 19:02" — HARIAN
   - "Minum TTD" — "Min, 27 Jun • 18:55" — HARIAN
   - "+10 pil dari UKS" — "Jum, 25 Jun • 09:30" — STOK
6. Bottom: "Muat lebih banyak" button (white card style, ink border, hard shadow).
7. Bottom nav present.
```

---

## Prompt 09 — `/ttd/tambah-stok`

```
Continue the same design system.

Screen: TAMBAH STOK TTD. Bottom sheet modal sliding up over /ttd. Mobile portrait, 390x844.

Layout:
1. Sheet with rounded top 16px, white surface, ink top border, drag handle.
2. Heading: "TAMBAH STOK TTD"
3. Subtext: "Berapa pil yang baru kamu dapat?"
4. Big number stepper in center: minus square button — number "4" (JetBrains Mono 64px) — plus square button. Both buttons are retro squares with ink border + hard shadow.
5. Quick-pick row of three big retro buttons stacked or in a row:
   - "+4 (1 STRIP)" — yellow accent fill
   - "+10" — soft pink fill
   - "+30 (1 BOTOL)" — mint accent fill
   Each is a chunky button with ink border + 4px 4px hard shadow.
6. Optional note input: "Catatan (opsional)" with placeholder "Dari kakak UKS, dari apotek, dll."
7. Footer two buttons:
   - "BATAL" (white)
   - "SIMPAN" (hot pink)

/ttd dimmed behind.
```

---

## Prompt 10 — `/jurnal`

```
Continue the same design system.

Screen: JURNAL (journal list, 14 days). Mobile portrait, 390x844. Reached from dashboard journal card. Tab BERANDA still active in bottom nav for now.

Layout:
1. Top header: back arrow + title "JURNALMU" (Archivo Black uppercase).
2. Top CTA card (yellow accent, ink border, hard shadow):
   - Small label "HARI INI"
   - Heading "Belum nulis hari ini" or "Sudah lengkap ✨"
   - Right side mascot Hemo (cheerful) small.
   - Button below "ISI JURNAL HARI INI" (hot pink primary).
3. Heading "14 HARI TERAKHIR" (Archivo Black uppercase muted size).
4. List of day cards, vertical stack. Each card (white surface, 2px ink border, 4px 4px hard shadow, 12px radius):
   - Left: big mood emoji (😌 etc) inside a soft-pink square with ink border.
   - Middle: date in Archivo Black uppercase "KAM, 25 JUN" + below a row of small symptom chips (e.g., "kram" "lemas") soft-pink chips with ink border.
   - Right: a small chevron > icon.
5. Show 4-5 example day cards with varied moods.
6. Bottom nav.

Tone of copy on the empty state: "Jurnal kamu bantu lihat pola, lho!"
```

---

## Prompt 11 — `/jurnal/today`

```
Continue the same design system.

Screen: ISI JURNAL HARI INI (today's journal entry). Mobile portrait, 390x844. Designed as a full screen (not modal) — feels like a focused writing space.

Layout:
1. Top header: close X button (top-left, square retro), title "JURNAL HARI INI", date pill on the right showing "RAB, 30 JUN" (yellow chip).
2. SECTION 1 — MOOD:
   - Label: "GIMANA MOOD KAMU?"
   - Grid of 6 emoji options (😀 senang, 😌 tenang, 😢 sedih, 😠 kesal, 😩 lelah, 😟 cemas), 3 per row.
   - Each emoji sits in a square white card with ink border + small shadow. Selected one (e.g., 😌) has hot-pink soft fill + thicker shadow + a small Indonesian text label below it "tenang".
3. SECTION 2 — GEJALA:
   - Label "ADA GEJALA APA AJA?"
   - Multi-select chips wrapping: "Kram", "Sakit kepala", "Kembung", "Jerawat", "Lemas", "Sakit pinggang". Selected chips: hot pink fill, white text, ink border, hard shadow. Unselected: white fill, ink text.
4. SECTION 3 — CATATAN:
   - Label "CATATAN (OPSIONAL)"
   - Textarea retro style (2px ink border, hard shadow, white bg) with placeholder "Tulis apa aja yang kamu rasain hari ini... (max 280)".
   - Character counter bottom-right "0/280".
5. Bottom fixed button bar: full-width primary "SIMPAN JURNAL" (hot pink retro).
```

---

## Prompt 12 — `/jurnal/[date]`

```
Continue the same design system.

Screen: JURNAL — TANGGAL TERTENTU (edit a past day's journal entry). Mobile portrait, 390x844.

Identical structure to /jurnal/today, but:
- Header date pill shows the selected past date, e.g., "SEN, 21 JUN".
- The mood section already has one emoji selected (e.g., 😩 with label "lelah") shown in the selected state.
- Symptom chips show 2 chips already selected: "Kram" and "Lemas".
- Textarea pre-filled with example content: "Hari pertama haid, kram banget. Udah minum TTD pagi tadi."
- Below the textarea, small muted text in Space Grotesk: "Terakhir diubah: 21 Jun, 21:14".
- Bottom bar shows TWO buttons side by side:
  - "HAPUS" (white card style with ink text, danger-red small icon)
  - "SIMPAN PERUBAHAN" (hot pink primary, wider)
```

---

## Prompt 13 — `/edukasi`

```
Continue the same design system.

Screen: EDUKASI (education library — flashcard categories). Mobile portrait, 390x844. Bottom nav tab EDUKASI active.

Layout:
1. Top: heading "BELAJAR YUK" (Archivo Black uppercase) + subtext "Kartu singkat soal haid & TTD."
2. Filter row: two chips — "SEMUA" (active hot pink) and "BELUM DIBACA" (white).
3. Featured card at top (full width, yellow accent fill, ink border, 6px 6px hard shadow):
   - Small label "KARTU HARI INI"
   - Heading: "Kenapa harus minum TTD?"
   - Short preview text 2 lines.
   - Mascot Hemo (cheerful) in the corner, smaller.
   - Button "BUKA KARTU →" pink primary.
4. Category grid — 2 columns × 2 rows of category cards. Each card 160x160, retro style:
   - "MANFAAT TTD" — soft pink card, icon of a pill.
   - "MAKANAN PENAMBAH DARAH" — mint accent card, icon of leaf.
   - "MITOS & FAKTA HAID" — yellow card, icon of question mark.
   - "KEBERSIHAN HAID" — peach card, icon of droplet.
   Each card has the category title in Archivo Black uppercase, a small Indonesian subtitle ("8 kartu"), and an icon top-right.
5. Bottom: a small "PROGRES BACAANMU" card (white) with a retro progress bar (chunky filled ink rectangle) showing "12 / 30 kartu dibaca".
6. Bottom nav with EDUKASI active.
```

---

## Prompt 14 — Flashcard Modal (overlay)

```
Continue the same design system.

Screen: FLASHCARD MODAL — appears after the user logs TTD on the dashboard, or when tapped from /edukasi. Full-screen overlay on mobile, 390x844.

Layout:
1. Background dim ink overlay 50%.
2. Centered card filling most of the screen with retro style — yellow accent fill, 2px ink border, 8px 8px huge hard shadow, 16px radius.
3. Top of card:
   - Tiny close X square button top-right.
   - Tiny label uppercase: "KARTU 1 DARI 3"
4. Middle of card:
   - Mascot Hemo (vibrant) small at top center.
   - Title (Archivo Black, large): "KENAPA HARUS MINUM TTD?"
   - Paragraph in Space Grotesk medium size: "Tablet Tambah Darah (TTD) bantu tubuhmu bikin sel darah merah. Saat haid kamu kehilangan darah, jadi penting buat ganti zat besinya biar ga gampang capek dan pusing."
5. Bottom of card:
   - Tiny dots indicator (3 dots, the first one solid pink, others outlined).
   - Two big square nav buttons "←" and "→" left and right (retro buttons, ink border, hard shadow).
6. Below the dots, a small text-link "Cukup, tutup kartu" centered in muted.

Make the card feel like a fun sticker on the screen.
```

---

## Prompt 15 — `/profil`

```
Continue the same design system.

Screen: PROFIL (profile + gamification hub). Mobile portrait, 390x844. Tab PROFIL active in bottom nav.

Layout:
1. Top hero block (pink-cream background extension):
   - Mascot Hemo huge in vibrant state inside a yellow accent card with chunky shadow.
   - Below mascot: name "Nisa Fredlina" (Archivo Black), small chip "SMP 1 Sepaku • Kelas 8A".
2. STATS ROW — 3 small cards side by side, each white surface with retro shadow:
   - "🔥 3" "MINGGU STREAK"
   - "92%" "KEPATUHAN 30H"
   - "12" "SIKLUS DICATAT"
   Numbers in JetBrains Mono bold, labels Space Grotesk uppercase muted tiny.
3. BADGE GRID section:
   - Heading: "LENCANA KAMU"
   - Grid 3 cols × 2 rows of badge cards. Each badge 100x100 retro style. Earned badges full-color (e.g., "IRON GIRL" yellow fill with a tablet icon, "CYCLE SYNC" pink fill with calendar icon, "LANGKAH AWAL" mint fill). Unearned badges grayscale silhouette with a tiny lock 🔒 icon and ink-muted border.
   - Each card shows the badge icon, Indonesian name in Archivo Black tiny, and tiny progress text ("12/14 hari").
4. SETTINGS list — vertical stack of menu rows, each a slim white card with ink border + tiny shadow:
   - "Edit profil"
   - "Pengingat & notifikasi"
   - "Privasi & data"
   - "Tentang Tamuku"
   - "Keluar" (text in danger red)
   Each row has a small Lucide icon left and a chevron right.
5. Bottom: tiny version text "Tamuku v1.0 • Buat Sepaku ❤️"
6. Bottom nav PROFIL active.
```

---

## Prompt 16 — `/offline`

```
Continue the same design system.

Screen: OFFLINE FALLBACK PAGE. Mobile portrait, 390x844. Shown when the service worker has no cached page and the user has no network.

Layout:
1. Centered on a pink-cream background:
   - Mascot Hemo in "tired" state (soft pink fill, sleepy eyes), large inside a yellow accent card with chunky shadow.
   - A small thought bubble or zigzag wifi-off icon near the mascot.
2. Heading (Archivo Black uppercase): "LAGI OFFLINE NIH"
3. Paragraph (Space Grotesk): "Tenang, catatanmu tetap tersimpan dan bakal otomatis dikirim begitu kamu online lagi."
4. Retro button "COBA LAGI" (hot pink primary, ink border, hard shadow).
5. Below button, small muted link "Buka beranda dari cache →"
6. No bottom nav (this is a system page, not in-app navigation).
```

---

## Tips Saat Generate

- Kalau Stitch mulai drift (warna meleset, shadow jadi blur, border tipis), tambahkan di prompt berikutnya: **"Maintain the exact tokens from Prompt 00. Borders must be 2px solid #1a0a14. Shadows must be hard, no blur, 4px 4px 0 0 #1a0a14."**
- Jangan biarkan Stitch menerjemahkan label Indonesia. Jika ia coba, ulang: **"Keep all UI copy verbatim in Bahasa Indonesia exactly as written."**
- Untuk variasi state (loading, empty, error), generate ulang halaman yang sama dengan menambahkan: **"Same screen but in <empty/loading/error> state."**
- Setelah semua 17 prompt selesai, export sebagai Figma untuk handoff developer.
