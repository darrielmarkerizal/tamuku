"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/current-user";

export type NotifSettingResult = { ok: true } | { ok: false; error: string };

const boolInput = z
  .union([z.literal("on"), z.literal("true"), z.literal("false"), z.literal("")])
  .optional();

const schema = z.object({
  weekly_day: z.coerce.number().int().min(0).max(6),
  reminder_hour: z.coerce.number().int().min(0).max(23),
  reminder_minute: z.coerce.number().int().min(0).max(59),
  enabled: boolInput,
  ttd_weekly: boolInput,
  ttd_daily: boolInput,
  period_prediction: boolInput,
  low_stock: boolInput,
  badge_earned: boolInput,
  quiet_enabled: boolInput,
});

function toBool(v: string | undefined) {
  return v === "on" || v === "true";
}

export async function updateNotificationSettingAction(
  formData: FormData
): Promise<NotifSettingResult> {
  const user = await requireUser();
  const parsed = schema.safeParse({
    weekly_day: formData.get("weekly_day"),
    reminder_hour: formData.get("reminder_hour"),
    reminder_minute: formData.get("reminder_minute"),
    enabled: formData.get("enabled") ?? "",
    ttd_weekly: formData.get("ttd_weekly") ?? "",
    ttd_daily: formData.get("ttd_daily") ?? "",
    period_prediction: formData.get("period_prediction") ?? "",
    low_stock: formData.get("low_stock") ?? "",
    badge_earned: formData.get("badge_earned") ?? "",
    quiet_enabled: formData.get("quiet_enabled") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: "Ada pengaturan yang tidak valid." };
  }
  const d = parsed.data;
  const enabled = toBool(d.enabled);
  const quietEnabled = toBool(d.quiet_enabled);

  await db.notificationSetting.upsert({
    where: { userId: user.id },
    update: {
      weekly_day: d.weekly_day,
      reminder_hour: d.reminder_hour,
      reminder_minute: d.reminder_minute,
      enabled,
      ttd_weekly: toBool(d.ttd_weekly),
      ttd_daily: toBool(d.ttd_daily),
      period_prediction: toBool(d.period_prediction),
      low_stock: toBool(d.low_stock),
      badge_earned: toBool(d.badge_earned),
      quiet_start_hour: quietEnabled ? 21 : -1,
      quiet_end_hour: quietEnabled ? 6 : -1,
    },
    create: {
      userId: user.id,
      weekly_day: d.weekly_day,
      reminder_hour: d.reminder_hour,
      reminder_minute: d.reminder_minute,
      enabled,
      ttd_weekly: toBool(d.ttd_weekly),
      ttd_daily: toBool(d.ttd_daily),
      period_prediction: toBool(d.period_prediction),
      low_stock: toBool(d.low_stock),
      badge_earned: toBool(d.badge_earned),
      quiet_start_hour: quietEnabled ? 21 : -1,
      quiet_end_hour: quietEnabled ? 6 : -1,
    },
  });

  revalidatePath("/profil/notifikasi");
  revalidatePath("/ttd");
  return { ok: true };
}
