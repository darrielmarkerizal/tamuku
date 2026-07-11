"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BookOpen, Check } from "lucide-react";
import { FlashcardModal } from "@/components/flashcard-modal";
import type { Flashcard } from "@/content/flashcards";
import { cn } from "@/lib/cn";

const TONES = [
  "bg-pink-soft",
  "bg-accent-yellow",
  "bg-accent-mint",
  "bg-accent-peach",
  "bg-pink-cream",
] as const;

interface Props {
  cards: Flashcard[];
  seenIds: string[];
}

export function EdukasiDetailClient({ cards, seenIds }: Props) {
  const seenSet = useMemo(() => new Set(seenIds), [seenIds]);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="flex flex-col gap-3">
        {cards.map((c, i) => (
          <li key={c.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              className={cn(
                "w-full text-left border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center gap-4 press-retro",
                TONES[i % TONES.length]
              )}
            >
              <div className="size-12 shrink-0 bg-surface border-2 border-ink rounded-[8px] flex items-center justify-center shadow-retro-sm">
                <BookOpen className="size-5 text-ink" strokeWidth={2.5} />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted flex items-center gap-1">
                  KARTU {String(i + 1).padStart(2, "0")}
                  {seenSet.has(c.id) && (
                    <Check
                      className="size-3 text-success"
                      strokeWidth={3}
                      aria-label="Sudah dibaca"
                    />
                  )}
                </span>
                <h3 className="font-display text-lg font-extrabold text-ink leading-tight">
                  {c.title}
                </h3>
              </div>
              <ArrowRight
                className="size-5 text-ink shrink-0"
                strokeWidth={2.75}
              />
            </button>
          </li>
        ))}
      </ul>

      {openIndex !== null && (
        <FlashcardModal
          ids={cards.slice(openIndex).map((c) => c.id)}
          onClose={() => setOpenIndex(null)}
        />
      )}
    </>
  );
}
