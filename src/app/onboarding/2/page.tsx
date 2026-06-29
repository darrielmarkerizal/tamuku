import Link from "next/link";
import { ArrowRight, ChevronLeft, ChevronRight, HelpCircle } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding-shell";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const WEEKDAYS = ["S", "S", "R", "K", "J", "S", "M"];
const PREV_DAYS = [24, 25, 26, 27, 28, 29, 30];
const CURRENT_DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const TODAY = 14;

export default function OnboardingStep2Page() {
  return (
    <OnboardingShell step={2} backHref="/onboarding">
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
            aria-label="Bulan sebelumnya"
            className="p-2 border-2 border-transparent hover:border-ink rounded-[8px] transition-all"
          >
            <ChevronLeft className="size-5 text-ink" strokeWidth={2.75} />
          </button>
          <span className="font-display text-2xl font-extrabold text-ink uppercase tracking-wide">
            Oktober 2023
          </span>
          <button
            aria-label="Bulan berikutnya"
            className="p-2 border-2 border-transparent hover:border-ink rounded-[8px] transition-all"
          >
            <ChevronRight className="size-5 text-ink" strokeWidth={2.75} />
          </button>
        </div>

        <div>
          <div className="grid grid-cols-7 gap-1 text-center font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mb-4 border-b-2 border-pink-cream pb-2">
            {WEEKDAYS.map((d, i) => (
              <div key={i}>{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-y-3 gap-x-1 text-center font-mono text-xl font-bold text-ink">
            {PREV_DAYS.map((d) => (
              <div key={`prev-${d}`} className="text-text-muted/40 py-1">
                {d}
              </div>
            ))}
            {CURRENT_DAYS.map((d) => (
              <div
                key={d}
                className={cn(
                  "py-1 cursor-pointer rounded-[6px] transition-colors hover:bg-pink-cream",
                  d === TODAY &&
                    "bg-primary text-white border-2 border-ink rounded-full shadow-retro-sm relative z-10 flex items-center justify-center size-10 mx-auto hover:bg-primary"
                )}
              >
                {d}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="self-start inline-flex items-center gap-2 bg-pink-cream border-2 border-ink rounded-full px-5 py-3 shadow-retro-sm mt-6">
        <HelpCircle className="size-5 text-primary-strong" strokeWidth={2.75} />
        <span className="font-sans text-base font-bold text-ink">
          Lupa? Tekan Lewati.
        </span>
      </div>

      <div className="w-full mt-auto pt-8">
        <Link href="/onboarding/3" className="block">
          <Button size="lg" className="w-full">
            <span>LANJUT</span>
            <ArrowRight className="size-5" strokeWidth={3} />
          </Button>
        </Link>
      </div>
    </OnboardingShell>
  );
}
