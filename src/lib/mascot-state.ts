import { addDays, toIsoDate } from "@/lib/date";
import {
  isMenstruationActive,
  type PeriodEntry,
} from "@/lib/period/sma";
import type { MascotState } from "@/components/mascot";

interface TtdLog {
  log_date: Date;
}

/**
 * Hitung state maskot berdasarkan kepatuhan minum TTD 14 hari terakhir.
 * Target harian saat haid, weekly di luar → simplifikasi MVP:
 *   compliance = jumlah hari ter-log / (jumlah hari haid + max(1, jumlah minggu non-haid))
 */
export function computeMascotState(
  ttdLogs14: TtdLog[],
  periods: PeriodEntry[],
  reference: Date
): MascotState {
  const loggedIso = new Set(ttdLogs14.map((l) => toIsoDate(l.log_date)));

  let expected = 0;
  let hit = 0;
  const weeksSeen = new Set<string>();

  for (let d = 13; d >= 0; d--) {
    const date = addDays(reference, -d);
    const iso = toIsoDate(date);
    const menstruating = isMenstruationActive(periods, date);

    if (menstruating) {
      expected++;
      if (loggedIso.has(iso)) hit++;
    } else {
      // Kumpulkan per minggu ISO
      const wkKey = `${date.getUTCFullYear()}-${Math.floor(
        date.getUTCDate() / 7
      )}`;
      if (!weeksSeen.has(wkKey)) {
        expected++;
        weeksSeen.add(wkKey);
        // Check apakah ada log minimal 1 di minggu non-haid ini
        const anyLog = Array.from({ length: 7 }).some((_, offset) => {
          const dt = addDays(date, -offset);
          return loggedIso.has(toIsoDate(dt));
        });
        if (anyLog) hit++;
      }
    }
  }

  const ratio = expected === 0 ? 0 : hit / expected;
  if (ratio >= 0.9) return "vibrant";
  if (ratio >= 0.7) return "cheerful";
  if (ratio >= 0.4) return "tired";
  return "pucat";
}
