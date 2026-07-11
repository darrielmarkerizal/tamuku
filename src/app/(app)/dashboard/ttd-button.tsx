"use client";

import { useState, useTransition } from "react";
import { Check } from "lucide-react";
import { logTtdAction } from "@/lib/ttd/actions";

interface Props {
  alreadyLogged: boolean;
}

export function TtdButton({ alreadyLogged }: Props) {
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [doneNow, setDoneNow] = useState(false);

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const res = await logTtdAction();
      if (res.ok) {
        setDoneNow(true);
      } else {
        setError(res.error);
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
    </div>
  );
}
