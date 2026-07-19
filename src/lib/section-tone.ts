export type SectionKey = "beranda" | "kalender" | "edukasi" | "profil";

export interface SectionTone {
  surface: string;

  accent: string;

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

export function sectionForPath(pathname: string): SectionKey {
  if (pathname.startsWith("/kalender")) return "kalender";
  if (pathname.startsWith("/edukasi")) return "edukasi";
  if (pathname.startsWith("/profil")) return "profil";

  return "beranda";
}
