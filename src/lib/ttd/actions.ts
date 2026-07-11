"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/current-user";
import { today } from "@/lib/date";
import { evaluateStreak } from "@/lib/streak/engine";
import { pickNextForUser } from "@/lib/flashcards/pick";
import { currentTtdMode } from "./schedule";

export type TtdActionResult<T = null> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

export interface LogTtdSuccess {
  flashcardIds: string[];
}

// ─── Log konsumsi ────────────────────────────────────────────────────────────

/**
 * Log konsumsi TTD hari ini. Unique (userId, log_date) mencegah double log.
 * Kurangi inventory_ttd jika > 0. Tulis InventoryAdjustment sebagai audit.
 */
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

    // Fetch current inventory to decide adjustment
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

  // Update streak realtime — kalau gagal, skip diam-diam (streak bisa
  // di-recovery cron badge harian).
  try {
    await updateStreakForUser(user.id);
  } catch {}

  revalidatePath("/dashboard");
  revalidatePath("/ttd");
  revalidatePath("/ttd/riwayat");
  return { ok: true, data: { flashcardIds } };
}

/**
 * Hitung ulang streak user dari semua TtdLog + MenstruationLog, update
 * user.streak_current, streak_longest, streak_last_week_iso.
 */
export async function updateStreakForUser(userId: string) {
  const [logs, periods, notif] = await Promise.all([
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
  ]);
  const summary = evaluateStreak(logs, periods, notif?.weekly_day ?? 5);
  await db.user.update({
    where: { id: userId },
    data: {
      streak_current: summary.current,
      streak_longest: summary.longest,
      streak_last_week_iso: summary.lastWeekIso,
    },
  });
  return summary;
}

// ─── Tambah stok ─────────────────────────────────────────────────────────────

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

// ─── Koreksi stok (set nilai absolut) ────────────────────────────────────────

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
