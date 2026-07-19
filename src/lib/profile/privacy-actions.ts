"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/current-user";
import { SESSION_CONFIG } from "@/lib/auth/session";

export type PrivacyResult = { ok: true } | { ok: false; error: string };

export async function exportUserDataAction(): Promise<string> {
  const user = await requireUser();
  const full = await db.user.findUnique({
    where: { id: user.id },
    include: {
      menstruationLogs: true,
      ttdLogs: true,
      inventoryAdjustments: true,
      journalLogs: true,
      notificationSetting: true,
    },
  });
  if (!full) throw new Error("User tidak ditemukan.");

  const { password: _p, ...safe } = full;
  void _p;
  return JSON.stringify(
    {
      exported_at: new Date().toISOString(),
      user: safe,
    },
    null,
    2
  );
}

export async function deleteAllDataAction(): Promise<PrivacyResult> {
  const user = await requireUser();
  await db.$transaction(async (tx) => {
    await tx.menstruationLog.deleteMany({ where: { userId: user.id } });
    await tx.ttdLog.deleteMany({ where: { userId: user.id } });
    await tx.inventoryAdjustment.deleteMany({ where: { userId: user.id } });
    await tx.journalLog.deleteMany({ where: { userId: user.id } });
    await tx.user.update({
      where: { id: user.id },
      data: {
        inventory_ttd: 0,
        badges: [],
        streak_current: 0,
        streak_longest: 0,
        streak_last_week_iso: null,
        seen_flashcards: [],
      },
    });
  });
  return { ok: true };
}

export async function deleteAccountAction(): Promise<never> {
  const user = await requireUser();
  await db.user.update({
    where: { id: user.id },
    data: { deletedAt: new Date() },
  });
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_CONFIG.name);
  redirect("/login");
}
