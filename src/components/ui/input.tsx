import * as React from "react";
import { cn } from "@/lib/cn";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      ref={ref}
      type={type}
      className={cn(
        "w-full bg-surface border-2 border-ink rounded-[8px] shadow-retro-sm",
        "px-3 py-3 text-base font-sans text-ink placeholder:text-text-muted",
        "focus:outline-none focus:shadow-[4px_4px_0_0_var(--color-primary)] transition-shadow",
        "disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export function Label({
  className,
  ...props
}: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "label-micro text-ink-soft ml-1",
        className
      )}
      {...props}
    />
  );
}

export function Field({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("flex flex-col gap-1.5", className)} {...props} />;
}
