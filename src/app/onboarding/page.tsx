import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { OnboardingShell } from "@/components/onboarding-shell";
import { Button } from "@/components/ui/button";

export default function OnboardingStep1Page() {
  return (
    <OnboardingShell step={1}>
      <section className="flex-grow flex flex-col justify-center items-center py-8">
        <div className="w-full bg-accent-yellow border-2 border-ink rounded-[12px] shadow-retro-lg flex flex-col items-center justify-center p-8 relative overflow-hidden">
          <div className="absolute -top-10 -right-10 size-32 bg-pink-soft rounded-full opacity-50 blur-xl" />
          <div className="absolute -bottom-10 -left-10 size-32 bg-pink-cream rounded-full opacity-60 blur-xl" />
          <div className="relative size-48 md:size-56 z-10 animate-[bounce_3s_ease-in-out_infinite]">
            <Mascot state="vibrant" size={224} className="size-full" />
          </div>
        </div>

        <div className="mt-10 text-center w-full px-2">
          <h1 className="font-display text-4xl md:text-5xl font-black text-ink mb-4 uppercase tracking-tight">
            HALO, AKU HEMO!
          </h1>
          <p className="font-sans text-lg text-text-muted">
            Aku bakal nemenin kamu catat siklus haid dan minum TTD biar selalu sehat ya.
          </p>
        </div>
      </section>

      <section className="w-full mt-auto pt-4">
        <Link href="/onboarding/2" className="block">
          <Button size="lg" className="w-full">
            <span>LANJUT</span>
            <ArrowRight className="size-5" strokeWidth={3} />
          </Button>
        </Link>
      </section>
    </OnboardingShell>
  );
}
