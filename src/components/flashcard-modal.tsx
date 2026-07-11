"use client";

import { useMemo, useState, useTransition } from "react";
import { ArrowLeft, ArrowRight, X } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/cn";
import { FLASHCARDS_BY_ID } from "@/content/flashcards";
import { markFlashcardSeenAction } from "@/lib/flashcards/actions";

interface FlashcardModalProps {
  ids: string[];
  onClose: () => void;
}

export function FlashcardModal({ ids, onClose }: FlashcardModalProps) {
  const cards = useMemo(
    () => ids.map((id) => FLASHCARDS_BY_ID[id]).filter(Boolean),
    [ids]
  );
  const [index, setIndex] = useState(0);
  const [pending, startTransition] = useTransition();

  if (cards.length === 0) return null;

  const card = cards[index];
  const isFirst = index === 0;
  const isLast = index === cards.length - 1;

  function handleClose() {
    startTransition(async () => {
      await markFlashcardSeenAction(ids);
      onClose();
    });
  }

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px] flex items-center justify-center p-5"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-sm bg-accent-yellow border-2 border-ink rounded-[16px] p-6 flex flex-col shadow-retro-lg animate-[bounce-in_0.4s_cubic-bezier(0.175,0.885,0.32,1.275)_forwards]">
        <div className="flex justify-between items-center mb-6">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink bg-surface px-3 py-1.5 border-2 border-ink shadow-retro-sm rounded-full">
            KARTU {index + 1} DARI {cards.length}
          </span>
          <button
            type="button"
            onClick={handleClose}
            disabled={pending}
            aria-label="Tutup"
            className="size-10 bg-surface border-2 border-ink rounded-full flex items-center justify-center shadow-retro-sm press-retro disabled:opacity-70"
          >
            <X className="size-5 text-ink" strokeWidth={2.5} />
          </button>
        </div>

        <div className="flex flex-col items-center flex-grow text-center mb-8 mt-2">
          <div className="size-32 mb-6 relative">
            <div className="absolute inset-0 bg-pink-soft rounded-full border-2 border-ink -rotate-6" />
            <div className="relative size-full flex items-center justify-center">
              <Mascot state="vibrant" size={108} />
            </div>
          </div>
          <h2 className="font-display text-2xl font-extrabold text-ink mb-4 uppercase leading-tight">
            {card.title}
          </h2>
          <p className="font-sans text-base text-ink/90 leading-relaxed px-2">
            {card.body}
          </p>
        </div>

        <div className="flex flex-col items-center mt-auto">
          <div className="w-full flex items-center justify-between mb-6 px-2">
            <button
              type="button"
              onClick={() => setIndex((i) => Math.max(0, i - 1))}
              disabled={isFirst}
              aria-label="Kartu sebelumnya"
              className={cn(
                "size-12 border-2 rounded-[12px] flex items-center justify-center",
                isFirst
                  ? "bg-pink-cream border-ink/40 cursor-not-allowed opacity-60"
                  : "bg-surface border-ink shadow-retro-sm press-retro"
              )}
            >
              <ArrowLeft className="size-5 text-ink" strokeWidth={2.5} />
            </button>

            <div className="flex gap-3">
              {cards.map((_, i) => (
                <span
                  key={i}
                  className={cn(
                    "size-3.5 rounded-full border-2 border-ink",
                    i === index ? "bg-primary shadow-retro-sm" : "bg-surface"
                  )}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() =>
                isLast ? handleClose() : setIndex((i) => i + 1)
              }
              disabled={pending}
              aria-label={isLast ? "Tutup" : "Kartu berikutnya"}
              className="size-12 bg-primary border-2 border-ink rounded-[12px] flex items-center justify-center shadow-retro press-retro disabled:opacity-70"
            >
              <ArrowRight className="size-5 text-white" strokeWidth={2.75} />
            </button>
          </div>

          <button
            type="button"
            onClick={handleClose}
            disabled={pending}
            className="font-sans text-base font-bold text-ink underline decoration-2 underline-offset-4 hover:text-primary-strong transition-colors py-2 active:scale-95 disabled:opacity-70"
          >
            {pending ? "Menyimpan…" : "Cukup, tutup kartu"}
          </button>
        </div>
      </div>
    </div>
  );
}
