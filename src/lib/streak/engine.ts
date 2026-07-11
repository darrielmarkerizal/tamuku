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

/**
 * Evaluasi streak berbasis minggu ISO (Senin–Minggu):
 * - Minggu "complete" kalau semua target TTD di minggu itu terpenuhi.
 * - Aturan target per minggu:
 *   • Jika ada haid aktif pada minggu itu → target = harian di hari-hari haid + 1x mingguan di hari non-haid (kalau ada). Simplifikasi MVP: cukup ≥1 log di setiap hari haid + ≥1 log kalau ada hari non-haid.
 *   • Jika tidak ada haid → target = ≥1 log di weeklyDay pada minggu itu (atau minggu itu tercatat log manapun).
 * - Kalau minggu terlewat (tidak complete) → streak reset.
 * - `current` = jumlah minggu berturut yang complete berakhir di minggu berjalan (atau minggu sebelumnya kalau minggu berjalan belum selesai).
 *
 * Fungsi ini pure: cocok untuk unit test.
 */
export function evaluateStreak(
  ttdLogs: TtdLogEntry[],
  periods: PeriodEntry[],
  weeklyDay: number,
  reference: Date = today()
): StreakSummary {
  if (ttdLogs.length === 0) {
    return { current: 0, longest: 0, lastWeekIso: null };
  }

  // Peta iso week → set of iso-date yang ter-log
  const byWeek = new Map<string, Set<string>>();
  for (const log of ttdLogs) {
    const wk = isoWeek(log.log_date);
    const dateIso = toIsoDate(log.log_date);
    const set = byWeek.get(wk) ?? new Set<string>();
    set.add(dateIso);
    byWeek.set(wk, set);
  }

  // Hitung berapa minggu ke belakang yang complete secara berurut
  const startWeek = startOfWeekMon(reference);
  let current = 0;
  let longest = 0;
  let lastCompleteWeek: string | null = null;

  // Scan minggu berjalan dulu — kalau complete, ikut hitung
  const weekIsAlreadyOver = false; // minggu berjalan boleh dihitung kalau target sudah cukup
  void weekIsAlreadyOver;

  // Scan 26 minggu ke belakang (setengah tahun) — cukup untuk MVP
  const MAX_LOOKBACK = 26;
  let streaking = true;
  for (let i = 0; i < MAX_LOOKBACK; i++) {
    const weekStart = addDays(startWeek, -i * 7);
    const wk = isoWeek(weekStart);
    const complete = isWeekComplete(weekStart, byWeek.get(wk), periods, weeklyDay, reference);

    if (complete) {
      if (streaking) current++;
      // Longest: hitung run terpanjang dari data historis
      // gampangnya: track run per iterasi
    } else {
      streaking = false;
    }
    if (complete && !lastCompleteWeek) lastCompleteWeek = wk;
  }

  // Second pass: hitung longest run
  {
    let run = 0;
    for (let i = MAX_LOOKBACK - 1; i >= 0; i--) {
      const weekStart = addDays(startWeek, -i * 7);
      const wk = isoWeek(weekStart);
      const complete = isWeekComplete(weekStart, byWeek.get(wk), periods, weeklyDay, reference);
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

function isWeekComplete(
  weekStart: Date,
  loggedDates: Set<string> | undefined,
  periods: PeriodEntry[],
  weeklyDay: number,
  reference: Date
): boolean {
  const refIso = toIsoDate(reference);

  // Days in this week (Senin=0..Minggu=6)
  const daysInWeek: { date: Date; iso: string; menstruating: boolean }[] = [];
  for (let d = 0; d < 7; d++) {
    const date = addDays(weekStart, d);
    const iso = toIsoDate(date);
    // Jangan hitung hari di masa depan
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

  // Rule: setiap hari haid harus ter-log
  for (const d of menstruatingDays) {
    if (!loggedDates?.has(d.iso)) return false;
  }

  // Rule: kalau ada hari non-haid, ≥1 log di antara mereka
  //       (idealnya di weeklyDay, tapi longgar MVP: hari mana pun)
  if (nonMenstruatingDays.length > 0) {
    // Kalau weeklyDay (mis Jumat=5) sudah lewat di minggu ini
    const weeklyDayDate = addDays(weekStart, (weeklyDay + 6) % 7);
    // Cari hari dimana weeklyDay berada di minggu ini
    // ISO week starts Monday (index 0), Sunday=6
    // Convert weeklyDay (0=Sun..6=Sat) ke index Senin-based
    const monBasedIdx = (weeklyDay + 6) % 7;
    const targetDate = addDays(weekStart, monBasedIdx);
    const targetIso = toIsoDate(targetDate);

    // Kalau targetDate sudah lewat atau hari ini → wajib ter-log
    if (targetIso <= refIso) {
      if (!loggedDates?.has(targetIso)) {
        // Fallback: minimal ada 1 log di hari non-haid manapun
        const anyNonMenstruatingLog = nonMenstruatingDays.some((d) =>
          loggedDates?.has(d.iso)
        );
        if (!anyNonMenstruatingLog) return false;
      }
    } else {
      // targetDate masih di masa depan → kalau tidak ada hari non-haid yg ter-log,
      // belum bisa dianggap complete
      const anyNonMenstruatingLog = nonMenstruatingDays.some((d) =>
        loggedDates?.has(d.iso)
      );
      if (!anyNonMenstruatingLog && targetIso <= refIso) return false;
      // Kalau target masih future & tidak ada log non-haid → return false (belum complete)
      if (!anyNonMenstruatingLog) return false;
      void targetDate;
    }
    void weeklyDayDate;
  }

  return true;
}
