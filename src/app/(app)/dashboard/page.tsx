import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Mascot } from "@/components/mascot";
import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { daysBetween, formatShort, today } from "@/lib/date";
import { isMenstruationActive } from "@/lib/period/sma";
import { PeriodButton } from "./period-button";
import { TtdButton } from "./ttd-button";

const moods = [
  { emoji: "😀", label: "Senang" },
  { emoji: "😌", label: "Tenang" },
  { emoji: "😢", label: "Sedih" },
  { emoji: "😠", label: "Kesal" },
  { emoji: "😩", label: "Lelah" },
  { emoji: "😟", label: "Cemas" },
];

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = (user.name ?? user.username).split(" ")[0].toUpperCase();
  const todayDate = today();

  const [periods, ttdToday] = await Promise.all([
    db.menstruationLog.findMany({
      where: { userId: user.id },
      select: { start_date: true, end_date: true },
      orderBy: { start_date: "asc" },
    }),
    db.ttdLog.findUnique({
      where: { userId_log_date: { userId: user.id, log_date: todayDate } },
      select: { id: true },
    }),
  ]);

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
      <AppHeader greeting={`HALO, ${firstName} 👋`} hasUnread />

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
          <MascotCard />
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

function MascotCard() {
  return (
    <Link
      href="/profil"
      className="bg-accent-yellow rounded-[12px] border-2 border-ink shadow-retro p-4 flex flex-col items-center justify-center text-center press-retro"
    >
      <Mascot state="cheerful" size={64} />
      <p className="font-display text-base font-extrabold text-ink leading-tight mt-2">
        Hemo lagi ceria!
      </p>
    </Link>
  );
}

function StreakCard({ streak }: { streak: number }) {
  return (
    <div className="bg-surface rounded-[12px] border-2 border-ink shadow-retro p-4 flex flex-col items-center justify-center text-center">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl">🔥</span>
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
        {moods.map(({ emoji, label }) => (
          <Link
            key={label}
            href={`/jurnal/todayDate?mood=${encodeURIComponent(label.toLowerCase())}`}
            aria-label={`Catat mood: ${label}`}
            className="size-10 bg-pink-soft rounded-[6px] border-2 border-ink flex items-center justify-center text-xl press-retro shadow-retro-sm"
          >
            {emoji}
          </Link>
        ))}
      </div>
      <Link
        href="/jurnal/todayDate"
        className="text-center font-sans text-sm font-bold text-primary-strong hover:underline"
      >
        Tambahkan catatan →
      </Link>
    </section>
  );
}
