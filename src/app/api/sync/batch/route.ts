import { NextResponse } from "next/server";
import { z } from "zod";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { addDays, daysBetween, parseIsoDate, today } from "@/lib/date";
import { calcCycleLength, isMenstruationActive } from "@/lib/period/sma";
import { setMenstruationDay } from "@/lib/period/day-sync";
import { currentTtdMode } from "@/lib/ttd/schedule";
import { evaluateStreak } from "@/lib/streak/engine";
import { pickNextForUser } from "@/lib/flashcards/pick";
import { Mood, Symptom } from "@/generated/prisma/enums";

const OpBase = z.object({
  type: z.string(),
  idempotencyKey: z.string().uuid(),
  createdAt: z.number().int(),
});

const OpUnion = z.discriminatedUnion("type", [
  OpBase.extend({ type: z.literal("logPeriodStart") }),
  OpBase.extend({ type: z.literal("logPeriodEnd") }),
  OpBase.extend({
    type: z.literal("manualLogPeriod"),
    startIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    endIso: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/)
      .nullable(),
  }),
  OpBase.extend({ type: z.literal("logTtd") }),
  OpBase.extend({
    type: z.literal("addStock"),
    pills: z.number().int().min(1).max(500),
    note: z.string().max(120),
  }),
  OpBase.extend({
    type: z.literal("correctStock"),
    new_value: z.number().int().min(0).max(500),
    note: z.string().max(120),
  }),
  OpBase.extend({
    type: z.literal("upsertJournal"),
    logDateIso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    mood: z.string().nullable(),
    symptoms: z.array(z.string()).default([]),
    notes: z.string().max(280),
    menstruating: z.boolean().default(false),
  }),
]);

const BatchSchema = z.object({
  ops: z.array(OpUnion).max(50),
});

type OpResult =
  | { idempotencyKey: string; status: "ok"; data?: unknown }
  | { idempotencyKey: string; status: "duplicate" }
  | { idempotencyKey: string; status: "error"; error: string };

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = BatchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_payload" },
      { status: 400 }
    );
  }

  const results: OpResult[] = [];

  for (const op of parsed.data.ops) {
    try {
      const exists = await db.idempotencyKey.findUnique({
        where: { key: op.idempotencyKey },
        select: { key: true },
      });
      if (exists) {
        results.push({
          idempotencyKey: op.idempotencyKey,
          status: "duplicate",
        });
        continue;
      }

      const data = await runOp(user.id, op);

      await db.idempotencyKey.create({
        data: { key: op.idempotencyKey, userId: user.id },
      });

      results.push({
        idempotencyKey: op.idempotencyKey,
        status: "ok",
        data,
      });
    } catch (err) {
      results.push({
        idempotencyKey: op.idempotencyKey,
        status: "error",
        error: err instanceof Error ? err.message : "unknown",
      });
    }
  }

  return NextResponse.json({ results });
}

async function runOp(
  userId: string,
  op: z.infer<typeof OpUnion>
): Promise<unknown> {
  switch (op.type) {
    case "logPeriodStart":
      return runLogPeriodStart(userId);
    case "logPeriodEnd":
      return runLogPeriodEnd(userId);
    case "manualLogPeriod":
      return runManualLogPeriod(userId, op);
    case "logTtd":
      return runLogTtd(userId);
    case "addStock":
      return runAddStock(userId, op);
    case "correctStock":
      return runCorrectStock(userId, op);
    case "upsertJournal":
      return runUpsertJournal(userId, op);
    default:
      throw new Error("unknown_op");
  }
}

async function runLogPeriodStart(userId: string) {
  const todayDate = today();
  const openLog = await db.menstruationLog.findFirst({
    where: { userId, end_date: null },
    select: { id: true },
  });
  if (openLog) throw new Error("Ada haid yang belum ditandai selesai.");

  const lastClosed = await db.menstruationLog.findFirst({
    where: { userId, end_date: { not: null } },
    orderBy: { start_date: "desc" },
    select: { start_date: true },
  });
  const cycleLength = calcCycleLength(
    todayDate,
    lastClosed?.start_date ?? null
  );
  const created = await db.menstruationLog.create({
    data: {
      userId,
      start_date: todayDate,
      cycle_length: cycleLength ?? undefined,
      source: "MANUAL",
    },
    select: { id: true },
  });
  return { id: created.id };
}

async function runLogPeriodEnd(userId: string) {
  const todayDate = today();
  const openLog = await db.menstruationLog.findFirst({
    where: { userId, end_date: null },
    orderBy: { start_date: "desc" },
    select: { id: true, start_date: true },
  });
  if (!openLog) throw new Error("Tidak ada haid yang berlangsung.");

  const periodLength = daysBetween(openLog.start_date, todayDate) + 1;
  await db.menstruationLog.update({
    where: { id: openLog.id },
    data: { end_date: todayDate, period_length: periodLength },
  });
  return { id: openLog.id };
}

async function runManualLogPeriod(
  userId: string,
  op: { startIso: string; endIso: string | null }
) {
  const start = parseIsoDate(op.startIso);
  const end = op.endIso ? parseIsoDate(op.endIso) : null;
  const existing = await db.menstruationLog.findMany({
    where: { userId },
    select: { start_date: true, end_date: true },
  });
  const rangeEnd = end ?? start;
  const overlaps = existing.some((e) => {
    const eEnd = e.end_date ?? e.start_date;
    return e.start_date <= rangeEnd && eEnd >= start;
  });
  if (overlaps) throw new Error("Rentang bertumpuk dgn siklus yang ada.");

  const sorted = existing
    .slice()
    .sort((a, b) => a.start_date.getTime() - b.start_date.getTime());
  const prev = sorted
    .slice()
    .reverse()
    .find((e) => e.start_date < start);
  const cycleLength = prev ? calcCycleLength(start, prev.start_date) : null;
  const periodLength = end ? daysBetween(start, end) + 1 : null;

  const created = await db.menstruationLog.create({
    data: {
      userId,
      start_date: start,
      end_date: end,
      cycle_length: cycleLength ?? undefined,
      period_length: periodLength ?? undefined,
      source: "MANUAL",
    },
    select: { id: true },
  });
  return { id: created.id };
}

async function runLogTtd(userId: string) {
  const todayDate = today();
  const existing = await db.ttdLog.findUnique({
    where: { userId_log_date: { userId, log_date: todayDate } },
    select: { id: true },
  });
  if (existing) throw new Error("Sudah ada log TTD hari ini.");

  const [periods, userSeen] = await Promise.all([
    db.menstruationLog.findMany({
      where: { userId },
      select: { start_date: true, end_date: true },
      orderBy: { start_date: "asc" },
    }),
    db.user.findUnique({
      where: { id: userId },
      select: { seen_flashcards: true, inventory_ttd: true },
    }),
  ]);
  const status = currentTtdMode(todayDate, periods);
  const flashcardIds = pickNextForUser(userSeen?.seen_flashcards ?? [], 2);

  await db.$transaction(async (tx) => {
    const created = await tx.ttdLog.create({
      data: { userId, log_date: todayDate, status },
      select: { id: true },
    });
    if (userSeen && userSeen.inventory_ttd > 0) {
      await tx.user.update({
        where: { id: userId },
        data: { inventory_ttd: { decrement: 1 } },
      });
      await tx.inventoryAdjustment.create({
        data: { userId, delta: -1, reason: "CONSUMED" },
      });
    }
    return created;
  });

  try {
    const [logs, allPeriods, notif] = await Promise.all([
      db.ttdLog.findMany({ where: { userId }, select: { log_date: true } }),
      db.menstruationLog.findMany({
        where: { userId },
        select: { start_date: true, end_date: true },
      }),
      db.notificationSetting.findUnique({
        where: { userId },
        select: { weekly_day: true },
      }),
    ]);
    void isMenstruationActive;
    const summary = evaluateStreak(logs, allPeriods, notif?.weekly_day ?? 5);
    await db.user.update({
      where: { id: userId },
      data: {
        streak_current: summary.current,
        streak_longest: summary.longest,
        streak_last_week_iso: summary.lastWeekIso,
      },
    });
  } catch {}

  return { flashcardIds };
}

async function runAddStock(
  userId: string,
  op: { pills: number; note: string }
) {
  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { inventory_ttd: { increment: op.pills } },
    });
    await tx.inventoryAdjustment.create({
      data: {
        userId,
        delta: op.pills,
        reason: "RECEIVED",
        note: op.note || null,
      },
    });
  });
  return { added: op.pills };
}

async function runCorrectStock(
  userId: string,
  op: { new_value: number; note: string }
) {
  const cur = await db.user.findUnique({
    where: { id: userId },
    select: { inventory_ttd: true },
  });
  if (!cur) throw new Error("User tidak ditemukan.");
  const delta = op.new_value - cur.inventory_ttd;
  if (delta === 0) return { delta: 0 };
  await db.$transaction(async (tx) => {
    await tx.user.update({
      where: { id: userId },
      data: { inventory_ttd: op.new_value },
    });
    await tx.inventoryAdjustment.create({
      data: {
        userId,
        delta,
        reason: "CORRECTION",
        note: op.note || null,
      },
    });
  });
  return { delta };
}

async function runUpsertJournal(
  userId: string,
  op: {
    logDateIso: string;
    mood: string | null;
    symptoms: string[];
    notes: string;
    menstruating: boolean;
  }
) {
  const logDate = parseIsoDate(op.logDateIso);
  const validMoods = new Set(Object.values(Mood));
  const validSymptoms = new Set(Object.values(Symptom));
  const mood =
    op.mood && validMoods.has(op.mood as Mood) ? (op.mood as Mood) : null;
  const symptoms = op.symptoms.filter((s) =>
    validSymptoms.has(s as Symptom)
  ) as Symptom[];
  const notes = op.notes ? op.notes.slice(0, 280) : null;

  const upserted = await db.journalLog.upsert({
    where: { userId_log_date: { userId, log_date: logDate } },
    update: { mood, symptoms, notes },
    create: { userId, log_date: logDate, mood, symptoms, notes },
    select: { id: true },
  });

  try {
    await setMenstruationDay(userId, logDate, op.menstruating, today());
  } catch {}

  return { id: upserted.id };
}

void addDays;
