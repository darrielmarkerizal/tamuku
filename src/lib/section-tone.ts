/**
 * Warna per bagian aplikasi.
 *
 * Sebelumnya tiap layar memakai kombinasi pink+kuning+mint yang sama persis,
 * jadi berpindah tab tidak terasa berpindah tempat. Satu warna khas per tab
 * bikin navigasi terasa spasial — mata langsung tahu "ini halaman edukasi"
 * sebelum sempat membaca judulnya.
 */

export type SectionKey = "beranda" | "kalender" | "edukasi" | "profil";

export interface SectionTone {
  /** Latar tile aktif di bottom nav dan chip judul halaman. */
  surface: string;
  /** Warna teks aksen untuk judul & tautan di halaman itu. */
  accent: string;
  /** Latar lembut untuk hover / area pendukung. */
  soft: string;
}

export const SECTION_TONE: Record<SectionKey, SectionTone> = {
  beranda: {
    surface: "bg-pink-soft",
    accent: "text-primary-strong",
    soft: "bg-pink-cream",
  },
  kalender: {
    surface: "bg-accent-peach",
    accent: "text-primary-strong",
    soft: "bg-pink-tint",
  },
  edukasi: {
    surface: "bg-accent-mint",
    accent: "text-success",
    soft: "bg-pink-tint",
  },
  profil: {
    surface: "bg-accent-yellow",
    accent: "text-ink",
    soft: "bg-pink-cream",
  },
};

/** Tab mana yang sedang aktif untuk sebuah pathname. */
export function sectionForPath(pathname: string): SectionKey {
  if (pathname.startsWith("/kalender")) return "kalender";
  if (pathname.startsWith("/edukasi")) return "edukasi";
  if (pathname.startsWith("/profil")) return "profil";
  // /ttd dan /jurnal adalah turunan dari beranda — keduanya dibuka dari sana.
  return "beranda";
}
