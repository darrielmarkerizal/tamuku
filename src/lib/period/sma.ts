import { addDays, daysBetween } from "@/lib/date";

const MIN_CYCLE = 21;
const MAX_CYCLE = 35;
const DEFAULT_CYCLE = 28;
const SMA_WINDOW = 3;

export interface PeriodEntry {
  start_date: Date;
  end_date: Date | null;
}

export function predictNextPeriod(logs: PeriodEntry[]): {
  avgCycleLength: number;
  nextStart: Date | null;
} {
  if (logs.length === 0) {
    return { avgCycleLength: DEFAULT_CYCLE, nextStart: null };
  }

  const last = logs[logs.length - 1];
  const cycleLengths: number[] = [];

  for (let i = 1; i < logs.length; i++) {
    const cur = logs[i].start_date;
    const prev = logs[i - 1].start_date;
    const len = daysBetween(prev, cur);
    if (len >= MIN_CYCLE && len <= MAX_CYCLE) cycleLengths.push(len);
  }

  const window = cycleLengths.slice(-SMA_WINDOW);
  const avg =
    window.length === 0
      ? DEFAULT_CYCLE
      : Math.round(window.reduce((s, n) => s + n, 0) / window.length);

  return {
    avgCycleLength: avg,
    nextStart: addDays(last.start_date, avg),
  };
}

export function calcCycleLength(
  newStart: Date,
  prevStart: Date | null
): number | null {
  if (!prevStart) return null;
  const len = daysBetween(prevStart, newStart);
  return len > 0 ? len : null;
}

export function isMenstruationActive(
  logs: PeriodEntry[],
  today: Date
): boolean {
  for (const log of logs) {
    const end = log.end_date ?? addDays(log.start_date, 10);
    if (log.start_date <= today && today <= end) return true;
  }
  return false;
}
