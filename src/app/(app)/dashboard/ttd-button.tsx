"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { FlashcardModal } from "@/components/flashcard-modal";
import { RewardBurst } from "@/components/reward-burst";
import { logTtdAction } from "@/lib/ttd/actions";
import { trySubmit } from "@/lib/offline/try-submit";

interface Props {
  alreadyLogged: boolean;
  label: string;
  doneLabel: string;
  rewardSub: string;
}

export function TtdButton({
  alreadyLogged,
  label,
  doneLabel,
  rewardSub,
}: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [doneNow, setDoneNow] = useState(false);
  const [bursting, setBursting] = useState(false);
  const [flashcardIds, setFlashcardIds] = useState<string[] | null>(null);
  const [pendingCards, setPendingCards] = useState<string[] | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const res = await trySubmit(() => logTtdAction(), "logTtd", {});
      if (!res.ok) {
        setError(res.error);
        return;
      }

      setDoneNow(true);
      if (!res.queued) {
        const data = res.data as { flashcardIds?: string[] } | undefined;
        if (data?.flashcardIds && data.flashcardIds.length > 0) {
          setPendingCards(data.flashcardIds);
        }
      }
      setBursting(true);
    });
  }

  function handleBurstDone() {
    setBursting(false);
    if (pendingCards) {
      setFlashcardIds(pendingCards);
      setPendingCards(null);
    } else {
      router.refresh();
    }
  }

  function handleCardsClosed() {
    setFlashcardIds(null);
    router.refresh();
  }

  const done = alreadyLogged || doneNow;

  return (
    <div className="flex flex-col gap-2">
      {done ? (
        <div className="w-full bg-accent-mint rounded-[12px] border-2 border-ink shadow-retro-sm py-4 px-4 flex items-center justify-center gap-2">
          <Check
            className="size-5 text-ink animate-[pop_400ms_ease-out]"
            strokeWidth={3}
            aria-hidden="true"
          />
          <span className="font-display text-base font-extrabold uppercase text-ink">
            {doneLabel}
          </span>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleClick}
          disabled={pending}
          className="w-full bg-primary text-white rounded-[12px] border-2 border-ink shadow-retro-lg py-5 px-4 font-display text-xl font-extrabold uppercase text-center press-retro disabled:opacity-70"
        >
          {pending ? "MENYIMPAN…" : label}
        </button>
      )}

      {error && <p className="font-sans text-sm text-danger px-1">{error}</p>}

      {bursting && (
        <RewardBurst stamp="SUDAH!" sub={rewardSub} onDone={handleBurstDone} />
      )}

      {flashcardIds && (
        <FlashcardModal ids={flashcardIds} onClose={handleCardsClosed} />
      )}
    </div>
  );
}
