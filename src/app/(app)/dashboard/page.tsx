import Link from "next/link";
import { Flame, Hand } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Mascot } from "@/components/mascot";
import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { addDays, daysBetween, formatShort, today } from "@/lib/date";
import { isMenstruationActive } from "@/lib/period/sma";
import { computeMascotState } from "@/lib/mascot-state";
import { MOODS } from "@/lib/mood-icons";
import { PeriodButton } from "./period-button";
import { TtdButton } from "./ttd-button";

const MASCOT_LABEL: Record<
  ReturnType<typeof computeMascotState>,
  string
> = {
  vibrant: "Hemo lagi semangat!",
  cheerful: "Hemo lagi ceria!",
  tired: "Hemo lagi capek",
  pucat: "Hemo lagi pucat",
};

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = (user.name ?? user.username).split(" ")[0].toUpperCase();
  const todayDate = today();

  const [periods, ttdToday, ttdLogs14] = await Promise.all([
    db.menstruationLog.findMany({
      where: { userId: user.id },
      select: { start_date: true, end_date: true },
      orderBy: { start_date: "asc" },
    }),
    db.ttdLog.findUnique({
      where: { userId_log_date: { userId: user.id, log_date: todayDate } },
      select: { id: true },
    }),
    db.ttdLog.findMany({
      where: { userId: user.id, log_date: { gte: addDays(todayDate, -14) } },
      select: { log_date: true },
    }),
  ]);

  const mascotState = computeMascotState(ttdLogs14, periods, todayDate);
  const mascotLabel = MASCOT_LABEL[mascotState];

  // "Active" = ada log haid yang belum ditutup (end_date === null)
  const activePeriod = periods
    .slice()
    .reverse()
    .find((p) => p.end_date === null);
  const isPeriodActive = !!activePeriod;
  const periodDay = activePeriod
    ? daysBetween(activePeriod.start_date, todayDate) + 1
    : 0;
  const periodStartLabel = activePeriod
    ? formatShort(activePeriod.start_date)
    : null;
  const menstruating = isMenstruationActive(periods, todayDate);
  const alreadyLoggedTtd = !!ttdToday;

  return (
    <>
      <AppHeader
        greeting={
          <>
            <span>HALO, {firstName}</span>
            <Hand
              className="size-6 text-primary-strong"
              strokeWidth={2.5}
            />
          </>
        }
        hasUnread
      />

      <main className="px-5 flex flex-col gap-5 mt-2">
        <StatusCard
          isPeriodActive={isPeriodActive}
          periodDay={periodDay}
          menstruating={menstruating}
        />
        <PeriodButton
          isPeriodActive={isPeriodActive}
          periodDay={periodDay}
          periodStartLabel={periodStartLabel}
        />
        <TtdCard
          inventory={user.inventory_ttd}
          menstruating={menstruating}
          alreadyLoggedTtd={alreadyLoggedTtd}
        />
        <div className="grid grid-cols-2 gap-4">
          <MascotCard state={mascotState} label={mascotLabel} />
          <StreakCard streak={user.streak_current} />
        </div>
        <JournalQuickCard />
      </main>
    </>
  );
}

function StatusCard({
  isPeriodActive,
  periodDay,
  menstruating,
}: {
  isPeriodActive: boolean;
  periodDay: number;
  menstruating: boolean;
}) {
  const headline = isPeriodActive
    ? `HARI KE-${periodDay} HAID KAMU`
    : "SEHAT & AMAN HARI INI";
  const sub = menstruating
    ? "Ingat minum TTD ya, biar ga lemas."
    : "Jangan lupa cek jadwal TTD kamu.";
  return (
    <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro-lg p-5 relative overflow-hidden">
      <div className="pr-24 relative z-10">
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
          STATUS HARI INI
        </p>
        <h2 className="font-display text-2xl font-extrabold uppercase text-ink mb-2 leading-tight">
          {headline}
        </h2>
        <p className="font-sans text-base text-ink">{sub}</p>
      </div>
      <div className="absolute right-[-12px] bottom-[-8px] w-28 h-28 z-0 -rotate-6">
        <Mascot state="vibrant" size={112} />
      </div>
    </section>
  );
}

function TtdCard({
  inventory,
  menstruating,
  alreadyLoggedTtd,
}: {
  inventory: number;
  menstruating: boolean;
  alreadyLoggedTtd: boolean;
}) {
  const mode = menstruating
    ? "Mode harian — kamu sedang haid."
    : "Mode mingguan — jangan lupa Jumat.";
  return (
    <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro p-5 flex flex-col gap-4">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
            TTD HARI INI
          </p>
          <p className="font-sans text-base text-ink">{mode}</p>
        </div>
        <Link
          href="/ttd"
          className="shrink-0 bg-pink-soft rounded-full px-3 py-1 border-2 border-ink shadow-retro-sm font-mono text-[10px] font-bold uppercase tracking-wider text-ink press-retro"
        >
          Sisa: {inventory} pil →
        </Link>
      </div>
      <TtdButton alreadyLogged={alreadyLoggedTtd} />
      <Link
        href="/ttd/riwayat"
        className="text-center font-mono text-[10px] font-bold uppercase tracking-wider text-primary-strong hover:underline"
      >
        Lihat riwayat & stok →
      </Link>
    </section>
  );
}

function MascotCard({
  state,
  label,
}: {
  state: ReturnType<typeof computeMascotState>;
  label: string;
}) {
  return (
    <Link
      href="/profil"
      className="bg-accent-yellow rounded-[12px] border-2 border-ink shadow-retro p-4 flex flex-col items-center justify-center text-center press-retro"
    >
      <Mascot state={state} size={64} />
      <p className="font-display text-base font-extrabold text-ink leading-tight mt-2">
        {label}
      </p>
    </Link>
  );
}

function StreakCard({ streak }: { streak: number }) {
  return (
    <div className="bg-surface rounded-[12px] border-2 border-ink shadow-retro p-4 flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-1">
        <Flame className="size-8 text-primary-strong" strokeWidth={2.5} />
        <span className="font-mono text-5xl font-bold text-ink leading-none tracking-tighter">
          {streak}
        </span>
      </div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink mt-2">
        MINGGU BERTURUT
      </p>
    </div>
  );
}

function JournalQuickCard() {
  return (
    <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro p-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
          JURNAL HARI INI
        </p>
        <Link
          href="/jurnal"
          className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary-strong hover:underline"
        >
          Lihat semua →
        </Link>
      </div>
      <div className="flex gap-2 justify-between">
        {MOODS.map(({ Icon, slug, labelUpper, tone }) => (
          <Link
            key={slug}
            href={`/jurnal/today?mood=${slug}`}
            aria-label={`Catat mood: ${labelUpper}`}
            className={`size-10 ${tone} rounded-[6px] border-2 border-ink flex items-center justify-center press-retro shadow-retro-sm`}
          >
            <Icon className="size-5 text-ink" strokeWidth={2.5} />
          </Link>
        ))}
      </div>
      <Link
        href="/jurnal/today"
        className="text-center font-sans text-sm font-bold text-primary-strong hover:underline"
      >
        Tambahkan catatan →
      </Link>
    </section>
  );
}
