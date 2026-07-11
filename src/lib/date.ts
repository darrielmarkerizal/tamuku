import {
  addDays as addDaysFn,
  differenceInCalendarDays,
  endOfMonth,
  format,
  isAfter,
  isBefore,
  isSameDay,
  startOfMonth,
  startOfToday,
  startOfWeek,
} from "date-fns";
import { id } from "date-fns/locale";

// Konvensi:
// - Semua tanggal domain (haid, TTD, jurnal) di-simpan sebagai UTC-midnight
//   Date object. Alasan: kolom @db.Date di Postgres cuma menyimpan Y-M-D;
//   Prisma serialisasi Date pakai .toISOString() (UTC). Kalau kita simpan
//   Date local-midnight, di WITA (UTC+7) itu jadi 17:00 UTC hari sebelumnya
//   → DB simpan tanggal minus 1. Solusi: **semua Date domain = UTC midnight**.
// - Format tampilan pakai UTC methods di formatter (bukan local).
// - date-fns `format` respects local TZ, jadi kita pakai custom UTC formatter
//   untuk tanggal domain.

// ─── Parsing & serialisasi ───────────────────────────────────────────────────

export function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toIsoDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, "0");
  const d = String(date.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

// ─── Reference date ──────────────────────────────────────────────────────────

// Return UTC-midnight untuk tanggal hari ini (local).
export function today(): Date {
  const t = startOfToday(); // local midnight
  return new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
}

// ─── Arithmetic ──────────────────────────────────────────────────────────────

export function addDays(date: Date, days: number): Date {
  return addDaysFn(date, days);
}

export function daysBetween(a: Date, b: Date): number {
  return differenceInCalendarDays(b, a);
}

// ─── Format Bahasa Indonesia (UTC-safe) ──────────────────────────────────────
// Alasan pakai UTC formatter: Date objek domain kita UTC-midnight. Kalau pakai
// date-fns.format() (default local TZ), di server prod TZ non-WITA hasil bisa
// off-by-one. Formatter ini pakai UTC methods sehingga stabil.

const MONTH_LONG = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
const DAY_LONG = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const DAY_SHORT = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

// "5 Jul"
export function formatShort(date: Date): string {
  return `${date.getUTCDate()} ${MONTH_SHORT[date.getUTCMonth()]}`;
}

// "5 Juli 2026"
export function formatLong(date: Date): string {
  return `${date.getUTCDate()} ${MONTH_LONG[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

// "Juli 2026"
export function formatMonthYear(date: Date): string {
  return `${MONTH_LONG[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

// "Sabtu"
export function formatDayName(date: Date): string {
  return DAY_LONG[date.getUTCDay()];
}

// "Sab"
export function formatDayShort(date: Date): string {
  return DAY_SHORT[date.getUTCDay()];
}

// "19:00"
export function formatTime(hour: number, minute: number): string {
  const h = String(hour).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  return `${h}:${m}`;
}

// "2026-W28" — pakai date-fns format karena non-domain (calc based)
export function isoWeek(date: Date): string {
  return format(date, "RRRR-'W'II", { locale: id });
}

// ─── Boundaries ──────────────────────────────────────────────────────────────

export function startOfWeekMon(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

// Return UTC-midnight for the first of the month
export function firstDayOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function lastDayOfMonth(date: Date): Date {
  return endOfMonth(date);
}

// Weekday: 0=Minggu ... 6=Sabtu — pakai UTC day
export function dayOfWeek(date: Date): number {
  return date.getUTCDay();
}

// Weekday Senin=0..Minggu=6 untuk grid kalender
export function dayOfWeekMon(date: Date): number {
  return (date.getUTCDay() + 6) % 7;
}

// ─── Perbandingan ────────────────────────────────────────────────────────────

// Sama-hari — bandingkan pakai ISO string biar timezone-safe
export function isSameLocalDay(a: Date, b: Date): boolean {
  return toIsoDate(a) === toIsoDate(b);
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return toIsoDate(a) < toIsoDate(b);
}

export function isAfterDay(a: Date, b: Date): boolean {
  return toIsoDate(a) > toIsoDate(b);
}
