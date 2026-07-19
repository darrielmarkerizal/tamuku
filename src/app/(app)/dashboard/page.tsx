import Link from "next/link";
import { Hand, Package } from "lucide-react";
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

  const [periods, ttdToday, ttdLogs14, ttdTotal, notif] = await Promise.all([
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
    db.ttdLog.count({ where: { userId: user.id } }),
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
  const hasStarted = ttdTotal > 0;

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

      <main className="px-5 flex flex-col gap-6 mt-1">
        <TodayCard
          eyebrow={copy.statusEyebrow}
          headline={
            isPeriodActive
              ? copy.periodDayHeadline(periodDay)
              : copy.idleHeadline
          }
          sub={pickLine(greetingPool, todayDate, "greeting")}
          mascotState={mascotState}
          accessory={user.equipped_accessory as MascotAccessory | null}
          lines={rotateLines(HEMO_LINES[mascotState] ?? [], todayDate, "hemo")}
        />

        <section className="flex flex-col gap-3">
          <div className="flex justify-between items-baseline gap-3">
            <p className="label-micro text-text-muted">{copy.ttdEyebrow}</p>
            <Link
              href="/ttd"
              className="label-soft text-primary-strong hover:underline"
            >
              Sisa {user.inventory_ttd} pil →
            </Link>
          </div>

          <TtdButton
            alreadyLogged={alreadyLoggedTtd}
            label={copy.ttdButtonLabel}
            doneLabel="SUDAH TERCATAT HARI INI"
            rewardSub={pickLine(REWARD_SUBS, todayDate, "reward")}
          />

          <p className="font-sans text-sm text-text-muted">
            {menstruating ? copy.ttdModeMenstruating : copy.ttdModeWeekly}
          </p>
        </section>

        {hasStarted ? (
          <div className="grid grid-cols-2 gap-4">
            <WeekRing
              days={week.days}
              streak={user.streak_current}
              remaining={week.remaining}
              freezeLeft={user.streak_freeze_left}
            />
            <StockCard inventory={user.inventory_ttd} />
          </div>
        ) : (
          <FirstStepCard />
        )}

        <QuietSection title="SIKLUS">
          <PeriodButton
            isPeriodActive={isPeriodActive}
            periodDay={periodDay}
            periodStartLabel={periodStartLabel}
            startLabel={copy.periodStartLabel}
            endLabel={copy.periodEndLabel}
            startHint={copy.periodStartHint}
          />
        </QuietSection>

        <QuietSection
          title="JURNAL HARI INI"
          action={{ href: "/jurnal", label: "Lihat semua" }}
        >
          <div className="flex gap-2 justify-between">
            {MOODS.map(({ Icon, slug, labelUpper, tone }, i) => (
              <Link
                key={slug}
                href={`/jurnal/today?mood=${slug}`}
                aria-label={`Catat mood: ${labelUpper}`}
                style={{ "--index": i } as React.CSSProperties}
                className={`size-11 ${tone} rounded-[8px] border-2 border-ink flex items-center justify-center press-retro shadow-retro-sm stagger-rise`}
              >
                <Icon className="size-5 text-ink" strokeWidth={2.5} />
              </Link>
            ))}
          </div>
        </QuietSection>
      </main>
    </>
  );
}

function TodayCard({
  eyebrow,
  headline,
  sub,
  mascotState,
  accessory,
  lines,
}: {
  eyebrow: string;
  headline: string;
  sub: string;
  mascotState: ReturnType<typeof computeMascotState>;
  accessory: MascotAccessory | null;
  lines: string[];
}) {
  return (
    <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro-lg p-5 flex flex-col gap-4">
      <div>
        <p className="label-micro text-text-muted mb-2">{eyebrow}</p>
        <h2 className="font-display text-2xl font-extrabold uppercase text-ink leading-tight mb-1.5">
          {headline}
        </h2>
        <p className="font-sans text-base text-ink leading-snug">{sub}</p>
      </div>

      <div className="flex items-end gap-3 rule-soft pt-4">
        <Link
          href="/profil/hemo"
          aria-label="Dandani Hemo"
          className="shrink-0 press-retro"
        >
          <Mascot state={mascotState} accessory={accessory} size={64} bob />
        </Link>
        <MascotSpeech lines={lines} className="flex-1 min-w-0 pb-1" />
      </div>
    </section>
  );
}

function QuietSection({
  title,
  action,
  children,
}: {
  title: string;
  action?: { href: string; label: string };
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3 rule-soft pt-5">
      <div className="flex justify-between items-baseline gap-3">
        <p className="label-micro text-text-muted">{title}</p>
        {action && (
          <Link
            href={action.href}
            className="label-soft text-primary-strong hover:underline"
          >
            {action.label} →
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

function FirstStepCard() {
  return (
    <section className="bg-accent-yellow rounded-[12px] border-2 border-ink shadow-retro p-5 flex items-center gap-4">
      <Mascot state="cheerful" size={72} className="shrink-0" bob />
      <div className="min-w-0">
        <h3 className="font-display text-lg font-extrabold uppercase text-ink leading-tight mb-1">
          HEMO BARU KENAL KAMU
        </h3>
        <p className="font-sans text-sm text-ink leading-snug">
          Catat TTD pertama kamu. Streak dan lencana muncul setelah itu.
        </p>
      </div>
    </section>
  );
}

function StockCard({ inventory }: { inventory: number }) {
  const empty = inventory === 0;
  const low = inventory > 0 && inventory <= LOW_STOCK_THRESHOLD;

  return (
    <Link
      href={empty ? "/ttd/tambah-stok" : "/ttd"}
      className={cn(
        "rounded-[12px] border-2 border-ink shadow-retro p-4 flex flex-col items-center justify-center text-center press-retro",
        empty || low ? "bg-accent-peach" : "bg-surface"
      )}
    >
      <Package
        className={cn(
          "size-8 text-primary-strong",
          empty && "animate-[wiggle_1.4s_ease-in-out_infinite]"
        )}
        strokeWidth={2.5}
      />
      <span className="font-mono text-4xl font-bold text-ink leading-none tracking-tighter mt-2">
        {inventory}
      </span>
      <p className="label-micro text-ink mt-2">PIL TERSISA</p>
      {(empty || low) && (
        <p className="label-micro text-primary-strong mt-1">
          {empty ? "AMBIL DI UKS" : "MULAI MENIPIS"}
        </p>
      )}
    </Link>
  );
}
