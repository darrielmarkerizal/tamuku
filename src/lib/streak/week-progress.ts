import { addDays, startOfWeekMon, today, toIsoDate } from "@/lib/date";
import { isMenstruationActive, type PeriodEntry } from "@/lib/period/sma";
import type { TtdLogEntry } from "./engine";

export type DayStatus =

  | "done"
  | "missed"
  | "due"
  | "upcoming"
  | "rest";

export interface WeekDay {
  date: Date;
  iso: string;

  index: number;
  status: DayStatus;
  menstruating: boolean;
}

export interface WeekProgress {
  days: WeekDay[];

  done: number;

  required: number;

  onTrack: boolean;

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

  const weeklyDayIso = raw[(weeklyDay + 6) % 7]?.iso ?? null;
  const weeklySatisfied = raw.some((d) => logged.has(d.iso));

  const days: WeekDay[] = raw.map((d) => {
    const isPast = d.iso < refIso;
    const isToday = d.iso === refIso;
    const isWeeklySlot = d.iso === weeklyDayIso;
    const required = isWeeklySlot && !weeklySatisfied;

    let status: DayStatus;
    if (logged.has(d.iso)) status = "done";
    else if (!required) status = "rest";
    else if (isPast) status = "missed";
    else if (isToday) status = "due";
    else status = "upcoming";

    return { ...d, status };
  });

  const weeklySlotDue = weeklyDayIso !== null && weeklyDayIso <= refIso;
  const required = weeklySlotDue ? 1 : 0;
  const done = weeklySatisfied ? 1 : 0;

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
