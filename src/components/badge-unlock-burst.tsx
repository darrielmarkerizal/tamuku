"use client";

import { useEffect } from "react";
import { RewardBurst } from "@/components/reward-burst";
import { ACCESSORY_LABEL } from "@/components/mascot";
import { BADGE_BY_SLUG } from "@/lib/badges/rules";

interface Props {
  slugs: string[];
  onDone: () => void;
}

export function BadgeUnlockBurst({ slugs, onDone }: Props) {
  const badges = slugs.map((s) => BADGE_BY_SLUG[s]).filter(Boolean);

  useEffect(() => {
    if (badges.length === 0) onDone();
  }, [badges.length, onDone]);

  if (badges.length === 0) return null;

  const names = badges.map((b) => b.name).join(" · ");
  const unlocked = badges.find((b) => b.accessory)?.accessory;
  const sub = unlocked
    ? `${names} — aksesori ${ACCESSORY_LABEL[unlocked]} kebuka!`
    : `${names} didapat!`;

  return (
    <RewardBurst stamp="LENCANA!" sub={sub} onDone={onDone} durationMs={2200} />
  );
}
