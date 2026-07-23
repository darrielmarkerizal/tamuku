import { SubpageHeader } from "@/components/subpage-header";
import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { addDays, today } from "@/lib/date";
import { computeMascotStateFromJournal } from "@/lib/mascot-state";
import { BADGES } from "@/lib/badges/rules";
import type { MascotAccessory } from "@/components/mascot";
import { AccessoryPicker } from "./accessory-picker";

export default async function HemoPage() {
  const user = await requireUser();
  const todayDate = today();

  const recentJournals = await db.journalLog.findMany({
    where: { userId: user.id, log_date: { gte: addDays(todayDate, -2) } },
    select: { log_date: true, mood: true },
  });

  const mascotState = computeMascotStateFromJournal(recentJournals, todayDate);
  const owned = new Set(user.badges);

  const options = BADGES.filter((b) => b.accessory).map((b) => ({
    accessory: b.accessory as MascotAccessory,
    unlocked: owned.has(b.slug),
    badgeName: b.name,
    hint: b.description,
  }));

  return (
    <>
      <SubpageHeader title="DANDANI HEMO" backHref="/profil" />

      <main className="px-5 flex flex-col gap-6 pb-8">
        <p className="font-sans text-base text-text-muted">
          Aksesori kebuka lewat lencana. Kumpulin semuanya buat Hemo.
        </p>

        <AccessoryPicker
          state={mascotState}
          options={options}
          initial={user.equipped_accessory as MascotAccessory | null}
        />
      </main>
    </>
  );
}
