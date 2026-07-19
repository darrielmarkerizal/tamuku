import { db } from "@/lib/db";
import { addDays, today } from "@/lib/date";
import { FLASHCARDS } from "@/content/flashcards";
import type { UserSnapshot } from "./rules";

export async function buildSnapshot(
  userId: string
): Promise<UserSnapshot | null> {
  const cutoff30 = addDays(today(), -30);

  const [ttdLogs, periods, journals, journalsTotal, user] = await Promise.all([
    db.ttdLog.findMany({ where: { userId }, select: { log_date: true } }),
    db.menstruationLog.findMany({
      where: { userId },
      select: { start_date: true, end_date: true },
    }),
    db.journalLog.findMany({
      where: { userId, log_date: { gte: cutoff30 } },
      select: { log_date: true },
    }),
    db.journalLog.count({ where: { userId } }),
    db.user.findUnique({
      where: { id: userId },
      select: {
        streak_current: true,
        streak_longest: true,
        seen_flashcards: true,
      },
    }),
  ]);

  if (!user) return null;

  const validIds = new Set(FLASHCARDS.map((f) => f.id));
  const flashcardsSeen = user.seen_flashcards.filter((id) =>
    validIds.has(id)
  ).length;

  return {
    ttdLogs,
    periods,
    journals,
    journalsTotal,
    flashcardsSeen,
    flashcardsTotal: FLASHCARDS.length,
    streak_current: user.streak_current,
    streak_longest: user.streak_longest,
  };
}
