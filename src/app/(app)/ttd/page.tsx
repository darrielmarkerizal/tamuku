import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock, Droplet, Info, Plus } from "lucide-react";
import { cn } from "@/lib/cn";

type HeatCell = "empty" | "taken" | "skipped" | "today";
const HEATMAP: HeatCell[] = [
  "empty","empty","empty","empty","taken","empty","empty",
  "empty","empty","empty","skipped","empty","empty","empty",
  "empty","empty","taken","empty","empty","empty","empty",
  "empty","taken","empty","empty","empty","skipped","empty",
  "empty","empty","taken","taken","taken","empty","today",
];

export default function TtdPage() {
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
            <span className="font-mono text-[96px] leading-none font-bold text-ink">6</span>
            <span className="font-display text-2xl font-extrabold uppercase text-ink">PIL</span>
          </div>
          <div className="bg-accent-yellow border-2 border-ink shadow-retro-sm rounded-full px-4 py-2 mb-6 font-sans text-sm font-bold inline-flex items-center gap-2 text-ink">
            <Info className="size-4" strokeWidth={2.5} />
            Cukup buat ~6 minggu
          </div>
          <Link
            href="/ttd/tambah-stok"
            className="w-full bg-primary text-white font-display text-xl font-extrabold uppercase py-4 rounded-[8px] border-2 border-ink shadow-retro press-retro flex items-center justify-center gap-2"
          >
            <Plus className="size-5" strokeWidth={3} />
            TAMBAH STOK
          </Link>
        </section>

        <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro p-5">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mb-4 border-b-2 border-ink pb-2">
            JADWAL PENGINGAT
          </h2>
          <div className="flex flex-col gap-4 mb-4">
            <ReminderRow Icon={Clock} text="Mingguan: Jumat, 19:00" />
            <ReminderRow Icon={Droplet} text="Saat haid: Setiap hari, 19:00" />
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
            30 HARI TERAKHIR
          </h2>
          <div className="grid grid-cols-7 gap-2 mb-4 place-items-center">
            {HEATMAP.map((c, i) => (
              <span
                key={i}
                className={cn(
                  "size-7 border-2 border-ink rounded-[2px]",
                  c === "taken" && "bg-accent-mint",
                  c === "skipped" && "bg-pink-soft",
                  c === "empty" && "bg-surface",
                  c === "today" && "bg-surface border-dashed"
                )}
              />
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-4 font-mono text-[10px] font-bold uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <span className="size-3 bg-accent-mint border-2 border-ink" /> Minum
            </div>
            <div className="flex items-center gap-1.5">
              <span className="size-3 bg-pink-soft border-2 border-ink" /> Terlewat
            </div>
          </div>
        </section>

        <div className="text-center pb-4 pt-2">
          <Link
            href="/ttd/riwayat"
            className="font-display text-base font-extrabold text-ink hover:text-primary-strong transition-colors inline-flex items-center gap-1 uppercase"
          >
            Lihat riwayat lengkap <ArrowRight className="size-4" strokeWidth={2.75} />
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
