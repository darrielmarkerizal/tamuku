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

export function today(): Date {
  const t = startOfToday();
  return new Date(Date.UTC(t.getFullYear(), t.getMonth(), t.getDate()));
}

export function addDays(date: Date, days: number): Date {
  return addDaysFn(date, days);
}

export function daysBetween(a: Date, b: Date): number {
  return differenceInCalendarDays(b, a);
}

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

export function formatShort(date: Date): string {
  return `${date.getUTCDate()} ${MONTH_SHORT[date.getUTCMonth()]}`;
}

export function formatLong(date: Date): string {
  return `${date.getUTCDate()} ${MONTH_LONG[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function formatMonthYear(date: Date): string {
  return `${MONTH_LONG[date.getUTCMonth()]} ${date.getUTCFullYear()}`;
}

export function formatDayName(date: Date): string {
  return DAY_LONG[date.getUTCDay()];
}

export function formatDayShort(date: Date): string {
  return DAY_SHORT[date.getUTCDay()];
}

export function formatTime(hour: number, minute: number): string {
  const h = String(hour).padStart(2, "0");
  const m = String(minute).padStart(2, "0");
  return `${h}:${m}`;
}

export function isoWeek(date: Date): string {
  return format(date, "RRRR-'W'II", { locale: id });
}

export function startOfWeekMon(date: Date): Date {
  return startOfWeek(date, { weekStartsOn: 1 });
}

export function firstDayOfMonth(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

export function lastDayOfMonth(date: Date): Date {
  return endOfMonth(date);
}

export function dayOfWeek(date: Date): number {
  return date.getUTCDay();
}

export function dayOfWeekMon(date: Date): number {
  return (date.getUTCDay() + 6) % 7;
}

export function isSameLocalDay(a: Date, b: Date): boolean {
  return toIsoDate(a) === toIsoDate(b);
}

export function isBeforeDay(a: Date, b: Date): boolean {
  return toIsoDate(a) < toIsoDate(b);
}

export function isAfterDay(a: Date, b: Date): boolean {
  return toIsoDate(a) > toIsoDate(b);
}
