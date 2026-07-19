"use client";

import { useEffect, useRef } from "react";
import { Mascot } from "@/components/mascot";

const PARTICLE_COUNT = 14;

const PARTICLE_COLORS = [
  "bg-primary",
  "bg-accent-yellow",
  "bg-accent-mint",
  "bg-accent-peach",
  "bg-pink-soft",
];

const PARTICLES = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
  const angle = (i / PARTICLE_COUNT) * Math.PI * 2;

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
  stamp: string;

  sub?: string;

  onDone: () => void;

  durationMs?: number;
}

export function RewardBurst({
  stamp,
  sub,
  onDone,
  durationMs = 1500,
}: RewardBurstProps) {
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

      <div className="absolute inset-0 bg-ink/25 animate-[rise-in_160ms_ease-out]" />

      <div className="relative flex flex-col items-center">

        <span className="absolute top-14 size-32 rounded-full border-[3px] border-primary animate-[ring-out_700ms_ease-out_forwards]" />
        <span className="absolute top-14 size-32 rounded-full border-[3px] border-accent-yellow animate-[ring-out_700ms_ease-out_180ms_forwards]" />

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

        <div className="relative z-10 animate-[hop_800ms_cubic-bezier(0.16,1,0.3,1)]">
          <Mascot state="vibrant" size={128} />
        </div>

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
