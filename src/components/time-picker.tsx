"use client";

import { ChevronDown, ChevronUp } from "lucide-react";

interface TimePickerProps {
  hour: number;
  minute: number;
  onHourChange: (next: number) => void;
  onMinuteChange: (next: number) => void;
  minuteStep?: number;
}

export function TimePicker({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
  minuteStep = 5,
}: TimePickerProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <NumberColumn
        label="Jam"
        value={hour}
        onUp={() => onHourChange((hour + 1) % 24)}
        onDown={() => onHourChange((hour + 23) % 24)}
      />
      <span
        aria-hidden
        className="font-mono text-[48px] font-bold leading-none text-ink px-1 pb-3"
      >
        :
      </span>
      <NumberColumn
        label="Menit"
        value={minute}
        onUp={() => onMinuteChange((minute + minuteStep) % 60)}
        onDown={() => onMinuteChange((minute + 60 - minuteStep) % 60)}
      />
    </div>
  );
}

interface NumberColumnProps {
  label: string;
  value: number;
  onUp: () => void;
  onDown: () => void;
}

function NumberColumn({ label, value, onUp, onDown }: NumberColumnProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={onUp}
        aria-label={`Tambah ${label.toLowerCase()}`}
        className="size-10 bg-surface border-2 border-ink rounded-[6px] shadow-retro-sm flex items-center justify-center press-retro"
      >
        <ChevronUp className="size-5 text-ink" strokeWidth={2.75} />
      </button>
      <div className="bg-surface border-2 border-ink rounded-[12px] px-6 py-3 shadow-retro min-w-[88px] text-center">
        <span className="font-mono text-[48px] font-bold leading-none tracking-tight text-ink">
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <button
        type="button"
        onClick={onDown}
        aria-label={`Kurang ${label.toLowerCase()}`}
        className="size-10 bg-surface border-2 border-ink rounded-[6px] shadow-retro-sm flex items-center justify-center press-retro"
      >
        <ChevronDown className="size-5 text-ink" strokeWidth={2.75} />
      </button>
    </div>
  );
}
