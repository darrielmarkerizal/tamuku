"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Minus, Plus } from "lucide-react";
import { OnboardingShell } from "@/components/onboarding-shell";
import { Button } from "@/components/ui/button";

const QUICK_ADD = [4, 10, 30];

export default function OnboardingStep3Page() {
  const [pills, setPills] = useState(4);

  return (
    <OnboardingShell step={3} backHref="/onboarding/2">
      <div className="flex flex-col gap-4 text-center mb-10 pt-4">
        <h1 className="font-display text-[40px] leading-none font-black text-ink uppercase tracking-tight">
          PUNYA BERAPA PIL TTD?
        </h1>
        <p className="font-sans text-lg text-text-muted">
          Hitung pil yang masih kamu simpan.
        </p>
      </div>

      <div className="flex-grow flex flex-col items-center justify-center gap-12">
        <div className="flex items-center justify-center gap-6">
          <button
            type="button"
            onClick={() => setPills((p) => Math.max(0, p - 1))}
            aria-label="Kurangi pil"
            className="size-16 flex items-center justify-center bg-accent-yellow border-2 border-ink shadow-retro rounded-[8px] press-retro"
          >
            <Minus className="size-8 text-ink" strokeWidth={3} />
          </button>
          <div className="w-32 flex justify-center items-center">
            <span className="font-mono text-[64px] font-bold text-ink leading-none">
              {pills}
            </span>
          </div>
          <button
            type="button"
            onClick={() => setPills((p) => p + 1)}
            aria-label="Tambah pil"
            className="size-16 flex items-center justify-center bg-accent-yellow border-2 border-ink shadow-retro rounded-[8px] press-retro"
          >
            <Plus className="size-8 text-ink" strokeWidth={3} />
          </button>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {QUICK_ADD.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPills((p) => p + n)}
              className="px-5 py-3 bg-surface border-2 border-ink shadow-retro-sm rounded-[8px] press-retro font-mono text-[11px] font-bold uppercase tracking-wider text-ink"
            >
              +{n}{n === 4 ? " (1 strip)" : ""}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full mt-auto pt-8">
        <Link href="/onboarding/4" className="block">
          <Button size="lg" className="w-full">
            <span>LANJUT</span>
            <ArrowRight className="size-5" strokeWidth={3} />
          </Button>
        </Link>
      </div>
    </OnboardingShell>
  );
}
