"use client";

import { cn } from "@/lib/cn";

interface RetroToggleProps {
  checked: boolean;
  onChange: (next: boolean) => void;
  label?: string;
  className?: string;
}

export function RetroToggle({ checked, onChange, label, className }: RetroToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={cn(
        "relative shrink-0 w-14 h-7 border-2 border-ink rounded-[6px] transition-colors",
        checked ? "bg-primary" : "bg-surface",
        className
      )}
    >
      <span
        className={cn(
          "absolute top-1/2 -translate-y-1/2 size-5 bg-surface border-2 border-ink rounded-[4px] transition-[left] duration-150",
          checked ? "left-[calc(100%-22px)]" : "left-[2px]"
        )}
      />
    </button>
  );
}
