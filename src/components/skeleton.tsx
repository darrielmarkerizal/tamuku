import { cn } from "@/lib/cn";

export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-pink-soft border-2 border-ink rounded-[8px] skeleton-retro",
        className
      )}
    />
  );
}

export function SkeletonCard({
  className,
  children,
}: {
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "bg-surface border-2 border-ink rounded-[12px] shadow-retro p-5 flex flex-col gap-3",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SkeletonScreen({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div role="status" aria-live="polite" aria-busy="true">
      <span className="sr-only">{label}</span>
      {children}
    </div>
  );
}
