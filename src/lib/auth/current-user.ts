import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { cache } from "react";
import { db } from "@/lib/db";
import { SESSION_CONFIG, verifySession } from "./session";

export const getCurrentUser = cache(async () => {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_CONFIG.name)?.value;
  const session = await verifySession(token);
  if (!session) return null;

  const user = await db.user.findFirst({
    where: { id: session.userId, deletedAt: null },
    select: {
      id: true,
      username: true,
      name: true,
      school: true,
      class_name: true,
      inventory_ttd: true,
      badges: true,
      streak_current: true,
      streak_longest: true,
      streak_freeze_left: true,
      equipped_accessory: true,
      discreet_mode: true,
      onboarding_completed: true,
    },
  });

  return user;
});

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) redirect("/api/logout");
  return user;
}
