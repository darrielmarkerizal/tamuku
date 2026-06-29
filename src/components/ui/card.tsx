import * as React from "react";
import { cn } from "@/lib/cn";

type CardTone = "surface" | "yellow" | "soft" | "mint" | "peach";

const tones: Record<CardTone, string> = {
  surface: "bg-surface",
  yellow: "bg-accent-yellow",
  soft: "bg-pink-soft",
  mint: "bg-accent-mint",
  peach: "bg-accent-peach",
};

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: CardTone;
  shadow?: "sm" | "md" | "lg" | "none";
}

export function Card({
  className,
  tone = "surface",
  shadow = "md",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "border-2 border-ink rounded-[12px] p-4",
        tones[tone],
        shadow === "sm" && "shadow-retro-sm",
        shadow === "md" && "shadow-retro",
        shadow === "lg" && "shadow-retro-lg",
        className
      )}
      {...props}
    />
  );
}

export function CardTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn(
        "font-display font-extrabold text-lg uppercase tracking-wide text-ink",
        className
      )}
      {...props}
    />
  );
}

export function CardBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("text-sm text-ink/80", className)} {...props} />;
}
