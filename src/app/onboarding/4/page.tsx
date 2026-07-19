"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding-shell";
import { Button } from "@/components/ui/button";
import { RetroToggle } from "@/components/retro-toggle";
import { TimePicker } from "@/components/time-picker";
import { cn } from "@/lib/cn";
import { completeOnboardingAction } from "@/lib/auth/actions";
import { clearDraft, readDraft } from "@/lib/onboarding-storage";

const DAYS = [
  { label: "Sen", value: 1 },
  { label: "Sel", value: 2 },
  { label: "Rab", value: 3 },
  { label: "Kam", value: 4 },
  { label: "Jum", value: 5 },
  { label: "Sab", value: 6 },
  { label: "Min", value: 0 },
];

export default function OnboardingStep4Page() {
  const [weeklyDay, setWeeklyDay] = useState(5);
  const [hour, setHour] = useState(19);
  const [minute, setMinute] = useState(0);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [pending, startTransition] = useTransition();

  function handleFinish() {
    const draft = readDraft();
    const fd = new FormData();
    fd.set("weekly_day", String(weeklyDay));
    fd.set("reminder_hour", String(hour));
    fd.set("reminder_minute", String(minute));
    fd.set("enabled", notifEnabled ? "on" : "false");
    if (draft.periodStartIso) fd.set("period_start_iso", draft.periodStartIso);
    if (typeof draft.initialTtd === "number") {
      fd.set("initial_ttd", String(draft.initialTtd));
    }
    startTransition(() => {
      clearDraft();
      completeOnboardingAction(fd);
    });
  }

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
            const active = d.value === weeklyDay;
            return (
              <button
                key={d.value}
                type="button"
                onClick={() => setWeeklyDay(d.value)}
                className={cn(
                  "snap-center shrink-0 size-12 flex items-center justify-center border-2 border-ink rounded-[8px] shadow-retro-sm press-retro font-mono text-[11px] font-bold uppercase tracking-wider",
                  active ? "bg-primary text-white" : "bg-surface text-ink"
                )}
              >
                {d.label}
              </button>
            );
          })}
        </div>
      </section>

      <section className="flex flex-col gap-4 py-6">
        <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
          Pilih Waktu
        </h2>
        <TimePicker
          hour={hour}
          minute={minute}
          onHourChange={setHour}
          onMinuteChange={setMinute}
        />
      </section>

      <section className="mt-auto pt-4">
        <div className="bg-accent-yellow border-2 border-ink rounded-[12px] p-5 flex items-center justify-between shadow-retro gap-3">
          <p className="font-display text-lg font-extrabold text-ink leading-tight">
            Aktifkan notifikasi biar ga lupa ya!
          </p>
          <RetroToggle
            checked={notifEnabled}
            onChange={setNotifEnabled}
            label="Aktifkan notifikasi"
          />
        </div>
      </section>

      <section className="pt-4 pb-2">
        <Button
          type="button"
          size="lg"
          className="w-full"
          disabled={pending}
          onClick={handleFinish}
        >
          <Check className="size-5" strokeWidth={3} />
          <span>{pending ? "MENYIMPAN…" : "SELESAI"}</span>
        </Button>
      </section>
    </OnboardingShell>
  );
}
