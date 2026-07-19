"use client";

import { useEffect, useRef } from "react";
import { Mascot } from "@/components/mascot";

/**
 * Perayaan singkat setelah aksi penting (log TTD).
 *
 * Kenapa ada: sebelumnya aksi paling penting di app ini secara visual identik
 * dengan tap link biasa — tidak ada penanda bahwa sesuatu yang baik terjadi.
 * Momen 1.5 detik ini yang bikin ritual harian terasa layak diulang.
 *
 * Murni CSS (keyframes di globals.css), tidak ada dependency animasi.
 */

const PARTICLE_COUNT = 14;

// Warna konfeti diambil dari palet retro yang sama supaya tetap satu bahasa
// visual — bukan warna neon acak.
const PARTICLE_COLORS = [
  "bg-primary",
  "bg-accent-yellow",
  "bg-accent-mint",
  "bg-accent-peach",
  "bg-pink-soft",
];

// Posisi dihitung deterministik (bukan Math.random) supaya animasinya konsisten
// tiap kali dan tidak pernah menghasilkan sebaran yang menumpuk di satu sisi.
const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
  // Jarak berselang-seling supaya ledakannya berlapis, tidak seperti cincin.
  const distance = i % 2 === 0 ? 132 : 92;
  return {
    id: i,
    cx: `${Math.round(Math.cos(angle) * distance)}px`,
    cy: `${Math.round(Math.sin(angle) * distance)}px`,
    cr: `${(i % 3) * 120 + 180}deg`,
    color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
    delay: `${(i % 4) * 40}ms`,
  };
});

interface RewardBurstProps {
  /** Teks stempel besar, mis. "SUDAH!" */
  stamp: string;
  /** Baris pendukung di bawah stempel. */
  sub?: string;
  /** Dipanggil setelah animasi selesai. */
  onDone: () => void;
  /** Durasi total sebelum onDone dipanggil. */
  durationMs?: number;
}

export function RewardBurst({
  stamp,
  sub,
  onDone,
  durationMs = 1500,
}: RewardBurstProps) {
  // Simpan di ref supaya timer tidak ikut restart kalau parent re-render dan
  // mengirim closure onDone yang baru.
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  }, [onDone]);

  useEffect(() => {
    const timer = setTimeout(() => onDoneRef.current(), durationMs);
    return () => clearTimeout(timer);
  }, [durationMs]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center pointer-events-none px-6"
      role="status"
      aria-live="polite"
    >
      {/* Redup sedikit saja — cukup untuk memfokuskan mata, tidak menutup layar. */}
      <div className="absolute inset-0 bg-ink/25 animate-[rise-in_160ms_ease-out]" />

      <div className="relative flex flex-col items-center">
        {/* Cincin denyut dari titik aksi */}
        <span className="absolute top-14 size-32 rounded-full border-[3px] border-primary animate-[ring-out_700ms_ease-out_forwards]" />
        <span className="absolute top-14 size-32 rounded-full border-[3px] border-accent-yellow animate-[ring-out_700ms_ease-out_180ms_forwards]" />

        {/* Konfeti — dipusatkan di Hemo, terbang keluar */}
        <div className="absolute top-[104px] left-1/2">
          {PARTICLES.map((p) => (
            <span
              key={p.id}
              aria-hidden="true"
              className={`absolute size-3 border-2 border-ink ${p.color} animate-[confetti-fly_900ms_cubic-bezier(0.16,1,0.3,1)_forwards]`}
              style={
                {
                  "--cx": p.cx,
                  "--cy": p.cy,
                  "--cr": p.cr,
                  animationDelay: p.delay,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Hemo melompat — inti pesannya: dia senang karena kamu minum TTD */}
        <div className="relative z-10 animate-[hop_800ms_cubic-bezier(0.16,1,0.3,1)]">
          <Mascot state="vibrant" size={128} />
        </div>

        {/* Stempel retro yang jatuh mendarat miring */}
        <div
          className="relative z-10 -mt-3 bg-accent-yellow border-[3px] border-ink rounded-[10px] px-6 py-2 shadow-retro-lg animate-[stamp-in_520ms_cubic-bezier(0.16,1,0.3,1)_260ms_backwards]"
        >
          <span className="font-display text-3xl font-black uppercase tracking-tight text-ink">
            {stamp}
          </span>
        </div>

        {sub && (
          <p className="relative z-10 mt-5 max-w-[16rem] text-center font-sans text-base font-bold text-surface drop-shadow-[2px_2px_0_#1a0a14] animate-[rise-in_400ms_ease-out_520ms_backwards]">
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}
