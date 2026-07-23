"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Droplet } from "lucide-react";
import { cn } from "@/lib/cn";
import { BadgeUnlockBurst } from "@/components/badge-unlock-burst";
import {
  logPeriodEndAction,
  logPeriodStartAction,
} from "@/lib/period/actions";
import { trySubmit } from "@/lib/offline/try-submit";

interface Props {
  isPeriodActive: boolean;
  periodDay: number;
  periodStartLabel: string | null;
  startLabel: string;
  endLabel: string;
  startHint: string;
}

export function PeriodButton({
  isPeriodActive,
  periodDay,
  periodStartLabel,
  startLabel,
  endLabel,
  startHint,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<string[] | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const res = isPeriodActive
        ? await trySubmit(() => logPeriodEndAction(), "logPeriodEnd", {})
        : await trySubmit(() => logPeriodStartAction(), "logPeriodStart", {});
      if (!res.ok) {
        setError(res.error);
      } else if (res.queued) {
        router.refresh();
      } else {
        const data = res.data as { newBadges?: string[] } | undefined;
        if (data?.newBadges && data.newBadges.length > 0) {
          setUnlockedBadges(data.newBadges);
        }
      }
    });
  }

  const label = isPeriodActive ? endLabel : startLabel;
  const sub = isPeriodActive
    ? `Hari ke-${periodDay}${periodStartLabel ? ` dimulai ${periodStartLabel}` : ""}`
    : startHint;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className={cn(
          "w-full rounded-[12px] border-2 border-ink shadow-retro-sm py-3 px-4 flex items-center gap-3 text-left press-retro disabled:opacity-70",
          isPeriodActive ? "bg-pink-soft" : "bg-surface"
        )}
      >
        <span className="size-9 shrink-0 bg-surface border-2 border-ink rounded-[8px] flex items-center justify-center">
          <Droplet
            className="size-4 text-primary-strong"
            strokeWidth={2.75}
            aria-hidden="true"
          />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-display text-base font-extrabold uppercase text-ink leading-tight">
            {pending ? "MENYIMPAN…" : label}
          </span>
          <span className="block font-sans text-sm text-text-muted leading-tight mt-0.5">
            {sub}
          </span>
        </span>
      </button>
      {error && <p className="font-sans text-sm text-danger px-1">{error}</p>}

      {unlockedBadges && (
        <BadgeUnlockBurst
          slugs={unlockedBadges}
          onDone={() => {
            setUnlockedBadges(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}
