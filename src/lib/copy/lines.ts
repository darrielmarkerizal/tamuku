import { toIsoDate } from "@/lib/date";

function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

export function pickLine(lines: string[], date: Date, salt = ""): string {
  if (lines.length === 0) return "";
  const seed = hash(`${toIsoDate(date)}::${salt}`);
  return lines[seed % lines.length];
}

export function rotateLines(lines: string[], date: Date, salt = ""): string[] {
  if (lines.length <= 1) return lines;
  const offset = hash(`${toIsoDate(date)}::${salt}`) % lines.length;
  return [...lines.slice(offset), ...lines.slice(0, offset)];
}

export const GREETING_SUBS_IDLE = [
  "Hari ini santai aja, nggak ada jadwal TTD.",
  "Nggak ada yang perlu dikejar hari ini.",
  "Semua aman. Cek jadwal kalau penasaran.",
  "Hari kosong. Nikmatin aja.",
  "Nggak ada PR dari Hemo hari ini.",
];

export const GREETING_SUBS_TTD_DUE = [
  "Ada jadwal TTD nih. Lima detik doang.",
  "Hemo nungguin kamu minum TTD.",
  "Jangan sampai kelewat ya, sekali ini aja.",
  "Waktunya TTD. Habis itu bebas.",
  "Satu pil, terus lanjut hari kamu.",
];

export const GREETING_SUBS_MENSTRUATING = [
  "Lagi haid — TTD tiap hari biar nggak lemas.",
  "Badan lagi kerja keras. Bantu pakai TTD ya.",
  "Hari-hari ini TTD-nya harian, bukan mingguan.",
  "Jangan skip TTD, ini justru waktunya.",
  "Minum TTD hari ini biar nggak gampang pusing.",
];

export const REWARD_SUBS = [
  "Hemo makin merah. Sampai besok!",
  "Tercatat. Kamu on track minggu ini.",
  "Satu lagi buat Hemo. Mantap.",
  "Aman. Nggak ada yang kelewat hari ini.",
  "Hemo seneng banget lihat ini.",
];

export const HEMO_LINES: Record<string, string[]> = {
  vibrant: [
    "Kamu keliatan happy, aku ikut senang!",
    "Energi kamu nular ke aku nih.",
    "Hari kamu cerah, aku juga jadi merah!",
    "Seneng banget lihat kamu ceria.",
  ],
  cheerful: [
    "Adem ya hari ini. Aku nemenin.",
    "Tenang gini enak, kan?",
    "Aku di sini kalau kamu butuh cerita.",
    "Santai bareng aku aja dulu.",
  ],
  tired: [
    "Kamu keliatan capek… istirahat dulu ya.",
    "Nggak apa-apa, pelan-pelan aja.",
    "Aku temani kamu rehat sebentar.",
    "Capek itu wajar kok, jangan dipaksa.",
  ],
  pucat: [
    "Lagi berat ya? Aku di sini nemenin.",
    "Boleh kok ngerasa nggak baik-baik aja.",
    "Cerita ke jurnal aja, aku dengerin.",
    "Aku nggak ke mana-mana, tenang.",
  ],
};
