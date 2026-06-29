import Link from "next/link";
import { ArrowLeft, Pill, Package } from "lucide-react";
import { cn } from "@/lib/cn";

type LogItem = {
  type: "drink" | "stock";
  title: string;
  date: string;
  badge: string;
};

type LogGroup = {
  label: string;
  items: LogItem[];
};

const GROUPS: LogGroup[] = [
  {
    label: "MINGGU INI",
    items: [
      { type: "drink", title: "Minum TTD", date: "Sen, 28 Jun • 19:02", badge: "HARIAN" },
      { type: "drink", title: "Minum TTD", date: "Min, 27 Jun • 18:55", badge: "HARIAN" },
    ],
  },
  {
    label: "MINGGU LALU",
    items: [
      { type: "stock", title: "+10 pil dari UKS", date: "Jum, 25 Jun • 09:30", badge: "STOK" },
      { type: "drink", title: "Minum TTD", date: "Sel, 22 Jun • 19:10", badge: "MINGGUAN" },
    ],
  },
];

const FILTERS = ["Semua", "Diminum", "Stok Masuk"];

export default function TtdRiwayatPage() {
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

      <div className="px-5 py-5 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            type="button"
            className={cn(
              "shrink-0 px-4 py-2 border-2 border-ink rounded-full shadow-retro-sm font-mono text-[10px] font-bold uppercase tracking-wider press-retro",
              i === 0
                ? "bg-primary text-white"
                : "bg-surface text-text-muted hover:bg-pink-cream"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <main className="px-5 flex flex-col gap-7 pb-8">
        {GROUPS.map((g) => (
          <section key={g.label}>
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mb-3">
              {g.label}
            </h2>
            <div className="flex flex-col gap-3">
              {g.items.map((item, i) => (
                <LogRow key={i} item={item} />
              ))}
            </div>
          </section>
        ))}

        <button
          type="button"
          className="w-full bg-surface border-2 border-ink shadow-retro rounded-[12px] py-4 mt-2 font-mono text-[10px] font-bold uppercase tracking-wider text-ink press-retro"
        >
          Muat lebih banyak
        </button>
      </main>
    </>
  );
}

function LogRow({ item }: { item: LogItem }) {
  const isStock = item.type === "stock";
  const Icon = isStock ? Package : Pill;
  return (
    <div className="bg-surface border-2 border-ink shadow-retro rounded-[12px] p-4 flex items-center gap-4 press-retro cursor-pointer">
      <div
        className={cn(
          "size-12 shrink-0 border-2 border-ink rounded-[8px] flex items-center justify-center shadow-retro-sm",
          isStock ? "bg-accent-yellow" : "bg-accent-mint"
        )}
      >
        <Icon className="size-5 text-ink" strokeWidth={2.5} />
      </div>
      <div className="flex-1 flex flex-col justify-center min-w-0">
        <h3 className="font-sans text-base font-bold text-ink leading-tight truncate">
          {item.title}
        </h3>
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mt-1">
          {item.date}
        </p>
      </div>
      <span className="shrink-0 px-2 py-1 bg-pink-cream border-2 border-ink rounded-full shadow-retro-sm font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
        {item.badge}
      </span>
    </div>
  );
}
