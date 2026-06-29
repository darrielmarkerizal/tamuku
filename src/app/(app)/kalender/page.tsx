import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/cn";

type DayCell = {
  day: number;
  variant?: "period" | "today-period" | "prediction" | "muted";
};

const WEEKDAYS = ["S", "M", "S", "R", "K", "J", "S"];

const DAYS: DayCell[] = [
  { day: 31, variant: "muted" },
  { day: 1 }, { day: 2 }, { day: 3 }, { day: 4 }, { day: 5 }, { day: 6 },
  { day: 7 }, { day: 8 }, { day: 9 }, { day: 10 }, { day: 11 }, { day: 12 }, { day: 13 },
  { day: 14 }, { day: 15 }, { day: 16 }, { day: 17 }, { day: 18 }, { day: 19 }, { day: 20 },
  { day: 21 }, { day: 22 }, { day: 23 }, { day: 24 },
  { day: 25, variant: "period" },
  { day: 26, variant: "period" },
  { day: 27, variant: "today-period" },
  { day: 28 }, { day: 29 }, { day: 30 },
  { day: 1, variant: "prediction" },
  { day: 2, variant: "prediction" },
  { day: 3, variant: "prediction" },
  { day: 4, variant: "prediction" },
];

export default function KalenderPage() {
  return (
    <>
      <AppHeader greeting="KALENDER" />

      <main className="px-5 flex flex-col gap-6 mt-2">
        <div className="flex items-center justify-between">
          <button
            type="button"
            aria-label="Bulan sebelumnya"
            className="size-10 bg-surface border-2 border-ink shadow-retro rounded-[8px] flex items-center justify-center press-retro"
          >
            <ChevronLeft className="size-5 text-ink" strokeWidth={2.75} />
          </button>
          <h2 className="font-display text-2xl font-black tracking-wide uppercase text-ink">
            JUNI 2026
          </h2>
          <button
            type="button"
            aria-label="Bulan berikutnya"
            className="size-10 bg-surface border-2 border-ink shadow-retro rounded-[8px] flex items-center justify-center press-retro"
          >
            <ChevronRight className="size-5 text-ink" strokeWidth={2.75} />
          </button>
        </div>

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
            {DAYS.map((cell, i) => (
              <DayCell key={i} {...cell} />
            ))}
          </div>
        </div>

        <div className="bg-surface p-4 rounded-[12px] border-2 border-ink shadow-retro flex flex-wrap gap-4 justify-center items-center">
          <LegendItem
            swatch={<span className="size-4 bg-period border-2 border-ink rounded-[4px]" />}
            label="Haid tercatat"
          />
          <LegendItem
            swatch={<span className="size-4 bg-prediction border-2 border-dashed border-ink rounded-[4px]" />}
            label="Prediksi"
          />
          <LegendItem
            swatch={<span className="size-4 rounded-full border-2 border-primary" />}
            label="Hari ini"
          />
        </div>

        <Link
          href="/kalender/log"
          className="w-full bg-primary text-white font-display font-black text-lg py-4 px-6 rounded-[12px] border-2 border-ink shadow-retro press-retro flex items-center justify-center gap-2 uppercase"
        >
          <Plus className="size-5" strokeWidth={3} />
          CATAT HAID MANUAL
        </Link>

        <div className="bg-accent-yellow p-5 rounded-[12px] border-2 border-ink shadow-retro-lg relative">
          <div className="absolute top-0 right-3 -translate-y-6">
            <Mascot state="cheerful" size={56} />
          </div>
          <h3 className="font-display font-black text-xl text-ink mb-2 uppercase">
            RATA-RATA SIKLUSMU
          </h3>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="font-mono text-5xl font-black text-ink">28</span>
            <span className="font-display font-black text-xl text-ink">HARI</span>
          </div>
          <p className="font-sans text-sm text-ink mb-4">Berdasarkan 3 siklus terakhir.</p>
          <span className="inline-flex items-center bg-pink-cream text-ink px-3 py-1 rounded-full border-2 border-ink font-mono text-[10px] font-bold uppercase tracking-wider">
            Kepercayaan: Sedang
          </span>
        </div>
      </main>
    </>
  );
}

function DayCell({ day, variant }: DayCell) {
  if (variant === "muted") {
    return (
      <div className="size-10 flex items-center justify-center font-sans text-base opacity-50">
        {day}
      </div>
    );
  }
  if (variant === "period") {
    return (
      <div className="size-10 flex items-center justify-center font-sans text-base font-bold text-white bg-period border-2 border-ink rounded-[8px] shadow-retro-sm">
        {day}
      </div>
    );
  }
  if (variant === "today-period") {
    return (
      <div className="size-10 flex items-center justify-center font-sans text-base font-bold text-white bg-period border-2 border-ink rounded-[8px] shadow-retro-sm ring-4 ring-primary ring-offset-1 ring-offset-bg">
        {day}
      </div>
    );
  }
  if (variant === "prediction") {
    return (
      <div className="size-10 flex items-center justify-center font-sans text-base font-bold text-ink bg-prediction border-2 border-dashed border-ink rounded-[8px]">
        {day}
      </div>
    );
  }
  return (
    <div className="size-10 flex items-center justify-center font-sans text-base text-ink">
      {day}
    </div>
  );
}

function LegendItem({ swatch, label }: { swatch: React.ReactNode; label: string }) {
  return (
    <div className="flex items-center gap-2">
      {swatch}
      <span className="font-sans text-sm font-bold text-ink">{label}</span>
    </div>
  );
}
