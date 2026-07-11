"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { ArrowLeft, CalendarDays } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { Button } from "@/components/ui/button";
import { RetroToggle } from "@/components/retro-toggle";
import { cn } from "@/lib/cn";
import {
  manualLogPeriodAction,
  type ManualLogState,
} from "@/lib/period/actions";
import { toIsoDate, today } from "@/lib/date";

const INITIAL: ManualLogState = {};

export default function CatatHaidManualPage() {
  const [state, formAction, pending] = useActionState(
    manualLogPeriodAction,
    INITIAL
  );
  const [stillActive, setStillActive] = useState(true);
  const [startIso, setStartIso] = useState("");
  const [endIso, setEndIso] = useState("");

  const todayIso = toIsoDate(today());

  return (
    <div className="min-h-dvh flex flex-col bg-bg">
      <header className="w-full top-0 sticky z-30 bg-bg border-b-2 border-ink flex justify-between items-center px-5 py-4">
        <Link
          href="/kalender"
          aria-label="Kembali"
          className="size-10 rounded-full hover:bg-pink-cream flex items-center justify-center transition-colors text-primary-strong"
        >
          <ArrowLeft className="size-6" strokeWidth={2.5} />
        </Link>
        <h1 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
          CATAT HAID MANUAL
        </h1>
        <span className="size-8" />
      </header>

      <form action={formAction} className="flex-1 flex flex-col">
        <main className="flex-1 p-5 flex flex-col gap-8 pb-32">
          <section className="flex flex-col gap-3">
            <label
              htmlFor="start_iso"
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted"
            >
              TANGGAL MULAI HAID
            </label>
            <div className="w-full bg-surface border-2 border-ink shadow-retro rounded-[12px] p-4 flex justify-between items-center gap-3">
              <input
                id="start_iso"
                type="date"
                name="start_iso"
                required
                max={todayIso}
                value={startIso}
                onChange={(e) => setStartIso(e.target.value)}
                className="flex-1 bg-transparent font-display text-xl font-extrabold text-ink outline-none"
              />
              <CalendarDays
                className="size-6 text-primary-strong shrink-0"
                strokeWidth={2.5}
              />
            </div>
          </section>

          <section className="flex flex-col gap-3">
            <label
              htmlFor="end_iso"
              className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted"
            >
              TANGGAL SELESAI HAID (OPSIONAL)
            </label>
            <div className="flex gap-3">
              <div
                className={cn(
                  "flex-1 bg-surface border-2 border-ink shadow-retro rounded-[12px] p-4 flex justify-between items-center gap-3",
                  stillActive && "opacity-50 pointer-events-none"
                )}
              >
                <input
                  id="end_iso"
                  type="date"
                  name="end_iso"
                  max={todayIso}
                  min={startIso || undefined}
                  disabled={stillActive}
                  value={stillActive ? "" : endIso}
                  onChange={(e) => setEndIso(e.target.value)}
                  className="flex-1 bg-transparent font-display text-xl font-extrabold text-ink outline-none"
                />
                <CalendarDays
                  className="size-6 text-text-muted shrink-0"
                  strokeWidth={2.5}
                />
              </div>
              <div className="flex flex-col items-center justify-center gap-2 bg-pink-cream border-2 border-ink shadow-retro rounded-[12px] px-4 py-2">
                <span className="font-mono text-[10px] font-bold leading-none text-ink text-center">
                  MASIH
                  <br />
                  AKTIF
                </span>
                <RetroToggle
                  checked={stillActive}
                  onChange={setStillActive}
                  label="Masih aktif"
                />
              </div>
            </div>
          </section>

          {state?.error && (
            <div className="bg-pink-cream border-2 border-danger rounded-[8px] px-3 py-2 font-sans text-sm text-danger">
              {state.error}
            </div>
          )}

          <div className="relative pt-6">
            <div className="bg-accent-yellow border-2 border-ink shadow-retro rounded-[12px] p-5 relative z-10">
              <p className="font-sans text-base text-ink leading-snug pr-12">
                Mengisi siklus lama bantu prediksi lebih akurat. Cukup tanggal
                mulai aja sudah berguna bagi Hemo untuk pantau kesehatanmu!
              </p>
            </div>
            <div className="absolute -top-4 right-4 z-20 rotate-12">
              <div className="size-16">
                <Mascot state="vibrant" size={64} />
              </div>
            </div>
          </div>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-40 bg-bg border-t-2 border-ink px-5 py-4 flex gap-3 pb-[max(env(safe-area-inset-bottom),16px)]">
          <Link href="/kalender" className="flex-1">
            <Button variant="soft" size="lg" className="w-full" type="button">
              BATAL
            </Button>
          </Link>
          <Button
            size="lg"
            className="flex-1"
            type="submit"
            disabled={pending || !startIso}
          >
            {pending ? "MENYIMPAN…" : "SIMPAN"}
          </Button>
        </footer>
      </form>
    </div>
  );
}
