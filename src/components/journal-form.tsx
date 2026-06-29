"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";

const MOODS = [
  { value: "happy", emoji: "😀", label: "senang" },
  { value: "calm", emoji: "😌", label: "tenang" },
  { value: "sad", emoji: "😢", label: "sedih" },
  { value: "angry", emoji: "😠", label: "kesal" },
  { value: "tired", emoji: "😩", label: "lelah" },
  { value: "anxious", emoji: "😟", label: "cemas" },
] as const;

const SYMPTOMS = [
  "Kram",
  "Sakit kepala",
  "Kembung",
  "Jerawat",
  "Lemas",
  "Sakit pinggang",
];

interface JournalFormProps {
  date: string;
  initialMood?: string;
  initialSymptoms?: string[];
  initialNote?: string;
  backHref?: string;
}

export function JournalForm({
  date,
  initialMood = "calm",
  initialSymptoms = ["Kram", "Sakit kepala"],
  initialNote = "",
  backHref = "/jurnal",
}: JournalFormProps) {
  const [mood, setMood] = useState(initialMood);
  const [symptoms, setSymptoms] = useState<string[]>(initialSymptoms);
  const [note, setNote] = useState(initialNote);

  const toggleSymptom = (s: string) => {
    setSymptoms((cur) => (cur.includes(s) ? cur.filter((x) => x !== s) : [...cur, s]));
  };

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
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
            {date}
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
              return (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => setMood(m.value)}
                  className={cn(
                    "aspect-square border-2 border-ink rounded-[8px] flex flex-col items-center justify-center gap-1 transition-all",
                    active
                      ? "bg-pink-soft shadow-retro -translate-x-1 -translate-y-1"
                      : "bg-surface shadow-retro-sm press-retro"
                  )}
                >
                  <span className="text-3xl">{m.emoji}</span>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                    {m.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="px-5 py-8 border-b-2 border-ink">
          <h2 className="font-display text-2xl font-extrabold uppercase text-ink mb-6">
            ADA GEJALA APA AJA?
          </h2>
          <div className="flex flex-wrap gap-3">
            {SYMPTOMS.map((s) => {
              const active = symptoms.includes(s);
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => toggleSymptom(s)}
                  className={cn(
                    "px-4 py-2 border-2 border-ink rounded-full font-sans text-base transition-all",
                    active
                      ? "bg-primary text-white translate-x-[2px] translate-y-[2px] shadow-none"
                      : "bg-surface text-ink shadow-retro-sm press-retro"
                  )}
                >
                  {s}
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
        </section>
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-surface border-t-2 border-ink px-5 py-4 z-40 pb-[max(env(safe-area-inset-bottom),16px)]">
        <Button size="lg" className="w-full">
          SIMPAN JURNAL
        </Button>
      </div>
    </>
  );
}
