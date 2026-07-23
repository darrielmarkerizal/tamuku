"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireUser } from "@/lib/auth/current-user";
import { evaluateBadgesForUser } from "@/lib/badges/evaluate";
import { FLASHCARDS_BY_ID } from "@/content/flashcards";

export async function markFlashcardSeenAction(ids: string[]) {
  const user = await requireUser();
  const valid = ids.filter((id) => FLASHCARDS_BY_ID[id]);
  if (valid.length === 0) return { ok: true as const, newBadges: [] as string[] };

  const cur = await db.user.findUnique({
    where: { id: user.id },
    select: { seen_flashcards: true },
  });
  if (!cur) return { ok: false as const, error: "User tidak ditemukan." };

  const set = new Set(cur.seen_flashcards);
  const fresh = valid.filter((id) => !set.has(id));
  if (fresh.length === 0) return { ok: true as const, newBadges: [] as string[] };

  await db.user.update({
    where: { id: user.id },
    data: { seen_flashcards: { push: fresh } },
  });

  let newBadges: string[] = [];
  try {
    newBadges = await evaluateBadgesForUser(user.id);
    if (newBadges.length > 0) {
      revalidatePath("/profil");
      revalidatePath("/profil/hemo");
    }
  } catch {}

  revalidatePath("/edukasi");
  return { ok: true as const, newBadges };
}
