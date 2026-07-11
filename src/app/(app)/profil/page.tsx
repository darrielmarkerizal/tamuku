import Link from "next/link";
import {
  ChevronRight,
  CloudCog,
  Flame,
  Heart,
  Info,
  Lock,
  Pencil,
  Bell,
  Settings,
  CalendarDays,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/cn";
import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { addDays, today } from "@/lib/date";
import { BADGES } from "@/lib/badges/rules";
import { computeMascotState } from "@/lib/mascot-state";
import { LogoutButton } from "./logout-button";

type Stat = {
  Icon: LucideIcon;
  value: string;
  label: string;
};

type Setting = {
  Icon: LucideIcon;
  label: string;
  href: string;
};

const SETTINGS: Setting[] = [
  { Icon: Pencil, label: "Edit profil", href: "/profil/edit" },
  { Icon: Bell, label: "Pengingat & notifikasi", href: "/profil/notifikasi" },
  { Icon: CloudCog, label: "Status sync", href: "/profil/sync" },
  { Icon: Lock, label: "Privasi & data", href: "/profil/privasi" },
  { Icon: Info, label: "Tentang Tamuku", href: "/profil/tentang" },
];

export default async function ProfilPage() {
  const user = await requireUser();
  const todayDate = today();
  const cutoff30 = addDays(todayDate, -30);

  const [ttdLogs30, periodsClosed, ttdLogs14] = await Promise.all([
    db.ttdLog.count({
      where: { userId: user.id, log_date: { gte: cutoff30 } },
    }),
    db.menstruationLog.count({
      where: { userId: user.id, end_date: { not: null } },
    }),
    db.ttdLog.findMany({
      where: { userId: user.id, log_date: { gte: addDays(todayDate, -14) } },
      select: { log_date: true },
    }),
  ]);

  // Kepatuhan 30 hari: jumlah log / target ~ 30 hari (jika daily) atau ~4 minggu
  // MVP heuristic: taken / min(30, days-since-signup)
  const complianceTarget = 30;
  const compliancePct = Math.min(
    100,
    Math.round((ttdLogs30 / complianceTarget) * 100)
  );

  const periods14 = await db.menstruationLog.findMany({
    where: { userId: user.id },
    select: { start_date: true, end_date: true },
  });
  const mascotState = computeMascotState(ttdLogs14, periods14, todayDate);

  const stats: Stat[] = [
    { Icon: Flame, value: String(user.streak_current), label: "MINGGU STREAK" },
    { Icon: CheckCircle2, value: `${compliancePct}%`, label: "KEPATUHAN 30H" },
    { Icon: CalendarDays, value: String(periodsClosed), label: "SIKLUS DICATAT" },
  ];
  const schoolLine = [user.school, user.class_name ? `Kelas ${user.class_name}` : null]
    .filter(Boolean)
    .join(" • ");

  const owned = new Set(user.badges);

  return (
    <>
      <header className="px-5 pt-6 pb-2 flex justify-between items-center">
        <h1 className="font-display text-2xl font-extrabold uppercase tracking-tight text-ink">
          PROFIL
        </h1>
        <Link
          href="/profil/edit"
          aria-label="Pengaturan"
          className="size-10 flex items-center justify-center rounded-full border-2 border-transparent hover:border-ink hover:bg-pink-cream transition-all text-text-muted"
        >
          <Settings className="size-5" strokeWidth={2.5} />
        </Link>
      </header>

      <main className="flex-1 px-5 pt-4 pb-8 flex flex-col gap-7">
        <section className="bg-accent-yellow border-2 border-ink rounded-[12px] shadow-retro p-5 flex items-center gap-4 relative overflow-hidden">
          <div className="size-20 rounded-full border-2 border-ink bg-surface shrink-0 shadow-retro-sm flex items-center justify-center z-10">
            <Mascot state={mascotState} size={64} />
          </div>
          <div className="flex flex-col z-10 min-w-0">
            <h2 className="font-display text-2xl font-extrabold text-ink mb-2 truncate">
              {user.name ?? user.username}
            </h2>
            {schoolLine && (
              <div className="inline-flex bg-surface border-2 border-ink rounded-full px-3 py-1 shadow-retro-sm w-max max-w-full">
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink truncate">
                  {schoolLine}
                </span>
              </div>
            )}
          </div>
        </section>

        <section className="w-full overflow-x-visible">
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-5 px-5 snap-x [&::-webkit-scrollbar]:hidden">
            {stats.map((s) => (
              <div
                key={s.label}
                className="min-w-[130px] bg-surface border-2 border-ink rounded-[12px] shadow-retro-sm p-4 flex flex-col items-center justify-center text-center gap-2 snap-start"
              >
                <s.Icon className="size-8 text-primary-strong" strokeWidth={2.5} />
                <div className="font-mono text-2xl font-bold text-ink">{s.value}</div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h3 className="font-display text-lg font-extrabold uppercase text-ink">
            LENCANA KAMU
          </h3>
          <div className="grid grid-cols-3 gap-y-6 gap-x-2">
            {BADGES.map((b) => {
              const locked = !owned.has(b.slug);
              return (
                <div
                  key={b.slug}
                  className={cn(
                    "flex flex-col items-center gap-2 text-center",
                    locked && "opacity-60 grayscale"
                  )}
                  title={b.description}
                >
                  <div
                    className={cn(
                      "size-16 rounded-full border-2 border-ink shadow-retro-sm flex items-center justify-center relative",
                      locked ? "bg-pink-cream" : b.bg
                    )}
                  >
                    <b.Icon
                      className={cn(
                        "size-7",
                        locked ? "text-text-muted" : b.iconColor
                      )}
                      strokeWidth={2.5}
                    />
                    {locked && (
                      <span className="absolute -bottom-1 -right-1 size-5 bg-surface rounded-full border-2 border-ink flex items-center justify-center">
                        <Lock className="size-3 text-ink" strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                    {b.name}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          {SETTINGS.map((s) => (
            <Link
              key={s.label}
              href={s.href}
              className="w-full bg-surface border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center justify-between press-retro"
            >
              <div className="flex items-center gap-3">
                <s.Icon className="size-5 text-text-muted" strokeWidth={2.5} />
                <span className="font-sans text-base text-ink">{s.label}</span>
              </div>
              <ChevronRight className="size-5 text-text-muted" strokeWidth={2.5} />
            </Link>
          ))}

          <LogoutButton />
        </section>

        <div className="w-full text-center py-4 mt-2">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
            <span className="inline-flex items-center gap-1.5">
              Tamuku v1.0 • Buat Sepaku
              <Heart className="size-3 text-primary-strong fill-primary-strong" strokeWidth={2.5} />
            </span>
          </span>
        </div>
      </main>
    </>
  );
}
