"use client";

import Link from "next/link";
import { useState } from "react";
import { CalendarDays, NotebookPen, Plus, X } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatLong } from "@/lib/date";

const WEEKDAYS = ["S", "S", "R", "K", "J", "S", "M"];

export type Variant =
  | "period"
  | "prediction"
  | "today"
  | "today-period"
  | "plain"
  | "muted";

export interface DayCellData {
  key: string;
  day: number;
  variant: Variant;
  iso?: string;
  hasJournal?: boolean;
}

export interface CalendarTheme {
  periodClass: string;

  periodTextClass: string;
  predictionClass: string;
  periodLabel: string;
  predictionLabel: string;
}

interface Props {
  days: DayCellData[];
  theme: CalendarTheme;
}

export function KalenderGrid({ days, theme }: Props) {
  const [selectedIso, setSelectedIso] = useState<string | null>(null);
  const selected = selectedIso
    ? days.find((d) => d.iso === selectedIso)
    : null;

  return (
    <>
      <div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {WEEKDAYS.map((d, i) => (
            <div
              key={i}
              className="text-center font-sans text-text-muted font-bold text-sm"
            >
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-y-2 gap-x-1 justify-items-center">
          {days.map((cell) => (
            <DayCell
              key={cell.key}
              cell={cell}
              theme={theme}
              onSelect={setSelectedIso}
            />
          ))}
        </div>
      </div>

      {selected && selected.iso && (
        <DayDetailSheet
          iso={selected.iso}
          variant={selected.variant}
          theme={theme}
          hasJournal={!!selected.hasJournal}
          onClose={() => setSelectedIso(null)}
        />
      )}
    </>
  );
}

function DayCell({
  cell,
  theme,
  onSelect,
}: {
  cell: DayCellData;
  theme: CalendarTheme;
  onSelect: (iso: string) => void;
}) {
  const clickable = cell.variant !== "muted" && !!cell.iso;
  const commonProps = clickable
    ? {
        type: "button" as const,
        onClick: () => cell.iso && onSelect(cell.iso),
      }
    : {};

  const Tag = clickable ? ("button" as const) : ("div" as const);

  if (cell.variant === "muted") {
    return (
      <div className="size-10 flex items-center justify-center font-sans text-base opacity-40">
        {cell.day}
      </div>
    );
  }
  if (cell.variant === "period") {
    return (
      <Tag
        {...commonProps}
        className={cn(
          "size-10 flex items-center justify-center font-sans text-base font-bold border-2 border-ink rounded-[8px] shadow-retro-sm press-retro",
          theme.periodClass,
          theme.periodTextClass
        )}
      >
        {cell.day}
      </Tag>
    );
  }
  if (cell.variant === "today-period") {
    return (
      <Tag
        {...commonProps}
        className={cn(
          "size-10 flex items-center justify-center font-sans text-base font-bold border-2 border-ink rounded-[8px] shadow-retro-sm ring-4 ring-primary ring-offset-1 ring-offset-bg press-retro",
          theme.periodClass,
          theme.periodTextClass
        )}
      >
        {cell.day}
      </Tag>
    );
  }
  if (cell.variant === "prediction") {
    return (
      <Tag
        {...commonProps}
        className={cn(
          "size-10 flex items-center justify-center font-sans text-base font-bold text-ink border-2 border-dashed border-ink rounded-[8px] press-retro",
          theme.predictionClass
        )}
      >
        {cell.day}
      </Tag>
    );
  }
  if (cell.variant === "today") {
    return (
      <Tag
        {...commonProps}
        className="size-10 flex items-center justify-center font-sans text-base font-bold text-ink border-2 border-primary rounded-full press-retro"
      >
        {cell.day}
      </Tag>
    );
  }
  return (
    <Tag
      {...commonProps}
      className={cn(
        "size-10 flex items-center justify-center font-sans text-base text-ink press-retro",
        cell.hasJournal && "relative"
      )}
    >
      {cell.day}
      {cell.hasJournal && (
        <span className="absolute -bottom-0.5 size-1 rounded-full bg-primary-strong" />
      )}
    </Tag>
  );
}

function DayDetailSheet({
  iso,
  variant,
  theme,
  hasJournal,
  onClose,
}: {
  iso: string;
  variant: Variant;
  theme: CalendarTheme;
  hasJournal: boolean;
  onClose: () => void;
}) {
  const [y, m, d] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(y, m - 1, d));
  const label = formatLong(date);

  const status =
    variant === "period" || variant === "today-period"
      ? { label: theme.periodLabel, color: "text-primary-strong" }
      : variant === "prediction"
        ? { label: theme.predictionLabel, color: "text-primary-strong" }
        : { label: "Hari biasa", color: "text-text-muted" };

  return (
    <div
      className="fixed inset-0 z-50 bg-ink/40 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div
        className="bg-surface w-full rounded-t-3xl border-t-2 border-ink shadow-retro-lg flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-text-muted rounded-full" />
        </div>

        <div className="px-5 pb-8 flex flex-col gap-4">
          <div className="flex justify-between items-start">
            <div>
              <p className="label-micro text-text-muted">
                {status.label}
              </p>
              <h2 className="font-display text-2xl font-extrabold text-ink uppercase mt-1">
                {label}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Tutup"
              className="size-9 bg-surface border-2 border-ink rounded-[8px] shadow-retro-sm flex items-center justify-center press-retro"
            >
              <X className="size-5 text-ink" strokeWidth={2.5} />
            </button>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href={`/jurnal/${iso}`}
              className="bg-accent-yellow border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center gap-3 press-retro"
            >
              <div className="size-10 shrink-0 bg-surface border-2 border-ink rounded-[8px] flex items-center justify-center">
                <NotebookPen className="size-5 text-ink" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base font-extrabold text-ink leading-tight">
                  {hasJournal ? "Lihat/edit jurnal" : "Buat jurnal hari ini"}
                </p>
                <p className="font-sans text-xs text-text-muted">
                  Mood, gejala, catatan pribadi.
                </p>
              </div>
            </Link>

            <Link
              href="/kalender/log"
              className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center gap-3 press-retro"
            >
              <div className="size-10 shrink-0 bg-pink-cream border-2 border-ink rounded-[8px] flex items-center justify-center">
                <CalendarDays
                  className="size-5 text-primary-strong"
                  strokeWidth={2.5}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-display text-base font-extrabold text-ink leading-tight">
                  Catat haid manual
                </p>
                <p className="font-sans text-xs text-text-muted">
                  Backfill siklus lampau.
                </p>
              </div>
              <Plus className="size-5 text-ink shrink-0" strokeWidth={2.75} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
