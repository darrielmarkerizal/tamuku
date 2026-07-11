"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import {
  logPeriodEndAction,
  logPeriodStartAction,
} from "@/lib/period/actions";
import { trySubmit } from "@/lib/offline/try-submit";

interface Props {
  isPeriodActive: boolean;
  periodDay: number;
  periodStartLabel: string | null;
}

export function PeriodButton({
  isPeriodActive,
  periodDay,
  periodStartLabel,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const res = isPeriodActive
        ? await trySubmit(
            () => logPeriodEndAction(),
            "logPeriodEnd",
            {}
          )
        : await trySubmit(
            () => logPeriodStartAction(),
            "logPeriodStart",
            {}
          );
      if (!res.ok) {
        setError(res.error);
      } else if (res.queued) {
        router.refresh();
      }
    });
  }

  const label = isPeriodActive ? "TANDAI HAID SELESAI" : "TANDAI HAID DIMULAI";
  const sub = isPeriodActive
    ? `Hari ke-${periodDay}${periodStartLabel ? ` dimulai ${periodStartLabel}` : ""}`
    : "Klik saat haid dimulai";

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        className="w-full h-[72px] bg-primary rounded-[12px] border-2 border-ink shadow-retro flex flex-col items-center justify-center px-4 press-retro disabled:opacity-70"
      >
        <span className="font-display text-xl font-extrabold uppercase text-white leading-tight">
          {pending ? "MENYIMPAN…" : label}
        </span>
        <span className="font-sans text-sm font-bold text-white/90 leading-tight mt-0.5">
          {sub}
        </span>
      </button>
      {error && (
        <p className="font-sans text-xs text-danger px-2">{error}</p>
      )}
    </div>
  );
}
