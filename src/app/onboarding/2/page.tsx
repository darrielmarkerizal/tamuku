"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import { OnboardingShell } from "@/components/onboarding-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import {
  addDays,
  dayOfWeekMon,
  firstDayOfMonth,
  formatMonthYear,
  isAfterDay,
  isSameLocalDay,
  lastDayOfMonth,
  toIsoDate,
  today,
} from "@/lib/date";
import { readDraft, writeDraft } from "@/lib/onboarding-storage";

const WEEKDAY_HEADERS = ["S", "S", "R", "K", "J", "S", "M"];

export default function OnboardingStep2Page() {
  const router = useRouter();
  const todayDate = useMemo(() => today(), []);

  const [cursor, setCursor] = useState(firstDayOfMonth(todayDate));
  const [selected, setSelected] = useState<Date | null>(null);

  useEffect(() => {
    const draft = readDraft();
    if (draft.periodStartIso) {
      const [y, mo, d] = draft.periodStartIso.split("-").map(Number);
      const utc = new Date(Date.UTC(y, mo - 1, d));
      setSelected(utc);
      setCursor(firstDayOfMonth(utc));
    }
  }, []);

  const monthEndDay = new Date(
    Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + 1, 0)
  ).getUTCDate();
  const leadingBlanks = dayOfWeekMon(cursor);
  const days = Array.from({ length: monthEndDay }, (_, i) =>
    addDays(cursor, i)
  );

  function shiftMonth(delta: number) {
    const next = new Date(
      Date.UTC(cursor.getUTCFullYear(), cursor.getUTCMonth() + delta, 1)
    );
    setCursor(next);
  }

  function handleSelect(d: Date) {
    if (isAfterDay(d, todayDate)) return;
    if (selected && isSameLocalDay(d, selected)) {
      setSelected(null);
    } else {
      setSelected(d);
    }
  }

  function handleContinue() {
    writeDraft({ periodStartIso: selected ? toIsoDate(selected) : null });
    router.push("/onboarding/3");
  }

  function handleSkip() {
    writeDraft({ periodStartIso: null });
    router.push("/onboarding/3");
  }

  const canGoNext = isAfterDay(firstDayOfMonth(todayDate), cursor);

  return (
    <OnboardingShell step={2} backHref="/onboarding" onSkip={handleSkip}>
      <div className="flex flex-col gap-4 mb-6 pt-2">
        <h1 className="font-display text-[40px] leading-none font-black text-ink uppercase tracking-tight">
          KAPAN HAID TERAKHIRMU?
        </h1>
        <p className="font-sans text-lg text-text-muted">
          Boleh di-skip kalau lupa. Kita pakai 28 hari default.
        </p>
      </div>

      <div className="bg-surface border-2 border-ink rounded-[12px] p-5 shadow-retro flex flex-col gap-6">
        <div className="flex justify-between items-center px-1">
          <button
            type="button"
            onClick={() => shiftMonth(-1)}
            aria-label="Bulan sebelumnya"
            className="p-2 border-2 border-transparent hover:border-ink rounded-[8px] transition-all"
          >
            <ChevronLeft className="size-5 text-ink" strokeWidth={2.75} />
          </button>
          <span className="font-display text-2xl font-extrabold text-ink uppercase tracking-wide">
            {formatMonthYear(cursor)}
          </span>
          <button
            type="button"
            onClick={() => shiftMonth(1)}
            disabled={!canGoNext}
            aria-label="Bulan berikutnya"
            className="p-2 border-2 border-transparent hover:border-ink rounded-[8px] transition-all disabled:opacity-30 disabled:pointer-events-none"
          >
            <ChevronRight className="size-5 text-ink" strokeWidth={2.75} />
          </button>
        </div>

        <div>
          <div className="grid grid-cols-7 gap-1 text-center label-micro text-text-muted mb-4 border-b-2 border-pink-cream pb-2">
            {WEEKDAY_HEADERS.map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center font-mono text-xl font-bold text-ink">
            {Array.from({ length: leadingBlanks }).map((_, i) => (
              <div key={`blank-${i}`} />
            ))}
            {days.map((d) => {
              const isFuture = isAfterDay(d, todayDate);
              const isSelected = selected && isSameLocalDay(d, selected);
              const isToday = isSameLocalDay(d, todayDate);
              return (
                <button
                  key={d.toISOString()}
                  type="button"
                  disabled={isFuture}
                  onClick={() => handleSelect(d)}
                  className={cn(
                    "py-1 rounded-[6px] transition-colors",
                    isFuture && "text-text-muted/30 cursor-not-allowed",
                    !isFuture &&
                      !isSelected &&
                      !isToday &&
                      "hover:bg-pink-cream cursor-pointer",
                    isToday &&
                      !isSelected &&
                      "border-2 border-ink rounded-full flex items-center justify-center size-10 mx-auto",
                    isSelected &&
                      "bg-primary text-white border-2 border-ink rounded-full shadow-retro-sm relative z-10 flex items-center justify-center size-10 mx-auto"
                  )}
                >
                  {d.getUTCDate()}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="self-start inline-flex items-center gap-2 bg-pink-cream border-2 border-ink rounded-full px-5 py-3 shadow-retro-sm mt-6">
        <HelpCircle className="size-5 text-primary-strong" strokeWidth={2.75} />
        <span className="font-sans text-base font-bold text-ink">
          Lupa? Tekan Lewati di atas.
        </span>
      </div>

      <div className="w-full mt-auto pt-8">
        <Button size="lg" className="w-full" onClick={handleContinue}>
          <span>LANJUT</span>
          <ArrowRight className="size-5" strokeWidth={3} />
        </Button>
      </div>
    </OnboardingShell>
  );
}
