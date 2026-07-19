import { toIsoDate } from "@/lib/date";

/**
 * Copy yang berganti tiap hari.
 *
 * Kenapa deterministik (bukan Math.random): teks ini dirender di server lalu
 * di-hydrate di client. Kalau acak, server dan client bisa memilih kalimat
 * berbeda → hydration mismatch. Seed dari tanggal bikin kalimatnya stabil
 * sepanjang hari tapi berganti besoknya.
 */

// FNV-1a — cukup untuk menyebar tanggal berurutan ke indeks yang tidak berpola.
// Tanpa ini, seed sesederhana "jumlah hari" bikin kalimat berputar berurutan
// dan pola itu cepat ketahuan.
function hash(input: string): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return h >>> 0;
}

/**
 * Pilih satu baris dari `lines`, stabil untuk tanggal yang sama.
 * `salt` membedakan beberapa slot copy di hari yang sama supaya keduanya
 * tidak selalu bergerak bersamaan.
 */
export function pickLine(lines: string[], date: Date, salt = ""): string {
  if (lines.length === 0) return "";
  const seed = hash(`${toIsoDate(date)}::${salt}`);
  return lines[seed % lines.length];
}

/**
 * Putar urutan `lines` berdasarkan tanggal, isinya tetap lengkap.
 * Dipakai untuk komponen yang berganti kalimat sendiri (speech bubble Hemo):
 * urutannya beda tiap hari, tapi sama antara server dan client.
 */
export function rotateLines(lines: string[], date: Date, salt = ""): string[] {
  if (lines.length <= 1) return lines;
  const offset = hash(`${toIsoDate(date)}::${salt}`) % lines.length;
  return [...lines.slice(offset), ...lines.slice(0, offset)];
}

// ─── Sapaan dashboard ────────────────────────────────────────────────────────
// Nada: teman sebaya, bukan poster dinas kesehatan. Pendek, santai, tanpa
// tanda seru berlebihan.

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

// ─── Setelah log TTD ─────────────────────────────────────────────────────────

export const REWARD_SUBS = [
  "Hemo makin merah. Sampai besok!",
  "Tercatat. Kamu on track minggu ini.",
  "Satu lagi buat Hemo. Mantap.",
  "Aman. Nggak ada yang kelewat hari ini.",
  "Hemo seneng banget lihat ini.",
];

// ─── Kalimat Hemo (speech bubble) ────────────────────────────────────────────
// Dipisah per state supaya nadanya cocok dengan kondisi maskot.

export const HEMO_LINES: Record<string, string[]> = {
  vibrant: [
    "Aku lagi merah banget hari ini!",
    "Kita lagi kompak nih.",
    "Kamu konsisten banget, aku kagum.",
    "Energi penuh. Ayo lanjut.",
  ],
  cheerful: [
    "Lumayan nih, tinggal dijaga.",
    "Aku udah lebih baik dari minggu lalu.",
    "Dikit lagi aku merah maksimal.",
    "Kita lagi bagus. Jangan kendor.",
  ],
  tired: [
    "Aku agak capek nih…",
    "Udah lama nggak dapat TTD.",
    "Bantu aku dikit dong.",
    "Rasanya lemes, tapi masih kuat kok.",
  ],
  pucat: [
    "Aku pucat banget…",
    "Butuh TTD nih, serius.",
    "Warnaku hampir hilang…",
    "Aku nunggu kamu dari kemarin.",
  ],
};
