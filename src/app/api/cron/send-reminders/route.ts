import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { today } from "@/lib/date";
import { shouldRemindToday } from "@/lib/ttd/schedule";
import { getCopy } from "@/lib/discreet";
import { sendPushToUser } from "@/lib/push/server";

export async function GET(request: Request) {
  const isVercelCron = request.headers.get("x-vercel-cron") !== null;
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  const authorized =
    isVercelCron || (secret && auth === `Bearer ${secret}`);
  if (!authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const todayDate = today();
  const users = await db.user.findMany({
    where: { deletedAt: null },
    include: { notificationSetting: true, menstruationLogs: true },
  });

  let queued = 0;
  for (const u of users) {
    const setting = u.notificationSetting;
    if (!setting || !setting.enabled) continue;

    const decision = shouldRemindToday(
      todayDate,
      u.menstruationLogs,
      setting.weekly_day
    );
    if (!decision.should) continue;
    if (decision.mode === "menstruation" && !setting.ttd_daily) continue;
    if (decision.mode === "weekly" && !setting.ttd_weekly) continue;

    const copy = getCopy(u.discreet_mode);
    const payload =
      decision.mode === "menstruation"
        ? {
            title: copy.pushDailyTitle,
            body: copy.pushDailyBody,
            url: "/dashboard",
            tag: "ttd-daily",
          }
        : {
            title: copy.pushWeeklyTitle,
            body: copy.pushWeeklyBody,
            url: "/dashboard",
            tag: "ttd-weekly",
          };

    try {
      const res = await sendPushToUser(u.id, payload);
      queued += res.sent;
    } catch (err) {
      console.error("push failed for user", u.id, err);
    }
  }

  return NextResponse.json({ users: users.length, queued });
}
