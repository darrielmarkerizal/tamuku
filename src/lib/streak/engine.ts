import {
  addDays,
  isoWeek,
  startOfWeekMon,
  today,
  toIsoDate,
} from "@/lib/date";
import { isMenstruationActive, type PeriodEntry } from "@/lib/period/sma";

export interface TtdLogEntry {
  log_date: Date;
}

export interface StreakSummary {
  current: number;
  longest: number;
  lastWeekIso: string | null; // "2026-W28" minggu terakhir yang complete
}

export function evaluateStreak(
  ttdLogs: TtdLogEntry[],
  periods: PeriodEntry[],
  weeklyDay: number,
  reference: Date = today(),

  frozenWeeks: ReadonlySet<string> = new Set()
): StreakSummary {
  if (ttdLogs.length === 0) {
    return { current: 0, longest: 0, lastWeekIso: null };
  }

  const byWeek = new Map<string, Set<string>>();
  for (const log of ttdLogs) {
    const wk = isoWeek(log.log_date);
    const dateIso = toIsoDate(log.log_date);
    const set = byWeek.get(wk) ?? new Set<string>();
    set.add(dateIso);
    byWeek.set(wk, set);
  }

  const startWeek = startOfWeekMon(reference);
  let current = 0;
  let longest = 0;
  let lastCompleteWeek: string | null = null;

  const weekIsAlreadyOver = false;
  void weekIsAlreadyOver;

  const MAX_LOOKBACK = 26;
  let streaking = true;
  for (let i = 0; i < MAX_LOOKBACK; i++) {
    const weekStart = addDays(startWeek, -i * 7);
    const wk = isoWeek(weekStart);
    const complete =
      frozenWeeks.has(wk) ||
      isWeekComplete(weekStart, byWeek.get(wk), periods, weeklyDay, reference);

    if (complete) {
      if (streaking) current++;
    } else {
      streaking = false;
    }
    if (complete && !lastCompleteWeek) lastCompleteWeek = wk;
  }

  {
    let run = 0;
    for (let i = MAX_LOOKBACK - 1; i >= 0; i--) {
      const weekStart = addDays(startWeek, -i * 7);
      const wk = isoWeek(weekStart);
      const complete =
        frozenWeeks.has(wk) ||
        isWeekComplete(weekStart, byWeek.get(wk), periods, weeklyDay, reference);
      if (complete) {
        run++;
        if (run > longest) longest = run;
      } else {
        run = 0;
      }
    }
  }

  return { current, longest, lastWeekIso: lastCompleteWeek };
}

export function isWeekComplete(
  weekStart: Date,
  loggedDates: Set<string> | undefined,
  periods: PeriodEntry[],
  weeklyDay: number,
  reference: Date
): boolean {
  const refIso = toIsoDate(reference);

  const daysInWeek: { date: Date; iso: string; menstruating: boolean }[] = [];
  for (let d = 0; d < 7; d++) {
    const date = addDays(weekStart, d);
    const iso = toIsoDate(date);

    if (iso > refIso) continue;
    daysInWeek.push({
      date,
      iso,
      menstruating: isMenstruationActive(periods, date),
    });
  }

  if (daysInWeek.length === 0) return false;

  const menstruatingDays = daysInWeek.filter((d) => d.menstruating);
  const nonMenstruatingDays = daysInWeek.filter((d) => !d.menstruating);

  for (const d of menstruatingDays) {
    if (!loggedDates?.has(d.iso)) return false;
  }

  if (nonMenstruatingDays.length > 0) {
    const weeklyDayDate = addDays(weekStart, (weeklyDay + 6) % 7);

    const monBasedIdx = (weeklyDay + 6) % 7;
    const targetDate = addDays(weekStart, monBasedIdx);
    const targetIso = toIsoDate(targetDate);

    if (targetIso <= refIso) {
      if (!loggedDates?.has(targetIso)) {
        const anyNonMenstruatingLog = nonMenstruatingDays.some((d) =>
          loggedDates?.has(d.iso)
        );
        if (!anyNonMenstruatingLog) return false;
      }
    } else {
      const anyNonMenstruatingLog = nonMenstruatingDays.some((d) =>
        loggedDates?.has(d.iso)
      );
      if (!anyNonMenstruatingLog && targetIso <= refIso) return false;

      if (!anyNonMenstruatingLog) return false;
      void targetDate;
    }
    void weeklyDayDate;
  }

  return true;
}
