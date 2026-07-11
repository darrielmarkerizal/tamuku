"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { StepIndicator } from "@/components/step-indicator";

interface OnboardingShellProps {
  step: number;
  backHref?: string;
  showSkip?: boolean;
  onSkip?: () => void;
  children: React.ReactNode;
}

export function OnboardingShell({
  step,
  backHref,
  showSkip = true,
  onSkip,
  children,
}: OnboardingShellProps) {
  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <header className="w-full flex justify-between items-center px-5 py-6 sticky top-0 z-40 bg-bg">
        {backHref ? (
          <Link
            href={backHref}
            aria-label="Kembali"
            className="size-10 flex items-center justify-center bg-surface border-2 border-ink rounded-[6px] shadow-retro-sm press-retro"
          >
            <ArrowLeft className="size-5 text-ink" strokeWidth={2.5} />
          </Link>
        ) : (
          <span className="size-10" />
        )}

        <StepIndicator total={4} current={step} />

        {showSkip ? (
          onSkip ? (
            <button
              type="button"
              onClick={onSkip}
              className="font-display text-base font-extrabold text-primary-strong uppercase active:scale-95 px-2 py-1"
            >
              Lewati
            </button>
          ) : (
            <Link
              href="/dashboard"
              className="font-display text-base font-extrabold text-primary-strong uppercase active:scale-95 px-2 py-1"
            >
              Lewati
            </Link>
          )
        ) : (
          <span className="size-10" />
        )}
      </header>

      <main className="flex-grow flex flex-col px-5 pb-6 max-w-md mx-auto w-full">
        {children}
      </main>
    </div>
  );
}
