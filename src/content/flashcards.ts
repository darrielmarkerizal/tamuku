import {
  Apple,
  Droplet,
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
    slug: "manfaat-ttd",
    label: "MANFAAT TTD",
    description: "Kenapa minum TTD penting buat kamu.",
    Icon: HeartPulse,
    tone: "bg-pink-soft",
    cards: [
      {
        id: "manfaat-1",
        title: "Kenapa harus minum TTD?",
        body: "Tablet Tambah Darah (TTD) bantu tubuhmu bikin sel darah merah. Saat haid kamu kehilangan darah, jadi penting buat ganti zat besinya biar ga gampang capek dan pusing.",
      },
      {
        id: "manfaat-2",
        title: "Cegah anemia sejak remaja",
        body: "Anemia bikin kamu lemas, susah fokus, dan gampang sakit. Minum TTD rutin sejak SMP itu investasi penting biar masa depanmu sehat dan ga gampang lelah.",
      },
      {
        id: "manfaat-3",
        title: "TTD = fokus belajar maksimal",
        body: "Otak kamu butuh oksigen yang dibawa sel darah merah. Cukup zat besi = kamu lebih fokus di kelas, ingatannya tajem, dan ga ngantuk pas ulangan.",
      },
      {
        id: "manfaat-4",
        title: "Aman buat siswi SMP",
        body: "TTD yang diberikan sekolah/UKS sudah diatur Kemenkes. Dosisnya pas untuk remaja putri. Efek samping ringan kayak mual biasanya hilang dalam beberapa hari.",
      },
      {
        id: "manfaat-5",
        title: "1 minggu sekali = cukup",
        body: "Kondisi normal, kamu cukup minum 1 tablet seminggu. Pas haid baru jadi setiap hari. Aplikasi Tamuku otomatis atur jadwalnya untukmu, tinggal klik aja.",
      },
    ],
  },
  {
    slug: "makanan-penambah-darah",
    label: "MAKANAN PENAMBAH DARAH",
    description: "Makanan sehari-hari yang bantu kerja TTD.",
    Icon: Apple,
    tone: "bg-accent-mint",
    cards: [
      {
        id: "makanan-1",
        title: "Bayam si sumber zat besi",
        body: "Sayuran hijau gelap kayak bayam, kangkung, dan daun singkong itu kaya zat besi nabati. Tumis bentar pakai bawang putih, enak banget dan murah meriah!",
      },
      {
        id: "makanan-2",
        title: "Tempe & tahu jagoannya",
        body: "Tempe dan tahu bukan cuma murah, tapi penuh protein dan zat besi. Kombinasikan dengan nasi dan sayur — itu menu lengkap penambah darah ala Indonesia.",
      },
      {
        id: "makanan-3",
        title: "Daging merah & hati",
        body: "Daging sapi, ayam, atau hati ayam mengandung zat besi yang gampang diserap tubuh. Ga harus tiap hari, 1-2x seminggu sudah bantu banget.",
      },
      {
        id: "makanan-4",
        title: "Vitamin C teman terbaik",
        body: "Jeruk, jambu, mangga, atau tomat bantu tubuh nyerap zat besi lebih banyak. Coba minum jus jeruk setelah makan sayur — kombo ampuh!",
      },
      {
        id: "makanan-5",
        title: "Hindari teh saat makan",
        body: "Teh dan kopi bisa bikin penyerapan zat besi terganggu. Kalau mau minum, tunggu 1-2 jam setelah makan. Air putih tetep paling oke.",
      },
    ],
  },
  {
    slug: "mitos-fakta-haid",
    label: "MITOS & FAKTA HAID",
    description: "Cek dulu yuk, mana yang bener mana yang mitos.",
    Icon: Sparkles,
    tone: "bg-accent-yellow",
    cards: [
      {
        id: "mitos-1",
        title: "Mitos: ga boleh keramas saat haid",
        body: "FAKTA: keramas saat haid AMAN dan justru disarankan biar tetep bersih. Air ga akan masuk ke rahim, jadi tenang aja. Yang penting jaga kebersihan tubuh.",
      },
      {
        id: "mitos-2",
        title: "Mitos: olahraga bikin haid berhenti",
        body: "FAKTA: olahraga ringan saat haid justru bantu kurangi kram. Jalan santai, stretching, atau yoga pelan itu oke. Yang penting dengerin tubuhmu, jangan dipaksa.",
      },
      {
        id: "mitos-3",
        title: "Siklus 21-35 hari itu normal",
        body: "Siklus haid normal panjangnya antara 21-35 hari. Di awal masa remaja, siklus sering belum teratur — itu wajar dan biasanya stabil setelah 2-3 tahun pertama haid.",
      },
      {
        id: "mitos-4",
        title: "Mitos: makan nanas bikin keguguran",
        body: "FAKTA: makan nanas dalam porsi wajar AMAN buat siswi SMP. Mitos ini biasanya soal kehamilan dan itupun ga ada bukti ilmiahnya. Tetep nikmati buah favoritmu!",
      },
      {
        id: "mitos-5",
        title: "Telat haid = wajar kadang-kadang",
        body: "Stres ulangan, kurang tidur, atau perubahan berat badan bisa bikin haid telat. Kalau lewat 3 bulan ga haid, baru deh tanya ke orang tua atau ke UKS sekolah.",
      },
    ],
  },
  {
    slug: "kebersihan-haid",
    label: "KEBERSIHAN HAID",
    description: "Tips simpel jaga kebersihan biar tetep nyaman.",
    Icon: Droplet,
    tone: "bg-pink-cream",
    cards: [
      {
        id: "bersih-1",
        title: "Ganti pembalut 3-4 jam sekali",
        body: "Walaupun masih kering, pembalut sebaiknya diganti tiap 3-4 jam biar ga jadi sarang bakteri. Bawa stok di tas, jangan malu — semua siswi haid kok.",
      },
      {
        id: "bersih-2",
        title: "Cuci tangan sebelum & sesudah",
        body: "Selalu cuci tangan pakai sabun sebelum dan sesudah ganti pembalut. Ini langkah simpel yang cegah infeksi dan jaga area kewanitaan tetap sehat.",
      },
      {
        id: "bersih-3",
        title: "Bersihkan dari depan ke belakang",
        body: "Pas cebok, selalu dari arah depan ke belakang. Ini cegah bakteri dari anus masuk ke area kewanitaan. Pakai air bersih saja, ga perlu sabun parfum.",
      },
      {
        id: "bersih-4",
        title: "Pilih celana dalam katun",
        body: "Bahan katun lebih nyerap keringat dan ga bikin lembab. Hindari celana dalam ketat atau bahan sintetis pas haid. Ganti minimal 2x sehari.",
      },
      {
        id: "bersih-5",
        title: "Buang pembalut dengan rapi",
        body: "Bungkus pembalut bekas pake kertas atau plastik kecil sebelum dibuang ke tempat sampah. JANGAN dibuang ke kloset — bisa bikin mampet!",
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
