"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, Lock } from "lucide-react";
import {
  ACCESSORY_LABEL,
  Mascot,
  type MascotAccessory,
  type MascotState,
} from "@/components/mascot";
import { cn } from "@/lib/cn";
import { setAccessoryAction } from "@/lib/profile/actions";

interface Option {
  accessory: MascotAccessory;
  unlocked: boolean;
  badgeName: string;
  hint: string;
}

interface Props {
  state: MascotState;
  options: Option[];
  initial: MascotAccessory | null;
}

export function AccessoryPicker({ state, options, initial }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<MascotAccessory | null>(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function choose(next: MascotAccessory | null) {
    if (next === selected) return;
    const previous = selected;

    setSelected(next);
    setError(null);

    startTransition(async () => {
      const res = await setAccessoryAction(next);
      if (res.ok) {
        router.refresh();
      } else {
        setSelected(previous);
        setError(res.error);
      }
    });
  }

  return (
    <div className="flex flex-col gap-6">

      <section className="bg-accent-yellow border-2 border-ink rounded-[12px] shadow-retro p-6 flex items-center justify-center">
        <Mascot state={state} accessory={selected} size={160} bob />
      </section>

      {error && (
        <p className="font-sans text-sm text-danger text-center">{error}</p>
      )}

      <div className="grid grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => choose(null)}
          disabled={pending}
          aria-pressed={selected === null}
          className={cn(
            "aspect-square rounded-[12px] border-2 border-ink flex flex-col items-center justify-center gap-1 press-retro disabled:opacity-60",
            selected === null
              ? "bg-primary shadow-retro"
              : "bg-surface shadow-retro-sm"
          )}
        >
          <Ban
            className={cn(
              "size-6",
              selected === null ? "text-white" : "text-text-muted"
            )}
            strokeWidth={2.5}
          />
          <span
            className={cn(
              "font-mono text-[11px] font-bold uppercase tracking-wider",
              selected === null ? "text-white" : "text-ink"
            )}
          >
            POLOS
          </span>
        </button>

        {options.map((opt) => {
          const active = selected === opt.accessory;
          return (
            <button
              key={opt.accessory}
              type="button"
              onClick={() => opt.unlocked && choose(opt.accessory)}
              disabled={pending || !opt.unlocked}
              aria-pressed={active}
              title={
                opt.unlocked
                  ? ACCESSORY_LABEL[opt.accessory]
                  : `Kebuka lewat lencana ${opt.badgeName} — ${opt.hint}`
              }
              className={cn(
                "aspect-square rounded-[12px] border-2 border-ink flex flex-col items-center justify-center gap-1 relative overflow-hidden",
                active ? "bg-primary shadow-retro" : "bg-surface shadow-retro-sm",
                opt.unlocked
                  ? "press-retro"
                  : "opacity-60 grayscale cursor-not-allowed"
              )}
            >

              <Mascot
                state="cheerful"
                accessory={opt.accessory}
                size={52}
                className="drop-shadow-none"
              />
              <span
                className={cn(
                  "font-mono text-[11px] font-bold uppercase tracking-wider leading-none",
                  active ? "text-white" : "text-ink"
                )}
              >
                {ACCESSORY_LABEL[opt.accessory]}
              </span>
              {!opt.unlocked && (
                <span className="absolute top-1 right-1 size-5 bg-surface rounded-full border-2 border-ink flex items-center justify-center">
                  <Lock className="size-2.5 text-ink" strokeWidth={3} />
                </span>
              )}
            </button>
          );
        })}
      </div>

      <p className="label-micro text-text-muted text-center">
        {options.filter((o) => o.unlocked).length} DARI {options.length} KEBUKA
      </p>
    </div>
  );
}
