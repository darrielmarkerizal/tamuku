import {
  Apple,
  HeartPulse,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type Flashcard = {
  id: string;
  title: string;
  body: string;
};

export type FlashcardCategory = {
  slug: string;
  label: string;
  description: string;
  Icon: LucideIcon;
  tone: string;
  cards: Flashcard[];
};

export const CATEGORIES: FlashcardCategory[] = [
  {
    slug: "kenal-anemia",
    label: "KENAL ANEMIA",
    description: "Detektor tubuh & kenapa remaja putri paling rentan.",
    Icon: HeartPulse,
    tone: "bg-pink-soft",
    cards: [
      {
        id: "anemia-1",
        title: "Sering merasa loyo tanpa sebab?",
        body: "Sering ngantuk padahal tidur cukup? Susah fokus belajar dan gampang capek walau olahraga ringan? Ini BUKAN karena kamu malas. Bisa jadi ada Pencuri Energi yang diam-diam bersembunyi di tubuhmu bernama ANEMIA.",
      },
      {
        id: "anemia-2",
        title: "Kenali sinyal 5L",
        body: "5L = Lesu, Letih, Lemah, Lelah, Lunglai. Cek juga: kepala pusing & mata berkunang, wajah pucat (kelopak mata & bibir hilang rona merah), dada berdebar & napas ngos-ngosan, tangan & kaki dingin serta sering kesemutan.",
      },
      {
        id: "anemia-3",
        title: "Anemia ≠ darah rendah",
        body: "Mitos: pusing = darah rendah, tinggal makan sate kambing. Faktanya beda! Darah rendah (hipotensi) = masalah tekanan pompa jantung, ≤ 90/60 mmHg. Anemia = jumlah sel darah merah/hemoglobin kurang, Hb < 12 g/dL. Penanganannya berbeda, jangan salah strategi!",
      },
      {
        id: "anemia-4",
        title: "Hemoglobin, kurir oksigen tubuhmu",
        body: "Hemoglobin di sel darah merah tugasnya antar oksigen ke otak & otot. Hb ≥ 12 g/dL: pasokan lancar, otak tajam, otot bertenaga. Hb < 12 g/dL: jaringan tubuh kelaparan oksigen, mesin tubuh melambat, kamu jadi mengantuk.",
      },
      {
        id: "anemia-5",
        title: "Kenapa harus remaja putri?",
        body: "Remaja putri punya 3 kerentanan yang tidak dialami laki-laki: siklus haid rutin (rata-rata buang 30 mg zat besi tiap bulan), growth spurt usia SMP (kebutuhan besi 2× lipat), dan diet keliru (mengurangi porsi makan atau asal pilih jajanan).",
      },
      {
        id: "anemia-6",
        title: "Dampak hari ini: prestasi nyungsep",
        body: "Anemia bikin fungsi kognitif drop — daya ingat & konsentrasi hancur, otak butuh energi ekstra hanya untuk paham satu paragraf pelajaran. Kapasitas fisik turun saat ekskul & olahraga. Imunitas jebol, gampang sakit, sering absen sekolah.",
      },
      {
        id: "anemia-7",
        title: "Efek domino masa depan",
        body: "Remaja putri anemia hari ini bisa tumbuh jadi ibu hamil anemia (cadangan besi kosong). Risiko: pendarahan hebat saat melahirkan, bayi lahir prematur, dan bayi STUNTING (gagal tumbuh permanen). Rawat dirimu sekarang untuk generasi masa depan tangguh.",
      },
    ],
  },
  {
    slug: "ttd-aturan",
    label: "TTD: SENJATA UTAMA",
    description: "Cara minum TTD biar zat besi terserap 100%.",
    Icon: Sparkles,
    tone: "bg-accent-yellow",
    cards: [
      {
        id: "ttd-1",
        title: "Isi TTD: 60 mg besi + 400 mcg folat",
        body: "Tablet Tambah Darah berisi Zat Besi 60 mg (bahan baku utama pabrik sel darah merah) + Asam Folat 400 mcg (menjaga kualitas sel darah). TTD bukan sekadar obat, tapi suplementasi — investasi stamina jangka panjang.",
      },
      {
        id: "ttd-2",
        title: "Aturan emas: 1 tablet per minggu",
        body: "Cukup 1 tablet per minggu, diminum terus selama 52 minggu penuh. Waktu terbaik: malam hari, setelah makan malam atau sebelum tidur. Ini membantu mengurangi rasa eneg/mual karena lambung sedang beristirahat.",
      },
      {
        id: "ttd-3",
        title: "Skuad sekutu: air putih & vitamin C",
        body: "Minum TTD wajib ditemani sekutu ini agar zat besi terserap 100%. Air putih = teman paling aman dan netral. Vitamin C dari jeruk, jambu, mangga, tomat — asamnya buka jalan agar zat besi masuk ke darah dengan kilat.",
      },
      {
        id: "ttd-4",
        title: "Skuad penghalang: hindari saat minum TTD",
        body: "Jangan biarkan zat besi dirampok di perutmu! Teh & kopi mengandung tanin yang mengikat zat besi. Susu & obat maag punya kalsium tinggi yang memblokir pintu masuk. Beri jeda minimal 2 jam antara TTD dan minuman/obat ini.",
      },
      {
        id: "ttd-5",
        title: "Efek samping wajar, jangan panik",
        body: "Feses berwarna hitam setelah minum TTD? SANGAT WAJAR — itu sisa zat besi yang tidak terserap dan dibuang alami. Terasa mual atau perih perut? Adaptasi sementara, lambung sedang menyesuaikan. Tips: jangan minum TTD saat perut kosong.",
      },
      {
        id: "ttd-6",
        title: "Inovasi TTD ramah remaja",
        body: "Susah telan pil atau takut mual? Sekarang ada alternatif: Drops/Sirup (praktis, minim risiko lambung), Tablet Kunyah/Effervescent (rasa buah segar, dilarutkan dalam air), dan Gummy/Permen Jeli (inovasi terbaru, serasa makan permen biasa).",
      },
    ],
  },
  {
    slug: "isi-piringku",
    label: "ISI PIRINGKU",
    description: "Amunisi nutrisi alami penambah darah.",
    Icon: Apple,
    tone: "bg-accent-mint",
    cards: [
      {
        id: "piring-1",
        title: "Menu Isi Piringku penambah darah",
        body: "Piringmu harus punya 4 kuadran: makanan pokok, lauk pauk, sayuran, dan buah-buahan. Kombinasi Makanan Gizi Seimbang + TTD Mingguan = Performa Juara! Ini amunisi nutrisi alami yang mendukung kerja TTD tiap hari.",
      },
      {
        id: "piring-2",
        title: "Protein hewani: zat besi heme",
        body: "Daging sapi, hati ayam, telur, dan ikan mengandung zat besi heme — jenis yang penyerapannya paling super di tubuh. Masukkan ke lauk paukmu beberapa kali seminggu untuk dorongan hemoglobin yang cepat.",
      },
      {
        id: "piring-3",
        title: "Protein nabati: zat besi non-heme",
        body: "Bayam, kangkung, tempe, tahu, dan kacang-kacangan adalah sumber zat besi non-heme. Murah, mudah didapat, dan cocok dipadukan tiap hari. Kombinasikan dengan protein hewani agar amunisi hemoglobinmu lengkap.",
      },
      {
        id: "piring-4",
        title: "Buah-buahan: pembuka jalan",
        body: "Buah-buahan adalah sumber Vitamin C yang jadi pembuka jalan zat besi masuk ke darah. Konsumsi bareng menu utama — bukan sekadar penutup. Contoh: jeruk, jambu, mangga, tomat, pepaya, strawberry.",
      },
    ],
  },
];

export function getCategory(slug: string): FlashcardCategory | undefined {
  return CATEGORIES.find((c) => c.slug === slug);
}

// Flat lookup
export const FLASHCARDS: (Flashcard & { category: string })[] =
  CATEGORIES.flatMap((c) => c.cards.map((card) => ({ ...card, category: c.slug })));

export const FLASHCARDS_BY_ID: Record<
  string,
  Flashcard & { category: string }
> = FLASHCARDS.reduce(
  (acc, f) => {
    acc[f.id] = f;
    return acc;
  },
  {} as Record<string, Flashcard & { category: string }>
);
