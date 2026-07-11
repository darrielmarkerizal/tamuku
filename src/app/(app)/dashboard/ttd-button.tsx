"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { FlashcardModal } from "@/components/flashcard-modal";
import { logTtdAction } from "@/lib/ttd/actions";
import { makeOp, submitOp } from "@/lib/offline/sync-client";

interface Props {
  alreadyLogged: boolean;
}

export function TtdButton({ alreadyLogged }: Props) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [doneNow, setDoneNow] = useState(false);
  const [flashcardIds, setFlashcardIds] = useState<string[] | null>(null);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      // Path online: Server Action → response cepat + flashcard IDs
      // Path offline: fallback ke outbox (via sync-client)
      const isOnline =
        typeof navigator === "undefined" || navigator.onLine;
      if (isOnline) {
        try {
          const res = await logTtdAction();
          if (res.ok) {
            setDoneNow(true);
            if (
              res.data?.flashcardIds &&
              res.data.flashcardIds.length > 0
            ) {
              setFlashcardIds(res.data.flashcardIds);
            }
            return;
          }
          setError(res.error);
          return;
        } catch (err) {
          // Network fail → fallback ke outbox
          console.warn("logTtd online failed, fallback to outbox:", err);
        }
      }

      // Offline / fallback path
      const op = makeOp("logTtd");
      const res = await submitOp(op);
      if (res.ok) {
        setDoneNow(true);
        // Optimistik — flashcard nanti muncul saat online sync + revalidate
        router.refresh();
      } else {
        setError("Nggak bisa simpan sekarang. Coba lagi saat online.");
      }
    });
  }

  const done = alreadyLogged || doneNow;

  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending || done}
        className="w-full bg-accent-mint rounded-[8px] border-2 border-ink shadow-retro-sm py-3 px-4 font-display text-lg font-extrabold text-ink uppercase text-center press-retro disabled:opacity-70 disabled:pointer-events-none flex items-center justify-center gap-2"
      >
        <span>{pending ? "MENYIMPAN…" : "SUDAH MINUM TTD HARI INI"}</span>
        {done && !pending && (
          <Check className="size-5" strokeWidth={3} aria-hidden="true" />
        )}
      </button>
      {error && <p className="font-sans text-xs text-danger px-2">{error}</p>}

      {flashcardIds && (
        <FlashcardModal
          ids={flashcardIds}
          onClose={() => setFlashcardIds(null)}
        />
      )}
    </div>
  );
}
