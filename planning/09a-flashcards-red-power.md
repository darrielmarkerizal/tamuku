# 09a — Flashcards RED POWER (Sumber Konten)

## Prinsip
- **Sumber tunggal:** seluruh konten flashcard = materi PDF `RED POWER: Cegah Anemia, Tingkatkan Stamina!` (21 halaman).
- **Tidak menambah fakta di luar PDF.** Kalau tidak ada di slide, tidak masuk kartu.
- **Ganti total** isi `src/content/flashcards.ts` yang sekarang (konten lama seperti "keramas saat haid", "olahraga bikin haid berhenti", "makan nanas", dll. TIDAK ada di PDF → dibuang).
- Format kartu tetap: `title` + `body` ≤ 60 kata, gaya sapaan "kamu" (sesuai [09-edukasi.md](planning/09-edukasi.md:22)).

## Pemetaan Slide → Kartu

### Slide yang DIPAKAI (17 slide → 17 kartu)
| # | Slide PDF | Kategori |
|---|-----------|----------|
| 2 | Detektor Tubuh: Pernah Merasa Loyo? | kenal-anemia |
| 3 | 5L + gejala 4 titik tubuh | kenal-anemia |
| 4 | Mitos darah rendah vs anemia | kenal-anemia |
| 5 | Hemoglobin = kurir oksigen | kenal-anemia |
| 6 | 3 kerentanan remaja putri | kenal-anemia |
| 7 | Dampak hari ini (kognitif/fisik/imun) | kenal-anemia |
| 8 | Efek domino masa depan | kenal-anemia |
| 12 | Kandungan TTD (60 mg besi + 400 mcg folat) | ttd-aturan |
| 13 | Aturan emas: 1/minggu × 52 minggu, malam hari | ttd-aturan |
| 14 | Sekutu: air putih + vitamin C | ttd-aturan |
| 15 | Penghambat: teh, kopi, susu, obat maag (jeda 2 jam) | ttd-aturan |
| 16 | Efek samping: feses hitam & mual (wajar) | ttd-aturan |
| 18 | Inovasi TTD ramah remaja: drops, effervescent, gummy | ttd-aturan |
| 17 | Isi Piringku (intro 4 kuadran) | isi-piringku |
| 17a | Protein Hewani (zat besi heme) | isi-piringku |
| 17b | Protein Nabati (zat besi non-heme) | isi-piringku |
| 17c | Buah = sumber vitamin C | isi-piringku |

Slide 17 dipecah 4 kartu karena isinya 4 blok terpisah di piring.

### Slide yang DI-SKIP (dan alasannya)
| # | Slide | Alasan skip |
|---|-------|-------------|
| 1 | Cover | Bukan konten edukasi |
| 9 | Eksperimen 1: Truk Kurir Hilang | Aktivitas tatap muka kelas |
| 10 | Eksperimen 2: Uji Otak & Konsentrasi | Aktivitas tatap muka |
| 11 | Eksperimen 3: Tantangan Jantung | Aktivitas tatap muka |
| 19 | Collab Soshum: Meronce Pengingat | Kegiatan luring |
| 20 | E-Craft Cuan | Kegiatan luring |
| 21 | Call to Action #RedPowerSquad | Berisi QR fisik, bukan konten |

## Struktur Kategori Baru

Ganti 4 kategori lama (`manfaat-ttd`, `makanan-penambah-darah`, `mitos-fakta-haid`, `kebersihan-haid`) → **3 kategori baru** persis mengikuti alur PDF (Kenali → Cegah dengan TTD → Dukung dengan makanan):

```ts
[
  {
    slug: "kenal-anemia",
    label: "KENAL ANEMIA",
    description: "Detektor tubuh & kenapa remaja putri paling rentan.",
    Icon: HeartPulse,      // sudah ada
    tone: "bg-pink-soft",
    cards: [ /* 7 kartu dari slide 2–8 */ ],
  },
  {
    slug: "ttd-aturan",
    label: "TTD: SENJATA UTAMA",
    description: "Cara minum TTD biar zat besi terserap 100%.",
    Icon: Sparkles,        // sudah ada (tablet metaphor)
    tone: "bg-accent-yellow",
    cards: [ /* 6 kartu dari slide 12–16, 18 */ ],
  },
  {
    slug: "isi-piringku",
    label: "ISI PIRINGKU",
    description: "Amunisi nutrisi alami penambah darah.",
    Icon: Apple,           // sudah ada
    tone: "bg-accent-mint",
    cards: [ /* 4 kartu dari slide 17 */ ],
  },
]
```

Icon `Droplet` (kategori kebersihan haid lama) tidak dipakai lagi — bisa dihapus dari import.

## Draft Konten Kartu (verbatim dari PDF, dikompres ≤60 kata)

### Kategori `kenal-anemia` (7 kartu)

1. **`anemia-1` — Sering merasa loyo tanpa sebab?**
   > Sering ngantuk padahal tidur cukup? Susah fokus belajar dan gampang capek walau olahraga ringan? Ini BUKAN karena kamu malas. Bisa jadi ada "Pencuri Energi" yang diam-diam bersembunyi di tubuhmu bernama ANEMIA.

2. **`anemia-2` — Kenali sinyal 5L**
   > 5L = Lesu, Letih, Lemah, Lelah, Lunglai. Cek juga: kepala pusing & mata berkunang, wajah pucat (kelopak mata & bibir hilang rona merah), dada berdebar & napas ngos-ngosan, tangan & kaki dingin serta sering kesemutan.

3. **`anemia-3` — Anemia ≠ darah rendah**
   > Mitos: pusing = darah rendah, tinggal makan sate kambing. Faktanya beda! Darah rendah (hipotensi) = masalah tekanan pompa jantung, ≤ 90/60 mmHg. Anemia = jumlah sel darah merah/hemoglobin kurang, Hb < 12 g/dL. Penanganannya berbeda, jangan salah strategi!

4. **`anemia-4` — Hemoglobin, kurir oksigen tubuhmu**
   > Hemoglobin di sel darah merah tugasnya antar oksigen ke otak & otot. Hb ≥ 12 g/dL: pasokan lancar, otak tajam, otot bertenaga. Hb < 12 g/dL: jaringan tubuh kelaparan oksigen, mesin tubuh melambat, kamu jadi mengantuk.

5. **`anemia-5` — Kenapa harus remaja putri?**
   > Remaja putri punya 3 kerentanan yang tidak dialami laki-laki: siklus haid rutin (rata-rata buang 30 mg zat besi tiap bulan), growth spurt usia SMP (kebutuhan besi 2× lipat), dan diet keliru (mengurangi porsi makan atau asal pilih jajanan).

6. **`anemia-6` — Dampak hari ini: prestasi nyungsep**
   > Anemia bikin fungsi kognitif drop — daya ingat & konsentrasi hancur, otak butuh energi ekstra hanya untuk paham satu paragraf pelajaran. Kapasitas fisik turun saat ekskul & olahraga. Imunitas jebol, gampang sakit, sering absen sekolah.

7. **`anemia-7` — Efek domino masa depan**
   > Remaja putri anemia hari ini bisa tumbuh jadi ibu hamil anemia (cadangan besi kosong). Risiko: pendarahan hebat saat melahirkan, bayi lahir prematur, dan bayi STUNTING (gagal tumbuh permanen). Rawat dirimu sekarang untuk generasi masa depan tangguh.

### Kategori `ttd-aturan` (6 kartu)

1. **`ttd-1` — Isi TTD: 60 mg besi + 400 mcg folat**
   > Tablet Tambah Darah berisi Zat Besi 60 mg (bahan baku utama pabrik sel darah merah) + Asam Folat 400 mcg (menjaga kualitas sel darah). TTD bukan sekadar obat, tapi suplementasi — investasi stamina jangka panjang.

2. **`ttd-2` — Aturan emas: 1 tablet per minggu**
   > Cukup 1 tablet per minggu, diminum terus selama 52 minggu penuh. Waktu terbaik: malam hari, setelah makan malam atau sebelum tidur. Ini membantu mengurangi rasa eneg/mual karena lambung sedang beristirahat.

3. **`ttd-3` — Skuad sekutu: air putih & vitamin C**
   > Minum TTD wajib ditemani sekutu ini agar zat besi terserap 100%. Air putih = teman paling aman dan netral. Vitamin C dari jeruk, jambu, mangga, tomat — asamnya buka jalan agar zat besi masuk ke darah dengan kilat.

4. **`ttd-4` — Skuad penghalang: hindari saat minum TTD**
   > Jangan biarkan zat besi dirampok di perutmu! Teh & kopi mengandung tanin yang mengikat zat besi. Susu & obat maag punya kalsium tinggi yang memblokir pintu masuk. Beri jeda minimal 2 jam antara TTD dan minuman/obat ini.

5. **`ttd-5` — Efek samping wajar, jangan panik**
   > Feses berwarna hitam setelah minum TTD? SANGAT WAJAR — itu sisa zat besi yang tidak terserap dan dibuang alami. Terasa mual atau perih perut? Adaptasi sementara, lambung sedang menyesuaikan. Tips: jangan minum TTD saat perut kosong.

6. **`ttd-6` — Inovasi TTD ramah remaja**
   > Susah telan pil atau takut mual? Sekarang ada alternatif: Drops/Sirup (praktis, minim risiko lambung), Tablet Kunyah/Effervescent (rasa buah segar, dilarutkan dalam air), dan Gummy/Permen Jeli (inovasi terbaru, serasa makan permen biasa).

### Kategori `isi-piringku` (4 kartu)

1. **`piring-1` — Menu Isi Piringku penambah darah**
   > Piringmu harus punya 4 kuadran: makanan pokok, lauk pauk, sayuran, dan buah-buahan. Kombinasi Makanan Gizi Seimbang + TTD Mingguan = Performa Juara! Ini amunisi nutrisi alami yang mendukung kerja TTD tiap hari.

2. **`piring-2` — Protein hewani: zat besi heme**
   > Daging sapi, hati ayam, telur, dan ikan mengandung zat besi heme — jenis yang penyerapannya paling super di tubuh. Masukkan ke lauk paukmu beberapa kali seminggu untuk dorongan hemoglobin yang cepat.

3. **`piring-3` — Protein nabati: zat besi non-heme**
   > Bayam, kangkung, tempe, tahu, dan kacang-kacangan adalah sumber zat besi non-heme. Murah, mudah didapat, dan cocok dipadukan tiap hari. Kombinasikan dengan protein hewani agar amunisi hemoglobinmu lengkap.

4. **`piring-4` — Buah-buahan: pembuka jalan**
   > Buah-buahan adalah sumber Vitamin C yang jadi pembuka jalan zat besi masuk ke darah. Konsumsi bareng menu utama — bukan sekadar penutup. Contoh: jeruk, jambu, mangga, tomat, papaya, strawberry.

## Perubahan Kode (Implementasi)

File yang disentuh:
- **`src/content/flashcards.ts`** — replace `CATEGORIES` sepenuhnya. Struktur `Flashcard`, `FlashcardCategory`, `getCategory`, `FLASHCARDS`, `FLASHCARDS_BY_ID` **tidak berubah** (biar konsumsi di UI & IndexedDB `seenFlashcards` tidak pecah).
- Import lucide: buang `Droplet`, tetap pakai `Apple`, `HeartPulse`, `Sparkles`.

Dampak downstream (perlu dicek, tapi kemungkinan aman karena API tidak berubah):
- `FlashcardModal` pop-up setelah `logTtd` sukses ([09-edukasi.md:11](planning/09-edukasi.md:11)) — masih baca `FLASHCARDS` acak.
- Halaman `/edukasi` grid kategori — tetap render dari `CATEGORIES`, tinggal 3 kartu kategori.
- `users.seenFlashcards: string[]` — ID lama (`manfaat-1`, `mitos-2`, dst.) akan mati/tidak match. Aman, cuma berarti user seolah "belum lihat" kartu baru (ini konsekuensi wajar; tidak butuh migrasi karena field ini hanya tracking, bukan integritas data).

## Yang PERLU Konfirmasi Sebelum Coding

1. **Setuju replace total** (buang seluruh konten `mitos-fakta-haid` & `kebersihan-haid` lama)? Atau tetap simpan kategori haid lama & hanya **tambah** 3 kategori baru dari PDF?
2. **Bahasa "5L" dan "Pencuri Energi"** — istilah khas PDF, dipertahankan verbatim atau disederhanakan?
3. Slide 18 (inovasi TTD gummy/effervescent) — masuk sebagai kartu, tapi program Kemenkes standar TTD SMP masih pil merah. Tetap dimasukkan (sesuai PDF) atau di-skip biar tidak bingungin siswi?
