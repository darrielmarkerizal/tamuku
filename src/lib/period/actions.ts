"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/current-user";
import {
  daysBetween,
  isBeforeDay,
  parseIsoDate,
  today,
} from "@/lib/date";
import { calcCycleLength } from "./sma";

export type PeriodActionResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Tandai haid dimulai hari ini. Tolak kalau sudah ada log terbuka
 * (invariant: max 1 log dengan end_date = null per user).
 */
export async function logPeriodStartAction(): Promise<PeriodActionResult> {
  const user = await requireUser();
  const todayDate = today();

  const openLog = await db.menstruationLog.findFirst({
    where: { userId: user.id, end_date: null },
    select: { id: true, start_date: true },
  });
  if (openLog) {
    return {
      ok: false,
      error: "Ada haid yang belum ditandai selesai. Tandai selesai dulu ya.",
    };
  }

  const lastClosed = await db.menstruationLog.findFirst({
    where: { userId: user.id, end_date: { not: null } },
    orderBy: { start_date: "desc" },
    select: { start_date: true },
  });

  const cycleLength = calcCycleLength(todayDate, lastClosed?.start_date ?? null);

  await db.menstruationLog.create({
    data: {
      userId: user.id,
      start_date: todayDate,
      cycle_length: cycleLength ?? undefined,
      source: "MANUAL",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/kalender");
  return { ok: true };
}

// ─── Manual backfill ─────────────────────────────────────────────────────────

const manualLogSchema = z
  .object({
    start_iso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    end_iso: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .optional()
      .or(z.literal("")),
  })
  .refine(
    (v) =>
      !v.end_iso ||
      parseIsoDate(v.end_iso).getTime() >= parseIsoDate(v.start_iso).getTime(),
    { message: "Tanggal selesai nggak bisa sebelum tanggal mulai." }
  );

export async function manualLogPeriodAction(
  formData: FormData
): Promise<PeriodActionResult> {
  const user = await requireUser();
  const parsed = manualLogSchema.safeParse({
    start_iso: formData.get("start_iso") ?? "",
    end_iso: formData.get("end_iso") ?? "",
  });
  if (!parsed.success) {
    return {
      ok: false,
      error: parsed.error.issues[0]?.message ?? "Input tidak valid.",
    };
  }

  const start = parseIsoDate(parsed.data.start_iso);
  const end = parsed.data.end_iso ? parseIsoDate(parsed.data.end_iso) : null;
  const todayDate = today();

  if (start > todayDate) {
    return { ok: false, error: "Tanggal mulai nggak boleh di masa depan." };
  }
  if (end && end > todayDate) {
    return { ok: false, error: "Tanggal selesai nggak boleh di masa depan." };
  }

  // Overlap check
  const existing = await db.menstruationLog.findMany({
    where: { userId: user.id },
    select: { start_date: true, end_date: true },
  });
  const rangeEnd = end ?? start;
  const overlaps = existing.some((e) => {
    const eEnd = e.end_date ?? e.start_date;
    return e.start_date <= rangeEnd && eEnd >= start;
  });
  if (overlaps) {
    return {
      ok: false,
      error: "Rentang bertumpuk dengan siklus yang sudah tercatat.",
    };
  }

  // Sorted logs untuk hitung cycle_length
  const sorted = existing.slice().sort(
    (a, b) => a.start_date.getTime() - b.start_date.getTime()
  );
  const prev = sorted
    .slice()
    .reverse()
    .find((e) => e.start_date < start);
  const cycleLength = prev ? calcCycleLength(start, prev.start_date) : null;
  const periodLength = end ? daysBetween(start, end) + 1 : null;

  await db.menstruationLog.create({
    data: {
      userId: user.id,
      start_date: start,
      end_date: end,
      cycle_length: cycleLength ?? undefined,
      period_length: periodLength ?? undefined,
      source: "MANUAL",
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/kalender");
  return { ok: true };
}

/**
 * Tandai haid saat ini selesai hari ini.
 */
export async function logPeriodEndAction(): Promise<PeriodActionResult> {
  const user = await requireUser();
  const todayDate = today();

  const openLog = await db.menstruationLog.findFirst({
    where: { userId: user.id, end_date: null },
    orderBy: { start_date: "desc" },
    select: { id: true, start_date: true },
  });
  if (!openLog) {
    return { ok: false, error: "Nggak ada haid yang lagi berlangsung." };
  }

  if (isBeforeDay(todayDate, openLog.start_date)) {
    return {
      ok: false,
      error: "Tanggal selesai nggak bisa sebelum mulai.",
    };
  }

  const periodLength = daysBetween(openLog.start_date, todayDate) + 1;

  await db.menstruationLog.update({
    where: { id: openLog.id },
    data: {
      end_date: todayDate,
      period_length: periodLength,
    },
  });

  revalidatePath("/dashboard");
  revalidatePath("/kalender");
  return { ok: true };
}
