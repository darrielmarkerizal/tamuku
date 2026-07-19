import { Flame, Snowflake } from "lucide-react";
import { cn } from "@/lib/cn";
import type { DayStatus, WeekDay } from "@/lib/streak/week-progress";

const SEGMENT_FILL: Record<DayStatus, string> = {
  done: "#ff3d8a",

  due: "#ffd66b",

  missed: "#e8c4d2",

  upcoming: "#ffe4ec",

  rest: "#fff0f2",
};

const RADIUS = 42;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SEGMENT_GAP = 7;
const SEGMENT_LENGTH = CIRCUMFERENCE / 7 - SEGMENT_GAP;

interface WeekRingProps {
  days: WeekDay[];

  streak: number;

  remaining: number;

  freezeLeft: number;
  className?: string;
}

export function WeekRing({
  days,
  streak,
  remaining,
  freezeLeft,
  className,
}: WeekRingProps) {
  const doneCount = days.filter((d) => d.status === "done").length;

  return (
    <div
      className={cn(
        "bg-surface rounded-[12px] border-2 border-ink shadow-retro p-4 flex flex-col items-center justify-center text-center relative",
        className
      )}
    >
      {freezeLeft > 0 && (
        <span
          className="absolute top-2 right-2 inline-flex items-center gap-1 bg-accent-mint border-2 border-ink rounded-full px-1.5 py-0.5"
          title="Streak freeze tersedia — satu minggu terlewat tidak akan menghapus streak kamu."
        >
          <Snowflake className="size-3 text-ink" strokeWidth={3} />
          <span className="font-mono text-[11px] font-bold text-ink">
            {freezeLeft}
          </span>
        </span>
      )}

      <div className="relative size-[104px]">
        <svg
          viewBox="0 0 100 100"
          className="size-full -rotate-90"
          role="img"
          aria-label={`Minggu ini: ${doneCount} dari 7 hari sudah tercatat. Streak ${streak} minggu berturut.`}
        >
          {days.map((day, i) => (
            <circle
              key={day.iso}
              cx="50"
              cy="50"
              r={RADIUS}
              fill="none"
              stroke={SEGMENT_FILL[day.status]}
              strokeWidth="11"
              strokeLinecap="butt"

              strokeDasharray={`${SEGMENT_LENGTH} ${CIRCUMFERENCE - SEGMENT_LENGTH}`}
              strokeDashoffset={-((CIRCUMFERENCE / 7) * i)}
            />
          ))}

          <circle
            cx="50"
            cy="50"
            r={RADIUS + 5.5}
            fill="none"
            stroke="#1a0a14"
            strokeWidth="2.5"
          />
          <circle
            cx="50"
            cy="50"
            r={RADIUS - 5.5}
            fill="none"
            stroke="#1a0a14"
            strokeWidth="2.5"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <Flame className="size-4 text-primary-strong" strokeWidth={2.75} />
          <span className="font-mono text-3xl font-bold text-ink leading-none tracking-tighter animate-[pop_500ms_ease-out]">
            {streak}
          </span>
        </div>
      </div>

      <p className="label-micro text-ink mt-2">
        MINGGU BERTURUT
      </p>

      {remaining === 1 ? (
        <p className="label-micro text-primary-strong mt-1 animate-[pop_600ms_ease-out]">
          1 LAGI!
        </p>
      ) : remaining > 1 ? (
        <p className="label-micro text-text-muted mt-1">
          {remaining} LAGI MINGGU INI
        </p>
      ) : (
        <p className="label-micro text-success mt-1">
          MINGGU INI AMAN
        </p>
      )}
    </div>
  );
}
