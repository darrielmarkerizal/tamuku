import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Droplet, Info, Plus, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/cn";
import {
  addDays,
  formatDayName,
  formatTime,
  today,
  toIsoDate,
} from "@/lib/date";
import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";

const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];

export default async function TtdPage() {
  const user = await requireUser();
  const todayDate = today();

  const [logs, notif] = await Promise.all([
    db.ttdLog.findMany({
      where: {
        userId: user.id,
        log_date: { gte: addDays(todayDate, -34) },
      },
      select: { log_date: true, status: true },
      orderBy: { log_date: "asc" },
    }),
    db.notificationSetting.findUnique({
      where: { userId: user.id },
      select: {
        weekly_day: true,
        reminder_hour: true,
        reminder_minute: true,
        enabled: true,
      },
    }),
  ]);

  const logByIso = new Map<string, "MENSTRUATION_ROUTINE" | "WEEKLY_ROUTINE">();
  for (const log of logs) {
    logByIso.set(toIsoDate(log.log_date), log.status);
  }

  // Heatmap: 35 kotak (5 minggu × 7 hari), berakhir di hari ini
  const HEATMAP_DAYS = 35;
  const startCell = addDays(todayDate, -(HEATMAP_DAYS - 1));
  const cells = Array.from({ length: HEATMAP_DAYS }, (_, i) => {
    const d = addDays(startCell, i);
    const iso = toIsoDate(d);
    const status = logByIso.get(iso);
    const isToday = iso === toIsoDate(todayDate);
    return { iso, status, isToday };
  });

  const inventory = user.inventory_ttd;
  const lowStock = inventory <= 1;
  const weeklyDay = notif?.weekly_day ?? 5;
  const reminderHour = notif?.reminder_hour ?? 19;
  const reminderMinute = notif?.reminder_minute ?? 0;
  const dayLabel = DAY_NAMES[weeklyDay];
  const timeLabel = formatTime(reminderHour, reminderMinute);
  const enabled = notif?.enabled ?? true;

  const weeksSupply = inventory > 0 ? Math.max(1, Math.floor(inventory / 1)) : 0;

  return (
    <>
      <header className="flex items-center justify-between px-5 pt-6 pb-4">
        <Link
          href="/dashboard"
          aria-label="Kembali"
          className="size-10 bg-surface border-2 border-ink shadow-retro-sm rounded-[8px] flex items-center justify-center press-retro"
        >
          <ArrowLeft className="size-5 text-ink" strokeWidth={2.5} />
        </Link>
        <h1 className="font-display text-2xl font-extrabold uppercase text-center flex-1 pr-10 text-ink">
          TTD KAMU
        </h1>
      </header>

      <main className="px-5 flex flex-col gap-6">
        <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro-lg p-5 flex flex-col items-center">
          <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
            SISA PIL
          </span>
          <div className="flex items-baseline gap-2 mb-4">
            <span
              className={cn(
                "font-mono text-[96px] leading-none font-bold",
                lowStock ? "text-danger" : "text-ink"
              )}
            >
              {inventory}
            </span>
            <span className="font-display text-2xl font-extrabold uppercase text-ink">
              PIL
            </span>
          </div>
          {lowStock ? (
            <div className="bg-danger/10 border-2 border-danger shadow-retro-sm rounded-[8px] px-4 py-2 mb-6 font-sans text-sm font-bold inline-flex items-center gap-2 text-danger">
              <AlertTriangle className="size-4" strokeWidth={2.5} />
              {inventory === 0
                ? "Stok habis. Yuk tambah stok!"
                : "Stok menipis, saatnya tambah stok."}
            </div>
          ) : (
            <div className="bg-accent-yellow border-2 border-ink shadow-retro-sm rounded-full px-4 py-2 mb-6 font-sans text-sm font-bold inline-flex items-center gap-2 text-ink">
              <Info className="size-4" strokeWidth={2.5} />
              Cukup buat ~{weeksSupply} minggu
            </div>
          )}
          <Link
            href="/ttd/tambah-stok"
            className="w-full bg-primary text-white font-display text-xl font-extrabold uppercase py-4 rounded-[8px] border-2 border-ink shadow-retro press-retro flex items-center justify-center gap-2"
          >
            <Plus className="size-5" strokeWidth={3} />
            TAMBAH STOK
          </Link>
          <Link
            href="/ttd/koreksi"
            className="mt-2 font-mono text-[10px] font-bold text-primary-strong hover:underline uppercase tracking-wider"
          >
            Atur ulang stok →
          </Link>
        </section>

        <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro p-5">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mb-4 border-b-2 border-ink pb-2">
            JADWAL PENGINGAT
          </h2>
          <div className="flex flex-col gap-4 mb-4">
            <ReminderRow
              Icon={Clock}
              text={`Mingguan: ${dayLabel}, ${timeLabel}`}
            />
            <ReminderRow
              Icon={Droplet}
              text={`Saat haid: Setiap hari, ${timeLabel}`}
            />
            {!enabled && (
              <p className="font-sans text-xs text-text-muted italic">
                Notifikasi lagi off — aktifkan di pengaturan.
              </p>
            )}
          </div>
          <div className="text-right">
            <Link
              href="/profil/notifikasi"
              className="font-mono text-[10px] font-bold text-primary-strong hover:underline uppercase inline-flex items-center gap-1 tracking-wider"
            >
              Ubah jadwal <ArrowRight className="size-3.5" strokeWidth={2.75} />
            </Link>
          </div>
        </section>

        <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro p-5">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mb-4 border-b-2 border-ink pb-2">
            {HEATMAP_DAYS} HARI TERAKHIR
          </h2>
          <div className="grid grid-cols-7 gap-2 mb-4 place-items-center">
            {cells.map((c) => (
              <span
                key={c.iso}
                className={cn(
                  "size-7 border-2 border-ink rounded-[2px]",
                  c.status === "WEEKLY_ROUTINE" && "bg-accent-mint",
                  c.status === "MENSTRUATION_ROUTINE" && "bg-primary",
                  !c.status && !c.isToday && "bg-surface",
                  c.isToday && !c.status && "bg-surface border-dashed"
                )}
                title={c.iso}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 font-mono text-[10px] font-bold uppercase tracking-wider flex-wrap">
            <div className="flex items-center gap-1.5">
              <span className="size-3 bg-accent-mint border-2 border-ink" />
              Mingguan
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-3 bg-primary border-2 border-ink" />
              Saat haid
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-3 bg-surface border-2 border-dashed border-ink" />
              Hari ini
            </div>
          </div>
        </section>

        <div className="text-center pb-4 pt-2">
          <Link
            href="/ttd/riwayat"
            className="font-display text-base font-extrabold text-ink hover:text-primary-strong transition-colors inline-flex items-center gap-1 uppercase"
          >
            Lihat riwayat lengkap{" "}
            <ArrowRight className="size-4" strokeWidth={2.75} />
          </Link>
        </div>
      </main>
    </>
  );
}

function ReminderRow({
  Icon,
  text,
}: {
  Icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  text: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="size-8 rounded-full bg-pink-cream border-2 border-ink flex items-center justify-center">
        <Icon className="size-4 text-primary-strong" strokeWidth={2.75} />
      </div>
      <div className="font-sans text-base font-bold text-ink">{text}</div>
    </div>
  );
}
