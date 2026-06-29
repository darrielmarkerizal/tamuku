import * as React from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "soft" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 border-2 border-ink rounded-[8px] font-display font-extrabold uppercase tracking-wide press-retro disabled:opacity-50 disabled:pointer-events-none select-none";

const variants: Record<Variant, string> = {
  primary: "bg-primary text-white shadow-retro",
  secondary: "bg-accent-yellow text-ink shadow-retro",
  soft: "bg-pink-soft text-ink shadow-retro-sm",
  ghost:
    "bg-transparent text-ink border-transparent shadow-none hover:bg-pink-soft hover:translate-x-0 hover:translate-y-0 active:translate-x-0 active:translate-y-0",
  danger: "bg-danger text-white shadow-retro",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-3 text-xs",
  md: "h-11 px-4 text-sm",
  lg: "h-14 px-6 text-base",
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(base, variants[variant], sizes[size], className)}
      {...props}
    />
  )
);
Button.displayName = "Button";
