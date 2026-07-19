import Link from "next/link";
import { ArrowLeft, Pill, Package, Settings2 } from "lucide-react";
import { cn } from "@/lib/cn";
import { formatDayShort, formatShort, isSameLocalDay, today } from "@/lib/date";
import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";

type LogItem = {
  id: string;
  kind: "drink" | "stock" | "correction";
  title: string;
  detail: string;
  badge: string;
  createdAt: Date;
};

export default async function TtdRiwayatPage() {
  const user = await requireUser();
  const todayDate = today();

  const [ttdLogs, adjustments] = await Promise.all([
    db.ttdLog.findMany({
      where: { userId: user.id },
      select: { id: true, log_date: true, status: true, createdAt: true },
      orderBy: { log_date: "desc" },
      take: 60,
    }),
    db.inventoryAdjustment.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        delta: true,
        reason: true,
        note: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 60,
    }),
  ]);

  const items: LogItem[] = [];
  for (const log of ttdLogs) {
    items.push({
      id: `t-${log.id}`,
      kind: "drink",
      title: "Minum TTD",
      detail: `${formatDayShort(log.log_date)}, ${formatShort(log.log_date)}`,
      badge: log.status === "MENSTRUATION_ROUTINE" ? "HARIAN" : "MINGGUAN",
      createdAt: log.createdAt,
    });
  }
  for (const adj of adjustments) {
    if (adj.reason === "CONSUMED") continue;
    items.push({
      id: `a-${adj.id}`,
      kind: adj.reason === "CORRECTION" ? "correction" : "stock",
      title:
        adj.reason === "RECEIVED"
          ? `+${adj.delta} pil${adj.note ? ` — ${adj.note}` : ""}`
          : `Koreksi stok ${adj.delta > 0 ? "+" : ""}${adj.delta}${
              adj.note ? ` — ${adj.note}` : ""
            }`,
      detail: `${formatDayShort(adj.createdAt)}, ${formatShort(adj.createdAt)}`,
      badge: adj.reason === "RECEIVED" ? "STOK" : "KOREKSI",
      createdAt: adj.createdAt,
    });
  }
  items.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

  const startOfWeek = new Date(todayDate);
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  const groups: { label: string; items: LogItem[] }[] = [
    { label: "HARI INI", items: [] },
    { label: "MINGGU INI", items: [] },
    { label: "LEBIH LAMA", items: [] },
  ];
  for (const item of items) {
    if (isSameLocalDay(item.createdAt, todayDate)) groups[0].items.push(item);
    else if (item.createdAt >= startOfWeek) groups[1].items.push(item);
    else groups[2].items.push(item);
  }

  return (
    <>
      <header className="w-full sticky top-0 z-30 bg-surface border-b-2 border-ink flex justify-between items-center px-5 py-4">
        <div className="flex items-center gap-3">
          <Link
            href="/ttd"
            aria-label="Kembali"
            className="size-10 rounded-full border-2 border-ink bg-surface flex items-center justify-center shadow-retro-sm press-retro"
          >
            <ArrowLeft className="size-5 text-ink" strokeWidth={2.5} />
          </Link>
          <h1 className="font-display text-lg font-extrabold uppercase tracking-tight text-ink">
            RIWAYAT TTD
          </h1>
        </div>
      </header>

      <main className="px-5 py-5 flex flex-col gap-7 pb-8">
        {items.length === 0 ? (
          <div className="bg-surface border-2 border-ink shadow-retro rounded-[12px] p-8 text-center">
            <p className="font-display text-lg font-extrabold uppercase text-ink mb-2">
              Belum ada catatan
            </p>
            <p className="font-sans text-sm text-text-muted">
              Log TTD atau tambah stok muncul di sini.
            </p>
          </div>
        ) : (
          groups.map(
            (g) =>
              g.items.length > 0 && (
                <section key={g.label}>
                  <h2 className="label-micro text-text-muted mb-3">
                    {g.label}
                  </h2>
                  <div className="flex flex-col gap-3">
                    {g.items.map((item) => (
                      <LogRow key={item.id} item={item} />
                    ))}
                  </div>
                </section>
              )
          )
        )}
      </main>
    </>
  );
}

function LogRow({ item }: { item: LogItem }) {
  const Icon =
    item.kind === "drink"
      ? Pill
      : item.kind === "correction"
        ? Settings2
        : Package;
  const bg =
    item.kind === "drink"
      ? "bg-accent-mint"
      : item.kind === "correction"
        ? "bg-pink-soft"
        : "bg-accent-yellow";
  return (
    <div className="bg-surface border-2 border-ink shadow-retro rounded-[12px] p-4 flex items-center gap-4">
      <div
        className={cn(
          "size-12 shrink-0 border-2 border-ink rounded-[8px] flex items-center justify-center shadow-retro-sm",
          bg
        )}
      >
        <Icon className="size-5 text-ink" strokeWidth={2.5} />
      </div>
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <h3 className="font-sans text-base font-bold text-ink leading-tight truncate">
          {item.title}
        </h3>
        <p className="label-micro text-text-muted mt-1">
          {item.detail}
        </p>
      </div>
      <span className="shrink-0 px-2 py-1 bg-pink-cream border-2 border-ink rounded-full shadow-retro-sm label-micro text-ink">
        {item.badge}
      </span>
    </div>
  );
}
