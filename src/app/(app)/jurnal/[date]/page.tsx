import { notFound, redirect } from "next/navigation";
import { JournalForm } from "@/components/journal-form";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/current-user";
import {
  formatDayShort,
  formatShort,
  parseIsoDate,
  today,
  toIsoDate,
} from "@/lib/date";
import { MOOD_BY_SLUG } from "@/lib/mood-icons";

interface Props {
  params: Promise<{ date: string }>;
  searchParams: Promise<{ mood?: string }>;
}

export default async function JurnalDatePage({ params, searchParams }: Props) {
  const user = await requireUser();
  const { date } = await params;
  const sp = await searchParams;

  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  const logDate = parseIsoDate(date);
  const todayDate = today();
  if (logDate > todayDate) {
    // Jurnal masa depan → redirect ke hari ini
    redirect(`/jurnal/${toIsoDate(todayDate)}`);
  }

  const existing = await db.journalLog.findUnique({
    where: {
      userId_log_date: { userId: user.id, log_date: logDate },
    },
    select: { mood: true, symptoms: true, notes: true },
  });

  const prefillMood = sp.mood
    ? MOOD_BY_SLUG[sp.mood.toLowerCase()]
    : undefined;

  const dateLabel = `${formatDayShort(logDate)}, ${formatShort(logDate)}`.toUpperCase();

  return (
    <JournalForm
      logDateIso={date}
      dateLabel={dateLabel}
      initialMood={existing?.mood ?? prefillMood ?? null}
      initialSymptoms={existing?.symptoms ?? []}
      initialNote={existing?.notes ?? ""}
      backHref="/jurnal"
    />
  );
}
