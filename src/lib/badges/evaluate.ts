import { db } from "@/lib/db";
import { BADGES, isEarned } from "./rules";
import { buildSnapshot } from "./snapshot";

export async function evaluateBadgesForUser(userId: string): Promise<string[]> {
  const [snapshot, user] = await Promise.all([
    buildSnapshot(userId),
    db.user.findUnique({ where: { id: userId }, select: { badges: true } }),
  ]);

  if (!snapshot || !user) return [];

  const owned = new Set(user.badges);
  const newSlugs: string[] = [];
  for (const badge of BADGES) {
    if (owned.has(badge.slug)) continue;
    if (isEarned(badge, snapshot)) {
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
