"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronUp, ChevronDown, Check } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

export default function OnboardingStep4Page() {
  const [day, setDay] = useState("Jum");
  const [hour, setHour] = useState(19);
  const [minute, setMinute] = useState(0);
  const [notifEnabled, setNotifEnabled] = useState(true);

  return (
    <OnboardingShell step={4} backHref="/onboarding/3" showSkip={false}>
      <section className="flex flex-col gap-2 pt-2">
        <h1 className="font-display text-[40px] leading-none font-black text-ink uppercase tracking-tight">
          Atur Pengingat
        </h1>
        <p className="font-sans text-lg text-text-muted">
          Kapan kamu mau diingatkan minum TTD?
        </p>
      </section>

      <section className="flex flex-col gap-4 mt-8">
        <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
          Pilih Hari
        </h2>
        <div className="flex gap-2 overflow-x-auto pb-4 -mx-5 px-5 snap-x [&::-webkit-scrollbar]:hidden">
          {DAYS.map((d) => {
            const active = d === day;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDay(d)}
                className={cn(
                  "snap-center shrink-0 size-12 flex items-center justify-center border-2 border-ink rounded-[8px] shadow-retro-sm press-retro font-mono text-[11px] font-bold uppercase tracking-wider",
                  active ? "bg-primary text-white" : "bg-surface text-ink"
                )}
              >
                {d}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4 items-center py-6">
        <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted self-start">
          Pilih Waktu
        </h2>
        <div className="flex items-center gap-6">
          <Stepper
            onUp={() => setHour((h) => (h + 1) % 24)}
            onDown={() => setHour((h) => (h + 23) % 24)}
          />
          <div className="bg-surface border-2 border-ink rounded-[12px] px-8 py-4 shadow-retro flex items-center justify-center">
            <span className="font-mono text-[48px] font-bold leading-none tracking-widest text-ink">
              {String(hour).padStart(2, "0")}:{String(minute).padStart(2, "0")}
            </span>
          </div>
          <Stepper
            onUp={() => setMinute((m) => (m + 5) % 60)}
            onDown={() => setMinute((m) => (m + 55) % 60)}
          />
        </div>
      </section>

      <section className="mt-auto pt-4">
        <div className="bg-accent-yellow border-2 border-ink rounded-[12px] p-5 flex items-center justify-between shadow-retro gap-3">
          <p className="font-display text-lg font-extrabold text-ink leading-tight">
            Aktifkan notifikasi biar ga lupa ya!
          </p>
          <button
            type="button"
            role="switch"
            aria-checked={notifEnabled}
            onClick={() => setNotifEnabled((v) => !v)}
            className={cn(
              "relative shrink-0 w-14 h-7 border-2 border-ink rounded-[6px] transition-colors press-retro",
              notifEnabled ? "bg-primary-strong" : "bg-surface"
            )}
          >
            <span
              className={cn(
                "absolute top-[1px] size-5 bg-surface border-2 border-ink rounded-[4px] transition-transform",
                notifEnabled ? "translate-x-[26px]" : "translate-x-[1px]"
              )}
            />
          </button>
        </div>
      </section>

      <section className="pt-4 pb-2">
        <Link href="/dashboard" className="block">
          <Button size="lg" className="w-full">
            <Check className="size-5" strokeWidth={3} />
            <span>SELESAI</span>
          </Button>
        </Link>
      </section>
    </OnboardingShell>
  );
}

function Stepper({ onUp, onDown }: { onUp: () => void; onDown: () => void }) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <button
        type="button"
        onClick={onUp}
        className="size-10 bg-surface border-2 border-ink rounded-[6px] shadow-retro-sm flex items-center justify-center press-retro"
      >
        <ChevronUp className="size-5 text-ink" strokeWidth={2.75} />
      </button>
      <button
        type="button"
        onClick={onDown}
        className="size-10 bg-surface border-2 border-ink rounded-[6px] shadow-retro-sm flex items-center justify-center press-retro"
      >
        <ChevronDown className="size-5 text-ink" strokeWidth={2.75} />
      </button>
    </div>
  );
}
