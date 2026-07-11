import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { addDays, today, toIsoDate } from "@/lib/date";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const todayDate = today();
  const cutoff90 = addDays(todayDate, -90);
  const cutoff30 = addDays(todayDate, -30);

  const [profile, mLogs, tLogs, jLogs] = await Promise.all([
    db.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        username: true,
        name: true,
        inventory_ttd: true,
        streak_current: true,
        seen_flashcards: true,
      },
    }),
    db.menstruationLog.findMany({
      where: { userId: user.id },
      select: { id: true, start_date: true, end_date: true },
      orderBy: { start_date: "desc" },
    }),
    db.ttdLog.findMany({
      where: { userId: user.id, log_date: { gte: cutoff90 } },
      select: { id: true, log_date: true, status: true },
      orderBy: { log_date: "desc" },
    }),
    db.journalLog.findMany({
      where: { userId: user.id, log_date: { gte: cutoff30 } },
      select: {
        id: true,
        log_date: true,
        mood: true,
        symptoms: true,
        notes: true,
      },
      orderBy: { log_date: "desc" },
    }),
  ]);

  return NextResponse.json({
    profile,
    menstruation_logs: mLogs.map((l) => ({
      id: l.id,
      userId: user.id,
      start_date_iso: toIsoDate(l.start_date),
      end_date_iso: l.end_date ? toIsoDate(l.end_date) : null,
    })),
    ttd_logs: tLogs.map((l) => ({
      id: l.id,
      userId: user.id,
      log_date_iso: toIsoDate(l.log_date),
      status: l.status,
    })),
    journal_entries: jLogs.map((l) => ({
      id: l.id,
      userId: user.id,
      log_date_iso: toIsoDate(l.log_date),
      mood: l.mood,
      symptoms: l.symptoms,
      notes: l.notes,
    })),
  });
}
