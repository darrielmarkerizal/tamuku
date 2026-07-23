"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft, Calendar, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BadgeUnlockBurst } from "@/components/badge-unlock-burst";
import { RetroToggle } from "@/components/retro-toggle";
import { cn } from "@/lib/cn";
import { upsertJournalAction } from "@/lib/journal/actions";
import { MOODS } from "@/lib/mood-icons";
import { trySubmit } from "@/lib/offline/try-submit";

const SYMPTOMS = [
  { value: "CRAMP", label: "Kram" },
  { value: "HEADACHE", label: "Sakit kepala" },
  { value: "BLOATING", label: "Kembung" },
  { value: "ACNE", label: "Jerawat" },
  { value: "FATIGUE", label: "Lemas" },
  { value: "BACKPAIN", label: "Sakit pinggang" },
] as const;

interface JournalFormProps {
  logDateIso: string;
  dateLabel: string;
  initialMood?: string | null;
  initialSymptoms?: string[];
  initialNote?: string;
  initialMenstruating?: boolean;
  backHref?: string;
}

export function JournalForm({
  logDateIso,
  dateLabel,
  initialMood,
  initialSymptoms = [],
  initialNote = "",
  initialMenstruating = false,
  backHref = "/jurnal",
}: JournalFormProps) {
  const router = useRouter();
  const [mood, setMood] = useState<string | null>(initialMood ?? null);
  const [symptoms, setSymptoms] = useState<string[]>(initialSymptoms);
  const [note, setNote] = useState(initialNote);
  const [menstruating, setMenstruating] = useState(initialMenstruating);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [unlockedBadges, setUnlockedBadges] = useState<string[] | null>(null);

  const toggleSymptom = (s: string) => {
    setSymptoms((cur) =>
      cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]
    );
  };

  function handleSave() {
    setError(null);
    startTransition(async () => {
      const res = await trySubmit(
        async () => {
          const fd = new FormData();
          fd.set("log_date_iso", logDateIso);
          if (mood) fd.set("mood", mood);
          for (const s of symptoms) fd.append("symptoms", s);
          fd.set("notes", note);
          if (menstruating) fd.set("menstruating", "on");
          return upsertJournalAction(fd);
        },
        "upsertJournal",
        {
          logDateIso,
          mood,
          symptoms,
          notes: note,
          menstruating,
        }
      );
      if (res.ok) {
        const data = !res.queued
          ? (res.data as { newBadges?: string[] } | undefined)
          : undefined;
        if (data?.newBadges && data.newBadges.length > 0) {
          setUnlockedBadges(data.newBadges);
        } else {
          router.push("/jurnal");
        }
      } else {
        setError(res.error);
      }
    });
  }

  return (
    <>
      <header className="flex items-center justify-between px-5 py-4 sticky top-0 bg-bg z-30">
        <Link
          href={backHref}
          aria-label="Kembali"
          className="size-10 -ml-2 rounded-full hover:bg-pink-cream flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="size-6 text-ink" strokeWidth={2.5} />
        </Link>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-accent-yellow border-2 border-ink rounded-full shadow-retro-sm">
          <Calendar className="size-4 text-ink" strokeWidth={2.75} />
          <span className="label-micro text-ink">
            {dateLabel}
          </span>
        </div>
      </header>

      <main className="flex-1 pb-32">
        <section className="px-5 pt-8 pb-6 border-b-2 border-ink">
          <h2 className="font-display text-2xl font-extrabold uppercase text-ink mb-6">
            GIMANA MOOD KAMU?
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {MOODS.map((m) => {
              const active = m.value === mood;
              const Icon = m.Icon;
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(active ? null : m.value)}
                  className={cn(
                    "aspect-square border-2 border-ink rounded-[8px] flex flex-col items-center justify-center gap-1 transition-all",
                    active
                      ? "bg-pink-soft shadow-retro -translate-x-1 -translate-y-1"
                      : "bg-surface shadow-retro-sm press-retro"
                  )}
                >
                  <Icon
                    className="size-8 text-ink"
                    strokeWidth={2.5}
                    aria-hidden="true"
                  />
                  <span className="label-micro text-ink">
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-5 py-8 border-b-2 border-ink">
          <button
            type="button"
            onClick={() => setMenstruating((v) => !v)}
            className={cn(
              "w-full flex items-center gap-3 border-2 border-ink rounded-[12px] p-4 text-left transition-all",
              menstruating ? "bg-pink-soft shadow-retro" : "bg-surface shadow-retro-sm"
            )}
          >
            <span className="size-11 shrink-0 bg-surface border-2 border-ink rounded-[8px] flex items-center justify-center">
              <Droplet
                className="size-5 text-primary-strong"
                strokeWidth={2.75}
                fill={menstruating ? "currentColor" : "none"}
                aria-hidden="true"
              />
            </span>
            <span className="flex-1 min-w-0">
              <span className="block font-display text-lg font-extrabold uppercase text-ink leading-tight">
                Lagi haid hari ini?
              </span>
              <span className="block font-sans text-sm text-text-muted leading-tight mt-0.5">
                Biar kalender & prediksi siklus ikut kecatat.
              </span>
            </span>
            <RetroToggle
              checked={menstruating}
              onChange={setMenstruating}
              label="Tandai sedang haid"
              className="pointer-events-none"
            />
          </button>
        </section>

        <section className="px-5 py-8 border-b-2 border-ink">
          <h2 className="font-display text-2xl font-extrabold uppercase text-ink mb-6">
            ADA GEJALA APA AJA?
          </h2>
          <div className="flex flex-wrap gap-3">
            {SYMPTOMS.map((s) => {
              const active = symptoms.includes(s.value);
              return (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => toggleSymptom(s.value)}
                  className={cn(
                    "px-4 py-2 border-2 border-ink rounded-full font-sans text-base transition-all",
                    active
                      ? "bg-primary text-white translate-x-[2px] translate-y-[2px] shadow-none"
                      : "bg-surface text-ink shadow-retro-sm press-retro"
                  )}
                >
                  {s.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-5 py-8">
          <h2 className="font-display text-2xl font-extrabold uppercase text-ink mb-4">
            CATATAN (OPSIONAL)
          </h2>
          <div className="relative w-full">
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value.slice(0, 280))}
              placeholder="Tulis apa aja yang kamu rasain hari ini... (max 280)"
              className="w-full bg-surface border-2 border-ink shadow-retro rounded-[8px] p-4 font-sans text-base min-h-[160px] focus:outline-none focus:shadow-[4px_4px_0_0_var(--color-primary)] transition-shadow resize-none placeholder:text-text-muted/70 text-ink"
              maxLength={280}
            />
            <div className="absolute bottom-4 right-4 bg-bg/90 px-2 py-1 border-2 border-ink rounded-[6px]">
              <span className="font-mono text-xs text-ink font-bold tracking-tighter">
                {note.length}/280
              </span>
            </div>
          </div>
          {error && (
            <p className="font-sans text-xs text-danger mt-3 px-1">{error}</p>
          )}
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t-2 border-ink px-5 py-4 z-40 pb-[max(env(safe-area-inset-bottom),16px)]">
        <Button
          size="lg"
          className="w-full"
          type="button"
          onClick={handleSave}
          disabled={pending}
        >
          {pending ? "MENYIMPAN…" : "SIMPAN JURNAL"}
        </Button>
      </div>

      {unlockedBadges && (
        <BadgeUnlockBurst
          slugs={unlockedBadges}
          onDone={() => router.push("/jurnal")}
        />
      )}
    </>
  );
}
