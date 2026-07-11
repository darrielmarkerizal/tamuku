import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { addDays, today } from "@/lib/date";
import { updateStreakForUser } from "@/lib/ttd/actions";
import { evaluateBadgesForUser } from "@/lib/badges/evaluate";

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

  for (const u of users) {
    try {
      await updateStreakForUser(u.id);
      streakUpdated++;
      const newBadges = await evaluateBadgesForUser(u.id);
      badgesAwarded += newBadges.length;
    } catch (err) {
      console.error(`Cron eval failed for user ${u.id}:`, err);
    }
  }

  return NextResponse.json({
    processed: users.length,
    streakUpdated,
    badgesAwarded,
  });
}
