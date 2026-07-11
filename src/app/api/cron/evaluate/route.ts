import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addDays, daysBetween, today } from "@/lib/date";
import { updateStreakForUser } from "@/lib/ttd/actions";
import { evaluateBadgesForUser } from "@/lib/badges/evaluate";
import { sendPushToUser } from "@/lib/push/server";

// Cron dijadwalkan lewat vercel.json. Guard:
// - Header `x-vercel-cron` — otomatis di-set Vercel untuk cron internal
// - Optional `Authorization: Bearer $CRON_SECRET` untuk trigger manual/curl
export async function GET(request: Request) {
  const isVercelCron = request.headers.get("x-vercel-cron") !== null;
  const auth = request.headers.get("authorization");
  const secret = process.env.CRON_SECRET;
  const authorized =
    isVercelCron || (secret && auth === `Bearer ${secret}`);

  if (!authorized) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // Batasi ke user aktif 30 hari terakhir untuk hemat resource
  const activeCutoff = addDays(today(), -30);
  const users = await db.user.findMany({
    where: {
      deletedAt: null,
      OR: [
        { last_login_at: { gte: activeCutoff } },
        { last_login_at: null }, // baru daftar
      ],
    },
    select: { id: true },
  });

  let streakUpdated = 0;
  let badgesAwarded = 0;
  let periodsAutoClosed = 0;

  // Auto-close period: end_date null, start_date > 10 hari lalu → close
  const todayDate = today();
  const cutoffClose = addDays(todayDate, -10);
  const openLogs = await db.menstruationLog.findMany({
    where: { end_date: null, start_date: { lt: cutoffClose } },
    select: { id: true, userId: true, start_date: true },
  });
  for (const log of openLogs) {
    const end = addDays(log.start_date, 7);
    const period_length = daysBetween(log.start_date, end) + 1;
    await db.menstruationLog.update({
      where: { id: log.id },
      data: {
        end_date: end,
        period_length,
        source: "AUTO_CLOSE",
      },
    });
    periodsAutoClosed++;
    try {
      await sendPushToUser(log.userId, {
        title: "Haid ditutup otomatis",
        body: "Kami tutup catatan haidmu — kamu bisa edit di kalender.",
        url: "/kalender",
        tag: "auto-close",
      });
    } catch {}
  }

  for (const u of users) {
    try {
      await updateStreakForUser(u.id);
      streakUpdated++;
      const newBadges = await evaluateBadgesForUser(u.id);
      badgesAwarded += newBadges.length;
      if (newBadges.length > 0) {
        try {
          await sendPushToUser(u.id, {
            title: `Kamu dapat lencana baru!`,
            body: newBadges.join(", "),
            url: "/profil",
            tag: "badge",
          });
        } catch {}
      }
    } catch (err) {
      console.error(`Cron eval failed for user ${u.id}:`, err);
    }
  }

  return NextResponse.json({
    processed: users.length,
    streakUpdated,
    badgesAwarded,
    periodsAutoClosed,
  });
}
