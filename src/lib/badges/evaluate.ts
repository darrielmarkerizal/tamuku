import { db } from "@/lib/db";
import { addDays, today } from "@/lib/date";
import { BADGES } from "./rules";

/**
 * Evaluasi badge untuk 1 user. Insert slug baru ke user.badges. Idempotent.
 * Return list slug badge yang baru diberi.
 */
export async function evaluateBadgesForUser(userId: string): Promise<string[]> {
  const cutoff30 = addDays(today(), -30);

  const [ttdLogs, periods, journals, user] = await Promise.all([
    db.ttdLog.findMany({
      where: { userId },
      select: { log_date: true },
    }),
    db.menstruationLog.findMany({
      where: { userId },
      select: { start_date: true, end_date: true },
    }),
    db.journalLog.findMany({
      where: { userId, log_date: { gte: cutoff30 } },
      select: { log_date: true },
    }),
    db.user.findUnique({
      where: { id: userId },
      select: { badges: true, streak_current: true },
    }),
  ]);

  if (!user) return [];

  const snapshot = {
    ttdLogs,
    periods,
    journals,
    streak_current: user.streak_current,
  };

  const owned = new Set(user.badges);
  const newSlugs: string[] = [];
  for (const badge of BADGES) {
    if (owned.has(badge.slug)) continue;
    if (badge.evaluate(snapshot)) {
      newSlugs.push(badge.slug);
      owned.add(badge.slug);
    }
  }

  if (newSlugs.length > 0) {
    await db.user.update({
      where: { id: userId },
      data: { badges: { push: newSlugs } },
    });
  }

  return newSlugs;
}
