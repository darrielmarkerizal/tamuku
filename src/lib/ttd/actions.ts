"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/current-user";
import {
  addDays,
  isoWeek,
  startOfWeekMon,
  today,
  toIsoDate,
} from "@/lib/date";
import { evaluateStreak, isWeekComplete } from "@/lib/streak/engine";
import { FREEZE_PER_MONTH, monthKeyOf } from "@/lib/streak/freeze";
import { pickNextForUser } from "@/lib/flashcards/pick";
import { currentTtdMode } from "./schedule";

export type TtdActionResult<T = null> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export interface LogTtdSuccess {
  flashcardIds: string[];
}

export async function logTtdAction(): Promise<
  TtdActionResult<LogTtdSuccess>
> {
  const user = await requireUser();
  const todayDate = today();

  const existing = await db.ttdLog.findUnique({
    where: {
      userId_log_date: { userId: user.id, log_date: todayDate },
    },
    select: { id: true },
  });
  if (existing) {
    return { ok: false, error: "Kamu sudah catat TTD hari ini." };
  }

  const [periods, userSeen] = await Promise.all([
    db.menstruationLog.findMany({
      where: { userId: user.id },
      select: { start_date: true, end_date: true },
      orderBy: { start_date: "asc" },
    }),
    db.user.findUnique({
      where: { id: user.id },
      select: { seen_flashcards: true },
    }),
  ]);
  const status = currentTtdMode(todayDate, periods);
  const flashcardIds = pickNextForUser(userSeen?.seen_flashcards ?? [], 2);

  await db.$transaction(async (tx) => {
    await tx.ttdLog.create({
      data: {
        userId: user.id,
        log_date: todayDate,
        status,
      },
    });

    const current = await tx.user.findUnique({
      where: { id: user.id },
      select: { inventory_ttd: true },
    });
    if (current && current.inventory_ttd > 0) {
      await tx.user.update({
        where: { id: user.id },
        data: { inventory_ttd: { decrement: 1 } },
      });
      await tx.inventoryAdjustment.create({
        data: {
          userId: user.id,
          delta: -1,
          reason: "CONSUMED",
        },
      });
    }
  });

  try {
    await updateStreakForUser(user.id);
  } catch {}

  revalidatePath("/dashboard");
  revalidatePath("/ttd");
  revalidatePath("/ttd/riwayat");
  return { ok: true, data: { flashcardIds } };
}

export async function updateStreakForUser(userId: string) {
  const [logs, periods, notif, user] = await Promise.all([
    db.ttdLog.findMany({
      where: { userId },
      select: { log_date: true },
    }),
    db.menstruationLog.findMany({
      where: { userId },
      select: { start_date: true, end_date: true },
    }),
    db.notificationSetting.findUnique({
      where: { userId },
      select: { weekly_day: true },
    }),
    db.user.findUnique({
      where: { id: userId },
      select: {
        streak_freeze_weeks: true,
        streak_freeze_left: true,
        streak_freeze_month: true,
      },
    }),
  ]);
  if (!user) return { current: 0, longest: 0, lastWeekIso: null };

  const weeklyDay = notif?.weekly_day ?? 5;
  const reference = today();
  const monthKey = monthKeyOf(reference);

  let freezeLeft =
    user.streak_freeze_month === monthKey
      ? user.streak_freeze_left
      : FREEZE_PER_MONTH;
  const frozen = new Set(user.streak_freeze_weeks);

  const lastWeekStart = addDays(startOfWeekMon(reference), -7);
  const lastWeekIso = isoWeek(lastWeekStart);

  if (freezeLeft > 0 && !frozen.has(lastWeekIso)) {
    const loggedLastWeek = new Set(
      logs
        .filter((l) => isoWeek(l.log_date) === lastWeekIso)
        .map((l) => toIsoDate(l.log_date))
    );
    const lastWeekOk = isWeekComplete(
      lastWeekStart,
      loggedLastWeek,
      periods,
      weeklyDay,
      reference
    );

    if (!lastWeekOk) {
      const before = evaluateStreak(
        logs,
        periods,
        weeklyDay,
        addDays(lastWeekStart, -1),
        frozen
      );
      if (before.current > 0) {
        frozen.add(lastWeekIso);
        freezeLeft -= 1;
      }
    }
  }

  const summary = evaluateStreak(logs, periods, weeklyDay, reference, frozen);
  await db.user.update({
    where: { id: userId },
    data: {
      streak_current: summary.current,
      streak_longest: summary.longest,
      streak_last_week_iso: summary.lastWeekIso,
      streak_freeze_weeks: Array.from(frozen),
      streak_freeze_left: freezeLeft,
      streak_freeze_month: monthKey,
    },
  });
  return summary;
}

const addStockSchema = z.object({
  pills: z.coerce.number().int().min(1).max(500),
  note: z.string().trim().max(120).optional().or(z.literal("")),
});

export async function addStockAction(
  formData: FormData
): Promise<TtdActionResult> {
  const user = await requireUser();
  const parsed = addStockSchema.safeParse({
    pills: formData.get("pills"),
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: "Jumlah pil nggak valid (1–500)." };
  }
  const { pills, note } = parsed.data;

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { inventory_ttd: { increment: pills } },
    });
    await tx.inventoryAdjustment.create({
      data: {
        userId: user.id,
        delta: pills,
        reason: "RECEIVED",
        note: note || null,
      },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/ttd");
  revalidatePath("/ttd/riwayat");
  return { ok: true };
}

const correctStockSchema = z.object({
  new_value: z.coerce.number().int().min(0).max(500),
  note: z.string().trim().max(120).optional().or(z.literal("")),
});

export async function correctStockAction(
  formData: FormData
): Promise<TtdActionResult> {
  const user = await requireUser();
  const parsed = correctStockSchema.safeParse({
    new_value: formData.get("new_value"),
    note: formData.get("note") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: "Nilai stok nggak valid (0–500)." };
  }
  const { new_value, note } = parsed.data;

  const cur = await db.user.findUnique({
    where: { id: user.id },
    select: { inventory_ttd: true },
  });
  if (!cur) return { ok: false, error: "User tidak ditemukan." };
  const delta = new_value - cur.inventory_ttd;
  if (delta === 0) return { ok: true };

  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: user.id },
      data: { inventory_ttd: new_value },
    });
    await tx.inventoryAdjustment.create({
      data: {
        userId: user.id,
        delta,
        reason: "CORRECTION",
        note: note || null,
      },
    });
  });

  revalidatePath("/dashboard");
  revalidatePath("/ttd");
  revalidatePath("/ttd/riwayat");
  return { ok: true };
}
