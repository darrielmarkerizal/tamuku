import Link from "next/link";
import { Hand, Package, Sparkles } from "lucide-react";
import { AppHeader } from "@/components/app-header";
import { Mascot } from "@/components/mascot";
import { MascotSpeech } from "@/components/mascot-speech";
import { WeekRing } from "@/components/week-ring";
import { cn } from "@/lib/cn";
import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { addDays, daysBetween, formatShort, today } from "@/lib/date";
import { isMenstruationActive } from "@/lib/period/sma";
import { computeMascotState } from "@/lib/mascot-state";
import { computeWeekProgress } from "@/lib/streak/week-progress";
import { getCopy } from "@/lib/discreet";
import {
  GREETING_SUBS_IDLE,
  GREETING_SUBS_TTD_DUE,
  HEMO_LINES,
  REWARD_SUBS,
  pickLine,
  rotateLines,
} from "@/lib/copy/lines";
import { MOODS } from "@/lib/mood-icons";
import type { MascotAccessory } from "@/components/mascot";
import { PeriodButton } from "./period-button";
import { TtdButton } from "./ttd-button";

const LOW_STOCK_THRESHOLD = 3;

export default async function DashboardPage() {
  const user = await requireUser();
  const firstName = (user.name ?? user.username).split(" ")[0].toUpperCase();
  const todayDate = today();
  const copy = getCopy(user.discreet_mode);

  const [periods, ttdToday, ttdLogs14, notif] = await Promise.all([
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
    db.notificationSetting.findUnique({
      where: { userId: user.id },
      select: { weekly_day: true },
    }),
  ]);

  const mascotState = computeMascotState(ttdLogs14, periods, todayDate);

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

  const week = computeWeekProgress(
    ttdLogs14,
    periods,
    notif?.weekly_day ?? 5,
    todayDate
  );

  const ttdDueToday = week.days.some((d) => d.status === "due");
  const greetingPool = menstruating
    ? copy.greetingMenstruating
    : ttdDueToday && !alreadyLoggedTtd
      ? GREETING_SUBS_TTD_DUE
      : GREETING_SUBS_IDLE;

  return (
    <>
      <AppHeader
        greeting={
          <>
            <span>HALO, {firstName}</span>
            <Hand className="size-6 text-primary-strong" strokeWidth={2.5} />
          </>
        }
        hasUnread
        section="beranda"
        initial={firstName.charAt(0)}
      />

      <main className="px-5 flex flex-col gap-5 mt-2">
        <StatusCard
          headline={
            isPeriodActive
              ? copy.periodDayHeadline(periodDay)
              : copy.idleHeadline
          }
          eyebrow={copy.statusEyebrow}
          sub={pickLine(greetingPool, todayDate, "greeting")}
          mascotState={mascotState}
          accessory={user.equipped_accessory as MascotAccessory | null}
        />

        <PeriodButton
          isPeriodActive={isPeriodActive}
          periodDay={periodDay}
          periodStartLabel={periodStartLabel}
          startLabel={copy.periodStartLabel}
          endLabel={copy.periodEndLabel}
          startHint={copy.periodStartHint}
        />

        <TtdCard
          inventory={user.inventory_ttd}
          eyebrow={copy.ttdEyebrow}
          mode={menstruating ? copy.ttdModeMenstruating : copy.ttdModeWeekly}
          buttonLabel={copy.ttdButtonLabel}
          alreadyLoggedTtd={alreadyLoggedTtd}
          rewardSub={pickLine(REWARD_SUBS, todayDate, "reward")}
        />

        <HemoCard
          state={mascotState}
          accessory={user.equipped_accessory as MascotAccessory | null}
          lines={rotateLines(
            HEMO_LINES[mascotState] ?? [],
            todayDate,
            "hemo"
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <WeekRing
            days={week.days}
            streak={user.streak_current}
            remaining={week.remaining}
            freezeLeft={user.streak_freeze_left}
          />
          <StockCard inventory={user.inventory_ttd} />
        </div>

        <JournalQuickCard />
      </main>
    </>
  );
}

function StatusCard({
  headline,
  eyebrow,
  sub,
  mascotState,
  accessory,
}: {
  headline: string;
  eyebrow: string;
  sub: string;
  mascotState: ReturnType<typeof computeMascotState>;
  accessory: MascotAccessory | null;
}) {
  return (
    <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro-lg p-5 relative overflow-hidden">
      <div className="pr-24 relative z-10">
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
          {eyebrow}
        </p>
        <h2 className="font-display text-2xl font-extrabold uppercase text-ink mb-2 leading-tight">
          {headline}
        </h2>
        <p className="font-sans text-base text-ink">{sub}</p>
      </div>
      <div className="absolute right-[-12px] bottom-[-8px] w-28 h-28 z-0 -rotate-6">
        <Mascot state={mascotState} accessory={accessory} size={112} bob />
      </div>
    </section>
  );
}

function TtdCard({
  inventory,
  eyebrow,
  mode,
  buttonLabel,
  alreadyLoggedTtd,
  rewardSub,
}: {
  inventory: number;
  eyebrow: string;
  mode: string;
  buttonLabel: string;
  alreadyLoggedTtd: boolean;
  rewardSub: string;
}) {
  return (
    <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro p-5 flex flex-col gap-4">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
            {eyebrow}
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
      <TtdButton
        alreadyLogged={alreadyLoggedTtd}
        label={buttonLabel}
        rewardSub={rewardSub}
      />
      <Link
        href="/ttd/riwayat"
        className="text-center font-mono text-[10px] font-bold uppercase tracking-wider text-primary-strong hover:underline"
      >
        Lihat riwayat & stok →
      </Link>
    </section>
  );
}

function HemoCard({
  state,
  accessory,
  lines,
}: {
  state: ReturnType<typeof computeMascotState>;
  accessory: MascotAccessory | null;
  lines: string[];
}) {
  return (
    <Link
      href="/profil/hemo"
      className="bg-accent-yellow rounded-[12px] border-2 border-ink shadow-retro p-4 flex items-center gap-4 press-retro"
    >
      <div className="shrink-0">
        <Mascot state={state} accessory={accessory} size={72} bob />
      </div>
      <div className="flex-1 min-w-0">
        <MascotSpeech lines={lines} />
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink/70 mt-2 flex items-center gap-1">
          <Sparkles className="size-3" strokeWidth={3} />
          Dandani Hemo →
        </p>
      </div>
    </Link>
  );
}

function StockCard({ inventory }: { inventory: number }) {
  const low = inventory <= LOW_STOCK_THRESHOLD;
  return (
    <Link
      href={inventory === 0 ? "/ttd/tambah-stok" : "/ttd"}
      className={cn(
        "rounded-[12px] border-2 border-ink shadow-retro p-4 flex flex-col items-center justify-center text-center press-retro",
        low ? "bg-accent-peach" : "bg-surface"
      )}
    >
      <Package
        className={cn(
          "size-8 text-primary-strong",

          low && "animate-[wiggle_1.4s_ease-in-out_infinite]"
        )}
        strokeWidth={2.5}
      />
      <span className="font-mono text-4xl font-bold text-ink leading-none tracking-tighter mt-2">
        {inventory}
      </span>
      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink mt-2">
        PIL TERSISA
      </p>
      {low && (
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary-strong mt-1">
          {inventory === 0 ? "AMBIL DI UKS" : "MULAI MENIPIS"}
        </p>
      )}
    </Link>
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
        {MOODS.map(({ Icon, slug, labelUpper, tone }, i) => (
          <Link
            key={slug}
            href={`/jurnal/today?mood=${slug}`}
            aria-label={`Catat mood: ${labelUpper}`}
            style={{ "--index": i } as React.CSSProperties}
            className={`size-10 ${tone} rounded-[6px] border-2 border-ink flex items-center justify-center press-retro shadow-retro-sm stagger-rise`}
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
