import { addDays } from "@/lib/date";
import { isMenstruationActive, type PeriodEntry } from "@/lib/period/sma";

export function shouldRemindToday(
  today: Date,
  periods: PeriodEntry[],
  weeklyDay: number
): { should: boolean; mode: "menstruation" | "weekly" | "none" } {
  if (isMenstruationActive(periods, today)) {
    return { should: true, mode: "menstruation" };
  }
  const dow = today.getDay();
  if (dow === weeklyDay) return { should: true, mode: "weekly" };
  return { should: false, mode: "none" };
}

export function currentTtdMode(
  today: Date,
  periods: PeriodEntry[]
): "MENSTRUATION_ROUTINE" | "WEEKLY_ROUTINE" {
  return isMenstruationActive(periods, today)
    ? "MENSTRUATION_ROUTINE"
    : "WEEKLY_ROUTINE";
}

export function nextWeeklyReminder(today: Date, weeklyDay: number): Date {
  const dow = today.getDay();
  const diff = (weeklyDay - dow + 7) % 7 || 7;
  return addDays(today, diff);
}
