"use client";

import { useEffect, useState } from "react";

/**
 * Balon kalimat Hemo. Berganti pelan supaya terasa hidup tapi tidak menuntut
 * perhatian — user harus tetap bisa membaca kartu di sekitarnya.
 *
 * `lines` sudah diurutkan di server (rotateLines) sehingga kalimat pertama
 * identik antara server dan client — tidak ada hydration mismatch.
 */

const ROTATE_MS = 5200;

interface MascotSpeechProps {
  lines: string[];
  className?: string;
}

export function MascotSpeech({ lines, className }: MascotSpeechProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (lines.length <= 1) return;
    const timer = setInterval(
      () => setIndex((i) => (i + 1) % lines.length),
      ROTATE_MS
    );
    return () => clearInterval(timer);
  }, [lines.length]);

  if (lines.length === 0) return null;

  return (
    <div className={className}>
      <div className="relative inline-block bg-surface border-2 border-ink rounded-[10px] shadow-retro-sm px-3 py-2 max-w-[13rem]">
        {/* key memaksa remount tiap ganti kalimat supaya animasinya main lagi */}
        <p
          key={index}
          className="font-sans text-sm font-bold text-ink leading-snug animate-[bubble-in_320ms_cubic-bezier(0.16,1,0.3,1)]"
        >
          {lines[index]}
        </p>
        {/* Ekor balon: dua segitiga bertumpuk — yang gelap jadi garis tepinya */}
        <span className="absolute -bottom-[10px] left-6 size-0 border-x-[8px] border-x-transparent border-t-[10px] border-t-ink" />
        <span className="absolute -bottom-[6px] left-6 size-0 border-x-[8px] border-x-transparent border-t-[10px] border-t-surface" />
      </div>
    </div>
  );
}
