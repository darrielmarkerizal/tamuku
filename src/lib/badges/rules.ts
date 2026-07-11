import {
  Award,
  Footprints,
  NotebookPen,
  RefreshCw,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { addDays, daysBetween, today } from "@/lib/date";

export interface UserSnapshot {
  ttdLogs: { log_date: Date }[];
  periods: { start_date: Date; end_date: Date | null }[];
  journals: { log_date: Date }[];
  streak_current: number;
}

export interface BadgeMeta {
  slug: string;
  name: string;
  description: string;
  Icon: LucideIcon;
  bg: string;
  iconColor: string;
  evaluate(s: UserSnapshot): boolean;
}

export const BADGES: BadgeMeta[] = [
  {
    slug: "first_step",
    name: "LANGKAH AWAL",
    description: "TTD pertama tercatat.",
    Icon: Footprints,
    bg: "bg-accent-mint",
    iconColor: "text-success",
    evaluate: (s) => s.ttdLogs.length >= 1,
  },
  {
    slug: "iron_girl",
    name: "IRON GIRL",
    description: "4 minggu berturut TTD mingguan tidak terlewat.",
    Icon: Award,
    bg: "bg-pink-soft",
    iconColor: "text-primary-strong",
    evaluate: (s) => s.streak_current >= 4,
  },
  {
    slug: "cycle_sync",
    name: "CYCLE SYNC",
    description: "3 siklus haid tercatat lengkap (mulai + selesai).",
    Icon: RefreshCw,
    bg: "bg-accent-yellow",
    iconColor: "text-ink",
    evaluate: (s) => s.periods.filter((p) => p.end_date !== null).length >= 3,
  },
  {
    slug: "journal_keeper",
    name: "PENULIS SETIA",
    description: "14 entri jurnal dalam 30 hari.",
    Icon: NotebookPen,
    bg: "bg-pink-cream",
    iconColor: "text-primary-strong",
    evaluate: (s) => {
      const cutoff = addDays(today(), -30);
      const recent = s.journals.filter((j) => j.log_date >= cutoff);
      return recent.length >= 14;
    },
  },
  {
    slug: "comeback",
    name: "BANGKIT KEMBALI",
    description: "Kembali patuh 2 minggu setelah sempat terlewat.",
    Icon: Sparkles,
    bg: "bg-accent-peach",
    iconColor: "text-primary-strong",
    evaluate: (s) => {
      // Heuristik: current streak ≥2 dan ada gap ≥7 hari di ttdLogs
      if (s.streak_current < 2) return false;
      if (s.ttdLogs.length < 3) return false;
      const sorted = s.ttdLogs
        .map((l) => l.log_date)
        .sort((a, b) => a.getTime() - b.getTime());
      for (let i = 1; i < sorted.length; i++) {
        const gap = daysBetween(sorted[i - 1], sorted[i]);
        if (gap >= 7) return true;
      }
      return false;
    },
  },
];

export const BADGE_BY_SLUG: Record<string, BadgeMeta> = BADGES.reduce(
  (acc, b) => {
    acc[b.slug] = b;
    return acc;
  },
  {} as Record<string, BadgeMeta>
);
