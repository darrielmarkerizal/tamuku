"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/current-user";
import { evaluateBadgesForUser } from "@/lib/badges/evaluate";
import { setMenstruationDay } from "@/lib/period/day-sync";
import { parseIsoDate, today } from "@/lib/date";
import { Mood, Symptom } from "@/generated/prisma/enums";

export type JournalActionResult =
  | { ok: true; data?: { newBadges: string[] } }
  | { ok: false; error: string };

const MOOD_VALUES = Object.values(Mood) as [string, ...string[]];
const SYMPTOM_VALUES = Object.values(Symptom) as [string, ...string[]];

const upsertSchema = z.object({
  log_date_iso: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  mood: z.enum(MOOD_VALUES).optional().or(z.literal("")),
  symptoms: z.array(z.enum(SYMPTOM_VALUES)).default([]),
  notes: z.string().max(280).optional().or(z.literal("")),
});

export async function upsertJournalAction(
  formData: FormData
): Promise<JournalActionResult> {
  const user = await requireUser();
  const rawSymptoms = formData.getAll("symptoms").map(String).filter(Boolean);
  const parsed = upsertSchema.safeParse({
    log_date_iso: formData.get("log_date_iso") ?? "",
    mood: formData.get("mood") ?? "",
    symptoms: rawSymptoms,
    notes: formData.get("notes") ?? "",
  });
  if (!parsed.success) {
    return { ok: false, error: "Input tidak valid." };
  }

  const logDate = parseIsoDate(parsed.data.log_date_iso);
  const mood = parsed.data.mood ? (parsed.data.mood as Mood) : null;
  const symptoms = parsed.data.symptoms as Symptom[];
  const notes = parsed.data.notes || null;
  const menstruating =
    formData.get("menstruating") === "on" ||
    formData.get("menstruating") === "true";

  await db.journalLog.upsert({
    where: {
      userId_log_date: { userId: user.id, log_date: logDate },
    },
    update: { mood, symptoms, notes },
    create: {
      userId: user.id,
      log_date: logDate,
      mood,
      symptoms,
      notes,
    },
  });

  try {
    await setMenstruationDay(user.id, logDate, menstruating, today());
    revalidatePath("/kalender");
  } catch {}

  let newBadges: string[] = [];
  try {
    newBadges = await evaluateBadgesForUser(user.id);
    if (newBadges.length > 0) {
      revalidatePath("/profil");
      revalidatePath("/profil/hemo");
    }
  } catch {}

  revalidatePath("/jurnal");
  revalidatePath(`/jurnal/${parsed.data.log_date_iso}`);
  revalidatePath("/dashboard");
  return { ok: true, data: { newBadges } };
}
