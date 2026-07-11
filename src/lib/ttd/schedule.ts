import { addDays } from "@/lib/date";
import { isMenstruationActive, type PeriodEntry } from "@/lib/period/sma";

/**
 * Dynamic reminder logic: harian saat haid aktif, mingguan di hari tertentu
 * di luar haid.
 *
 * @param today — tanggal referensi (UTC midnight)
 * @param periods — menstruation logs (asc by start_date)
 * @param weeklyDay — 0=Minggu ... 6=Sabtu
 */
export function shouldRemindToday(
  today: Date,
  periods: PeriodEntry[],
  weeklyDay: number
): { should: boolean; mode: "menstruation" | "weekly" | "none" } {
  if (isMenstruationActive(periods, today)) {
    return { should: true, mode: "menstruation" };
  }
  const dow = today.getDay(); // 0=Minggu..6=Sabtu, konsisten dengan weekly_day
  if (dow === weeklyDay) return { should: true, mode: "weekly" };
  return { should: false, mode: "none" };
}

/**
 * Cek apakah user sedang dalam mode haid (untuk labelling status TTD log).
 */
export function currentTtdMode(
  today: Date,
  periods: PeriodEntry[]
): "MENSTRUATION_ROUTINE" | "WEEKLY_ROUTINE" {
  return isMenstruationActive(periods, today)
    ? "MENSTRUATION_ROUTINE"
    : "WEEKLY_ROUTINE";
}

/**
 * Tanggal reminder mingguan berikutnya setelah `today`.
 */
export function nextWeeklyReminder(today: Date, weeklyDay: number): Date {
  const dow = today.getDay();
  const diff = (weeklyDay - dow + 7) % 7 || 7;
  return addDays(today, diff);
}
