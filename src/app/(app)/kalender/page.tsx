import Link from "next/link";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/cn";
import {
  addDays,
  dayOfWeekMon,
  firstDayOfMonth,
  formatMonthYear,
  lastDayOfMonth,
  today,
  toIsoDate,
} from "@/lib/date";
import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { predictNextPeriod } from "@/lib/period/sma";

const WEEKDAYS = ["S", "S", "R", "K", "J", "S", "M"]; // Sen..Min

type Variant = "period" | "prediction" | "today" | "today-period" | "plain" | "muted";

interface DayCellData {
  key: string;
  day: number;
  variant: Variant;
  iso?: string;
}

type DayCellProps = Omit<DayCellData, "key">;

interface PageProps {
  searchParams: Promise<{ y?: string; m?: string }>;
}

export default async function KalenderPage({ searchParams }: PageProps) {
  const user = await requireUser();
  const sp = await searchParams;

  const todayDate = today();
  const y = Number(sp.y) || todayDate.getUTCFullYear();
  const m = Number(sp.m) || todayDate.getUTCMonth() + 1; // 1-12
  const cursor = new Date(Date.UTC(y, m - 1, 1));

  const periods = await db.menstruationLog.findMany({
    where: { userId: user.id },
    select: { start_date: true, end_date: true },
    orderBy: { start_date: "asc" },
  });

  const prediction = predictNextPeriod(periods);
  const predictedStart = prediction.nextStart;
  const predictedEnd = predictedStart
    ? addDays(predictedStart, 4) // asumsi durasi ~5 hari untuk visual
    : null;

  const monthStart = firstDayOfMonth(cursor);
  const monthEnd = new Date(Date.UTC(y, m, 0)); // last day of month
  const leadingBlanks = dayOfWeekMon(monthStart);

  const days: DayCellData[] = [];

  // Trailing dari bulan sebelumnya untuk isi leading blanks (opsional muted)
  for (let i = leadingBlanks; i > 0; i--) {
    const d = addDays(monthStart, -i);
    days.push({
      key: `pre-${d.toISOString()}`,
      day: d.getUTCDate(),
      variant: "muted",
    });
  }

  const totalInMonth = monthEnd.getUTCDate();

  const todayIso = toIsoDate(todayDate);
  const predictedStartIso = predictedStart ? toIsoDate(predictedStart) : null;
  const predictedEndIso = predictedEnd ? toIsoDate(predictedEnd) : null;
  const periodIsoRanges = periods.map((p) => ({
    startIso: toIsoDate(p.start_date),
    endIso: toIsoDate(p.end_date ?? p.start_date),
  }));

  for (let i = 0; i < totalInMonth; i++) {
    const d = addDays(monthStart, i);
    const iso = toIsoDate(d);
    const isToday = iso === todayIso;
    const inPeriod = periodIsoRanges.some(
      (r) => r.startIso <= iso && r.endIso >= iso
    );
    const inPrediction =
      !inPeriod &&
      predictedStartIso &&
      predictedEndIso &&
      iso >= predictedStartIso &&
      iso <= predictedEndIso;

    let variant: Variant = "plain";
    if (inPeriod && isToday) variant = "today-period";
    else if (inPeriod) variant = "period";
    else if (inPrediction) variant = "prediction";
    else if (isToday) variant = "today";

    days.push({ key: iso, day: d.getUTCDate(), variant, iso });
  }

  // Fill trailing sampai grid rapi ke minggu berikutnya (min 5 rows total)
  const total = days.length;
  const trailingNeeded = (7 - (total % 7)) % 7;
  for (let i = 1; i <= trailingNeeded; i++) {
    const d = addDays(monthEnd, i);
    days.push({
      key: `post-${d.toISOString()}`,
      day: d.getUTCDate(),
      variant: "muted",
    });
  }

  // Navigation
  const prev = new Date(Date.UTC(y, m - 2, 1));
  const next = new Date(Date.UTC(y, m, 1));
  const prevHref = `/kalender?y=${prev.getUTCFullYear()}&m=${prev.getUTCMonth() + 1}`;
  const nextHref = `/kalender?y=${next.getUTCFullYear()}&m=${next.getUTCMonth() + 1}`;

  // Card rata-rata siklus
  const validCycles = periods
    .slice(1)
    .map((p, i) => {
      const prevStart = periods[i].start_date;
      const diff = Math.round(
        (p.start_date.getTime() - prevStart.getTime()) / (24 * 60 * 60 * 1000)
      );
      return diff;
    })
    .filter((n) => n >= 21 && n <= 35);
  const confidence =
    validCycles.length >= 3
      ? "Tinggi"
      : validCycles.length >= 1
        ? "Sedang"
        : "Rendah";

  return (
    <>
      <AppHeader greeting="KALENDER" />

      <main className="px-5 flex flex-col gap-6 mt-2">
        <div className="flex items-center justify-between">
          <Link
            href={prevHref}
            aria-label="Bulan sebelumnya"
            className="size-10 bg-surface border-2 border-ink shadow-retro rounded-[8px] flex items-center justify-center press-retro"
          >
            <ChevronLeft className="size-5 text-ink" strokeWidth={2.75} />
          </Link>
          <h2 className="font-display text-2xl font-black tracking-wide uppercase text-ink">
            {formatMonthYear(cursor)}
          </h2>
          <Link
            href={nextHref}
            aria-label="Bulan berikutnya"
            className="size-10 bg-surface border-2 border-ink shadow-retro rounded-[8px] flex items-center justify-center press-retro"
          >
            <ChevronRight className="size-5 text-ink" strokeWidth={2.75} />
          </Link>
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
            {days.map(({ key, ...rest }) => (
              <DayCell key={key} {...rest} />
            ))}
          </div>
        </div>

        <div className="bg-surface p-4 rounded-[12px] border-2 border-ink shadow-retro flex flex-wrap gap-4 justify-center items-center">
          <LegendItem
            swatch={<span className="size-4 bg-period border-2 border-ink rounded-[4px]" />}
            label="Haid tercatat"
          />
          <LegendItem
            swatch={
              <span className="size-4 bg-prediction border-2 border-dashed border-ink rounded-[4px]" />
            }
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
            <span className="font-mono text-5xl font-black text-ink">
              {prediction.avgCycleLength}
            </span>
            <span className="font-display font-black text-xl text-ink">HARI</span>
          </div>
          <p className="font-sans text-sm text-ink mb-4">
            {validCycles.length >= 1
              ? `Berdasarkan ${Math.min(validCycles.length, 3)} siklus terakhir.`
              : "Belum ada siklus tercatat — pakai default 28 hari."}
          </p>
          <span className="inline-flex items-center bg-pink-cream text-ink px-3 py-1 rounded-full border-2 border-ink font-mono text-[10px] font-bold uppercase tracking-wider">
            Kepercayaan: {confidence}
          </span>
        </div>
      </main>
    </>
  );
}

function DayCell({ day, variant }: DayCellProps) {
  if (variant === "muted") {
    return (
      <div className="size-10 flex items-center justify-center font-sans text-base opacity-40">
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
  if (variant === "today") {
    return (
      <div className="size-10 flex items-center justify-center font-sans text-base font-bold text-ink border-2 border-primary rounded-full">
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

function LegendItem({
  swatch,
  label,
}: {
  swatch: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2">
      {swatch}
      <span className="font-sans text-sm font-bold text-ink">{label}</span>
    </div>
  );
}
