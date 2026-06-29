import { cn } from "@/lib/cn";

interface StepIndicatorProps {
  total: number;
  current: number;
  className?: string;
}

export function StepIndicator({ total, current, className }: StepIndicatorProps) {
  return (
    <div
      role="progressbar"
      aria-valuemin={1}
      aria-valuemax={total}
      aria-valuenow={current}
      aria-label={`Langkah ${current} dari ${total}`}
      className={cn("flex gap-2 items-center", className)}
    >
      {Array.from({ length: total }, (_, i) => {
        const isActive = i + 1 === current;
        return (
          <span
            key={i}
            className={cn(
              "h-4 rounded-full border-2 border-ink transition-all",
              isActive ? "w-8 bg-primary" : "w-4 bg-surface"
            )}
          />
        );
      })}
    </div>
  );
}
