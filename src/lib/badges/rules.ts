import {
  Award,
  BookOpen,
  CalendarCheck,
  Crown,
  Flame,
  Footprints,
  GraduationCap,
  Heart,
  NotebookPen,
  Pill,
  RefreshCw,
  Sparkles,
  Star,
  Trophy,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { addDays, daysBetween, today } from "@/lib/date";
import type { MascotAccessory } from "@/components/mascot";

export interface UserSnapshot {
  ttdLogs: { log_date: Date }[];
  periods: { start_date: Date; end_date: Date | null }[];

  journals: { log_date: Date }[];

  journalsTotal: number;

  flashcardsSeen: number;

  flashcardsTotal: number;
  streak_current: number;
  streak_longest: number;
}

export interface BadgeMeta {
  slug: string;
  name: string;
  description: string;
  Icon: LucideIcon;
  bg: string;
  iconColor: string;

  target: number;

  unit: string;

  progress: (s: UserSnapshot) => number;

  accessory?: MascotAccessory;
}

function completedCycles(s: UserSnapshot): number {
  return s.periods.filter((p) => p.end_date !== null).length;
}

export const BADGES: BadgeMeta[] = [
  {
    slug: "first_step",
    name: "LANGKAH AWAL",
    description: "TTD pertama tercatat.",
    Icon: Footprints,
    bg: "bg-accent-mint",
    iconColor: "text-success",
    target: 1,
    unit: "TTD",
    progress: (s) => s.ttdLogs.length,
  },
  {
    slug: "minggu_pertama",
    name: "MINGGU PERTAMA",
    description: "Satu minggu penuh tanpa target terlewat.",
    Icon: Star,
    bg: "bg-accent-yellow",
    iconColor: "text-ink",
    target: 1,
    unit: "minggu",
    progress: (s) => s.streak_longest,

    accessory: "pita",
  },
  {
    slug: "sepuluh_pil",
    name: "SEPULUH PIL",
    description: "10 TTD tercatat.",
    Icon: Pill,
    bg: "bg-pink-soft",
    iconColor: "text-primary-strong",
    target: 10,
    unit: "TTD",
    progress: (s) => s.ttdLogs.length,
  },
  {
    slug: "iron_girl",
    name: "IRON GIRL",
    description: "4 minggu berturut tanpa target terlewat.",
    Icon: Award,
    bg: "bg-pink-soft",
    iconColor: "text-primary-strong",
    target: 4,
    unit: "minggu",
    progress: (s) => s.streak_longest,
  },
  {
    slug: "rutin_sebulan",
    name: "RUTIN SEBULAN",
    description: "8 TTD tercatat dalam 30 hari terakhir.",
    Icon: CalendarCheck,
    bg: "bg-accent-mint",
    iconColor: "text-success",
    target: 8,
    unit: "TTD",
    progress: (s) => {
      const cutoff = addDays(today(), -30);
      return s.ttdLogs.filter((l) => l.log_date >= cutoff).length;
    },
  },
  {
    slug: "lima_puluh_pil",
    name: "LIMA PULUH",
    description: "50 TTD tercatat. Konsisten banget.",
    Icon: Trophy,
    bg: "bg-accent-yellow",
    iconColor: "text-ink",
    target: 50,
    unit: "TTD",
    progress: (s) => s.ttdLogs.length,
  },
  {
    slug: "besi_baja",
    name: "BESI BAJA",
    description: "12 minggu berturut. Rekor sejati.",
    Icon: Crown,
    bg: "bg-accent-yellow",
    iconColor: "text-primary-strong",
    target: 12,
    unit: "minggu",
    progress: (s) => s.streak_longest,
    accessory: "mahkota",
  },
  {
    slug: "cycle_sync",
    name: "CYCLE SYNC",
    description: "3 siklus tercatat lengkap (mulai + selesai).",
    Icon: RefreshCw,
    bg: "bg-accent-yellow",
    iconColor: "text-ink",
    target: 3,
    unit: "siklus",
    progress: completedCycles,
    accessory: "topi",
  },
  {
    slug: "cycle_master",
    name: "KENAL BADAN",
    description: "6 siklus tercatat lengkap.",
    Icon: Heart,
    bg: "bg-pink-cream",
    iconColor: "text-primary-strong",
    target: 6,
    unit: "siklus",
    progress: completedCycles,
  },
  {
    slug: "journal_starter",
    name: "MULAI NULIS",
    description: "3 entri jurnal pertama.",
    Icon: NotebookPen,
    bg: "bg-pink-cream",
    iconColor: "text-primary-strong",
    target: 3,
    unit: "entri",
    progress: (s) => s.journalsTotal,
  },
  {
    slug: "journal_keeper",
    name: "PENULIS SETIA",
    description: "14 entri jurnal dalam 30 hari.",
    Icon: NotebookPen,
    bg: "bg-pink-cream",
    iconColor: "text-primary-strong",
    target: 14,
    unit: "entri",
    progress: (s) => {
      const cutoff = addDays(today(), -30);
      return s.journals.filter((j) => j.log_date >= cutoff).length;
    },
    accessory: "headphone",
  },
  {
    slug: "journal_legend",
    name: "BUKU HARIAN",
    description: "60 entri jurnal sepanjang waktu.",
    Icon: BookOpen,
    bg: "bg-accent-peach",
    iconColor: "text-primary-strong",
    target: 60,
    unit: "entri",
    progress: (s) => s.journalsTotal,
  },
  {
    slug: "kutu_buku",
    name: "KUTU BUKU",
    description: "10 kartu edukasi dibaca.",
    Icon: GraduationCap,
    bg: "bg-accent-mint",
    iconColor: "text-success",
    target: 10,
    unit: "kartu",
    progress: (s) => s.flashcardsSeen,
    accessory: "kacamata",
  },
  {
    slug: "tuntas_belajar",
    name: "TUNTAS BELAJAR",
    description: "Semua kartu edukasi sudah dibaca.",
    Icon: Zap,
    bg: "bg-accent-mint",
    iconColor: "text-success",

    target: 1,
    unit: "kartu",
    progress: (s) =>
      s.flashcardsTotal > 0 && s.flashcardsSeen >= s.flashcardsTotal ? 1 : 0,
  },
  {
    slug: "comeback",
    name: "BANGKIT KEMBALI",
    description: "Kembali rutin setelah sempat terlewat.",
    Icon: Sparkles,
    bg: "bg-accent-peach",
    iconColor: "text-primary-strong",
    target: 1,
    unit: "",
    progress: (s) => {
      if (s.streak_current < 2) return 0;
      if (s.ttdLogs.length < 3) return 0;
      const sorted = s.ttdLogs
        .map((l) => l.log_date)
        .sort((a, b) => a.getTime() - b.getTime());
      for (let i = 1; i < sorted.length; i++) {
        if (daysBetween(sorted[i - 1], sorted[i]) >= 7) return 1;
      }
      return 0;
    },
  },
  {
    slug: "api_abadi",
    name: "API ABADI",
    description: "26 minggu berturut. Setengah tahun.",
    Icon: Flame,
    bg: "bg-primary",
    iconColor: "text-white",
    target: 26,
    unit: "minggu",
    progress: (s) => s.streak_longest,
  },
];

export const BADGE_BY_SLUG: Record<string, BadgeMeta> = BADGES.reduce(
  (acc, b) => {
    acc[b.slug] = b;
    return acc;
  },
  {} as Record<string, BadgeMeta>
);

export function isEarned(badge: BadgeMeta, snapshot: UserSnapshot): boolean {
  return badge.progress(snapshot) >= badge.target;
}

export function accessoryUnlockedBy(accessory: string): string | null {
  return BADGES.find((b) => b.accessory === accessory)?.slug ?? null;
}

export function unlockedAccessories(ownedBadges: string[]): BadgeMeta[] {
  const owned = new Set(ownedBadges);
  return BADGES.filter((b) => b.accessory && owned.has(b.slug));
}
