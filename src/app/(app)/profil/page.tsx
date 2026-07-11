import Link from "next/link";
import {
  Award,
  ChevronRight,
  Flame,
  Footprints,
  Heart,
  Info,
  Lock,
  Pencil,
  Bell,
  RefreshCw,
  Settings,
  Shield,
  CalendarDays,
  CheckCircle2,
  Trophy,
  type LucideIcon,
} from "lucide-react";
import { Mascot } from "@/components/mascot";
import { cn } from "@/lib/cn";
import { requireUser } from "@/lib/auth/current-user";
import { LogoutButton } from "./logout-button";

type Stat = {
  Icon: LucideIcon;
  value: string;
  label: string;
};


type Badge = {
  slug: string;
  label: string;
  Icon: LucideIcon;
  bg: string;
  iconColor: string;
  locked?: boolean;
};

const BADGES: Badge[] = [
  { slug: "iron-girl", label: "IRON GIRL", Icon: Award, bg: "bg-pink-soft", iconColor: "text-primary-strong" },
  { slug: "cycle-sync", label: "CYCLE SYNC", Icon: RefreshCw, bg: "bg-accent-yellow", iconColor: "text-ink" },
  { slug: "first-step", label: "LANGKAH AWAL", Icon: Footprints, bg: "bg-accent-mint", iconColor: "text-success" },
  { slug: "master", label: "MASTER", Icon: Trophy, bg: "bg-pink-cream", iconColor: "text-text-muted", locked: true },
  { slug: "streak-365", label: "STREAK 365", Icon: Flame, bg: "bg-pink-cream", iconColor: "text-text-muted", locked: true },
  { slug: "guru", label: "GURU", Icon: Shield, bg: "bg-pink-cream", iconColor: "text-text-muted", locked: true },
];

type Setting = {
  Icon: LucideIcon;
  label: string;
  href: string;
};

const SETTINGS: Setting[] = [
  { Icon: Pencil, label: "Edit profil", href: "/profil/edit" },
  { Icon: Bell, label: "Pengingat & notifikasi", href: "/profil/notifikasi" },
  { Icon: Lock, label: "Privasi & data", href: "/profil/privasi" },
  { Icon: Info, label: "Tentang Tamuku", href: "/profil/tentang" },
];

export default async function ProfilPage() {
  const user = await requireUser();
  const stats: Stat[] = [
    { Icon: Flame, value: String(user.streak_current), label: "MINGGU STREAK" },
    { Icon: CheckCircle2, value: "—", label: "KEPATUHAN 30H" },
    { Icon: CalendarDays, value: "—", label: "SIKLUS DICATAT" },
  ];
  const schoolLine = [user.school, user.class_name ? `Kelas ${user.class_name}` : null]
    .filter(Boolean)
    .join(" • ");
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
            <Mascot state="vibrant" size={64} />
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
            {BADGES.map((b) => (
              <div
                key={b.slug}
                className={cn(
                  "flex flex-col items-center gap-2 text-center",
                  b.locked && "opacity-60 grayscale"
                )}
              >
                <div
                  className={cn(
                    "size-16 rounded-full border-2 border-ink shadow-retro-sm flex items-center justify-center relative",
                    b.bg
                  )}
                >
                  <b.Icon className={cn("size-7", b.iconColor)} strokeWidth={2.5} />
                  {b.locked && (
                    <span className="absolute -bottom-1 -right-1 size-5 bg-surface rounded-full border-2 border-ink flex items-center justify-center">
                      <Lock className="size-3 text-ink" strokeWidth={3} />
                    </span>
                  )}
                </div>
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                  {b.label}
                </span>
              </div>
            ))}
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
