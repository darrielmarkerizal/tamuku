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
  Sparkles,
  CalendarDays,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/cn";
import { requireUser } from "@/lib/auth/current-user";
import { addDays, today } from "@/lib/date";
import { BADGES } from "@/lib/badges/rules";
import { buildSnapshot } from "@/lib/badges/snapshot";
import { computeMascotState } from "@/lib/mascot-state";
import type { MascotAccessory } from "@/components/mascot";
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
  { Icon: Sparkles, label: "Dandani Hemo", href: "/profil/hemo" },
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

  const cutoff14 = addDays(todayDate, -14);

  const snapshot = await buildSnapshot(user.id);
  const ttdLogs = snapshot?.ttdLogs ?? [];
  const periods = snapshot?.periods ?? [];

  const ttdLogs30 = ttdLogs.filter((l) => l.log_date >= cutoff30).length;
  const ttdLogs14 = ttdLogs.filter((l) => l.log_date >= cutoff14);
  const periodsClosed = periods.filter((p) => p.end_date !== null).length;

  const complianceTarget = 30;
  const compliancePct = Math.min(
    100,
    Math.round((ttdLogs30 / complianceTarget) * 100)
  );
  const mascotState = computeMascotState(ttdLogs14, periods, todayDate);

  const stats: Stat[] = [
    { Icon: Flame, value: String(user.streak_current), label: "MINGGU STREAK" },
    { Icon: CheckCircle2, value: `${compliancePct}%`, label: "KEPATUHAN 30H" },
    { Icon: CalendarDays, value: String(periodsClosed), label: "SIKLUS DICATAT" },
  ];
  const schoolLine = [user.school, user.class_name ? `Kelas ${user.class_name}` : null]
    .filter(Boolean)
    .join(" • ");

  const owned = new Set(user.badges);

  const ratioOf = (b: (typeof BADGES)[number]) =>
    !snapshot || b.target === 0 ? 0 : b.progress(snapshot) / b.target;
  const sortedBadges = [...BADGES].sort((a, b) => {
    const aOwned = owned.has(a.slug) ? 1 : 0;
    const bOwned = owned.has(b.slug) ? 1 : 0;
    if (aOwned !== bOwned) return bOwned - aOwned;
    return ratioOf(b) - ratioOf(a);
  });

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
          <Link
            href="/profil/hemo"
            aria-label="Dandani Hemo"
            className="size-20 rounded-full border-2 border-ink bg-surface shrink-0 shadow-retro-sm flex items-center justify-center z-10 press-retro"
          >
            <Mascot
              state={mascotState}
              accessory={user.equipped_accessory as MascotAccessory | null}
              size={64}
              bob
            />
          </Link>
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
          <div className="flex justify-between items-baseline">
            <h3 className="font-display text-lg font-extrabold uppercase text-ink">
              LENCANA KAMU
            </h3>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
              {owned.size} / {BADGES.length}
            </span>
          </div>
          <div className="grid grid-cols-3 gap-y-6 gap-x-2">
            {sortedBadges.map((b) => {
              const locked = !owned.has(b.slug);
              const current = snapshot ? Math.min(b.progress(snapshot), b.target) : 0;
              const pct = b.target === 0 ? 0 : (current / b.target) * 100;

              return (
                <div
                  key={b.slug}
                  className="flex flex-col items-center gap-2 text-center"
                  title={b.description}
                >
                  <div
                    className={cn(
                      "size-16 rounded-full border-2 border-ink shadow-retro-sm flex items-center justify-center relative",
                      locked ? "bg-pink-cream" : b.bg,

                      locked && "opacity-70"
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
                  <span
                    className={cn(
                      "font-mono text-[10px] font-bold uppercase tracking-wider leading-tight",
                      locked ? "text-text-muted" : "text-ink"
                    )}
                  >
                    {b.name}
                  </span>

                  {locked && b.target > 1 && (
                    <div className="w-full flex flex-col items-center gap-1">
                      <div className="w-12 h-1.5 bg-pink-cream border border-ink rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="font-mono text-[9px] font-bold text-text-muted">
                        {current}/{b.target} {b.unit}
                      </span>
                    </div>
                  )}
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
