import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { NotifikasiForm } from "./notifikasi-form";

export default async function NotifikasiPage() {
  const user = await requireUser();
  const setting = await db.notificationSetting.findUnique({
    where: { userId: user.id },
    select: {
      weekly_day: true,
      reminder_hour: true,
      reminder_minute: true,
      enabled: true,
      ttd_weekly: true,
      ttd_daily: true,
      period_prediction: true,
      low_stock: true,
      badge_earned: true,
      quiet_start_hour: true,
      quiet_end_hour: true,
    },
  });

  return (
    <NotifikasiForm
      initial={{
        weekly_day: setting?.weekly_day ?? 5,
        reminder_hour: setting?.reminder_hour ?? 19,
        reminder_minute: setting?.reminder_minute ?? 0,
        enabled: setting?.enabled ?? true,
        ttd_weekly: setting?.ttd_weekly ?? true,
        ttd_daily: setting?.ttd_daily ?? true,
        period_prediction: setting?.period_prediction ?? true,
        low_stock: setting?.low_stock ?? true,
        badge_earned: setting?.badge_earned ?? true,
        quiet_enabled: (setting?.quiet_start_hour ?? 21) >= 0,
      }}
    />
  );
}
