"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { EyeOff } from "lucide-react";
import { RetroToggle } from "@/components/retro-toggle";
import { setDiscreetModeAction } from "@/lib/profile/actions";

export function DiscreetToggle({ initial }: { initial: boolean }) {
  const router = useRouter();
  const [checked, setChecked] = useState(initial);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleChange(next: boolean) {
    const previous = checked;
    setChecked(next);
    setError(null);

    startTransition(async () => {
      const res = await setDiscreetModeAction(next);
      if (res.ok) {
        router.refresh();
      } else {
        setChecked(previous);
        setError(res.error);
      }
    });
  }

  return (
    <section className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-4 flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <div className="size-10 shrink-0 bg-pink-cream border-2 border-ink rounded-[8px] flex items-center justify-center">
          <EyeOff className="size-5 text-primary-strong" strokeWidth={2.5} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-display text-base font-extrabold text-ink leading-tight">
            Mode diskret
          </h3>
          <p className="font-sans text-sm text-text-muted leading-snug mt-0.5">
            Ganti kata &ldquo;haid&rdquo; jadi &ldquo;siklus&rdquo; dan
            &ldquo;TTD&rdquo; jadi &ldquo;vitamin&rdquo;, redam warna merah, dan
            netralkan teks notifikasi.
          </p>
        </div>
        <RetroToggle
          checked={checked}
          onChange={handleChange}
          label="Mode diskret"
          className={pending ? "opacity-60" : undefined}
        />
      </div>

      <p className="font-sans text-xs text-text-muted leading-snug border-t-2 border-pink-cream pt-3">
        Datanya tetap tercatat dan diprediksi seperti biasa — yang berubah cuma
        bagaimana layarnya terbaca kalau ada yang lihat sekilas.
      </p>

      {error && <p className="font-sans text-sm text-danger">{error}</p>}
    </section>
  );
}
