import { addDays, startOfWeekMon, today, toIsoDate } from "@/lib/date";
import { isMenstruationActive, type PeriodEntry } from "@/lib/period/sma";
import type { TtdLogEntry } from "./engine";

/**
 * Progres TTD di dalam satu minggu berjalan.
 *
 * Kenapa perlu: streak dihitung per minggu ISO, jadi angkanya tidak berubah
 * selama 7 hari. Buat remaja itu terlalu lama tanpa umpan balik — mereka buka
 * app hari Selasa dan tidak ada apa pun yang bergerak sejak Senin.
 * Fungsi ini memecah minggu jadi 7 status harian supaya selalu ada yang
 * kelihatan maju, tanpa mengubah aturan medis (TTD tetap mingguan di luar haid).
 */

export type DayStatus =
  /** Sudah minum TTD di hari ini. */
  | "done"
  /** Hari wajib yang sudah lewat tapi terlewat. */
  | "missed"
  /** Hari wajib, hari ini, belum dilakukan. */
  | "due"
  /** Hari wajib yang masih di masa depan. */
  | "upcoming"
  /** Bukan hari wajib. */
  | "rest";

export interface WeekDay {
  date: Date;
  iso: string;
  /** Senin=0 … Minggu=6 */
  index: number;
  status: DayStatus;
  menstruating: boolean;
}

export interface WeekProgress {
  days: WeekDay[];
  /** Target yang sudah terpenuhi sejauh ini. */
  done: number;
  /** Total target sampai hari ini (tidak menghitung hari yang belum datang). */
  required: number;
  /** Semua target sampai hari ini terpenuhi. */
  onTrack: boolean;
  /** Sisa target minggu ini termasuk hari yang belum datang. */
  remaining: number;
}

export function computeWeekProgress(
  ttdLogs: TtdLogEntry[],
  periods: PeriodEntry[],
  weeklyDay: number,
  reference: Date = today()
): WeekProgress {
  const logged = new Set(ttdLogs.map((l) => toIsoDate(l.log_date)));
  const refIso = toIsoDate(reference);
  const weekStart = startOfWeekMon(reference);

  const raw = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(weekStart, i);
    return {
      date,
      iso: toIsoDate(date),
      index: i,
      menstruating: isMenstruationActive(periods, date),
    };
  });

  const nonMenstruating = raw.filter((d) => !d.menstruating);
  // Dosis mingguan boleh diminum di hari non-haid mana pun — engine streak juga
  // longgar soal ini. Jadi kalau sudah terpenuhi di hari lain, hari jadwalnya
  // tidak lagi dihitung terlewat.
  const weeklySatisfied = nonMenstruating.some((d) => logged.has(d.iso));
  const weeklyDayIso = raw[(weeklyDay + 6) % 7]?.iso ?? null;

  const days: WeekDay[] = raw.map((d) => {
    const isPast = d.iso < refIso;
    const isToday = d.iso === refIso;
    const isWeeklySlot = d.iso === weeklyDayIso && nonMenstruating.length > 0;
    const required = d.menstruating || (isWeeklySlot && !weeklySatisfied);

    let status: DayStatus;
    if (logged.has(d.iso)) status = "done";
    else if (!required) status = "rest";
    else if (isPast) status = "missed";
    else if (isToday) status = "due";
    else status = "upcoming";

    return { ...d, status };
  });

  // Hitung target hanya sampai hari ini — kalau hari Rabu, sisa minggu belum
  // boleh dianggap "gagal", cuma belum datang.
  const menstruatingSoFar = raw.filter(
    (d) => d.menstruating && d.iso <= refIso
  );
  const weeklySlotDue = weeklyDayIso !== null && weeklyDayIso <= refIso;

  const required =
    menstruatingSoFar.length +
    (nonMenstruating.length > 0 && weeklySlotDue ? 1 : 0);
  const done =
    menstruatingSoFar.filter((d) => logged.has(d.iso)).length +
    (nonMenstruating.length > 0 && weeklySlotDue && weeklySatisfied ? 1 : 0);

  const remaining = days.filter(
    (d) => d.status === "due" || d.status === "upcoming"
  ).length;

  return {
    days,
    done,
    required,
    onTrack: days.every((d) => d.status !== "missed"),
    remaining,
  };
}
