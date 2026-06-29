import Link from "next/link";
import { ArrowRight, Pill, Leaf, HelpCircle, Droplet, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/cn";

type Category = {
  slug: string;
  label: string;
  Icon: LucideIcon;
  bg: string;
  iconColor: string;
};

const CATEGORIES: Category[] = [
  { slug: "manfaat-ttd", label: "MANFAAT TTD", Icon: Pill, bg: "bg-pink-soft", iconColor: "text-primary-strong" },
  { slug: "makanan-penambah-darah", label: "MAKANAN PENAMBAH DARAH", Icon: Leaf, bg: "bg-accent-mint", iconColor: "text-success" },
  { slug: "mitos-fakta-haid", label: "MITOS & FAKTA HAID", Icon: HelpCircle, bg: "bg-accent-yellow", iconColor: "text-ink" },
  { slug: "kebersihan-haid", label: "KEBERSIHAN HAID", Icon: Droplet, bg: "bg-accent-peach", iconColor: "text-ink" },
];

const FILTERS = ["SEMUA", "BELUM DIBACA"];

export default function EdukasiPage() {
  return (
    <>
      <header className="px-5 pt-8 pb-6 flex flex-col gap-2">
        <h1 className="font-display text-[40px] leading-none font-black text-primary-strong uppercase tracking-tight">
          BELAJAR YUK
        </h1>
        <p className="font-sans text-base text-text-muted">
          Kartu singkat soal haid & TTD.
        </p>
      </header>

      <div className="px-5 flex gap-3 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden">
        {FILTERS.map((f, i) => (
          <button
            key={f}
            type="button"
            className={cn(
              "font-mono text-[10px] font-bold uppercase tracking-wider px-4 py-2 border-2 border-ink rounded-full shadow-retro press-retro whitespace-nowrap",
              i === 0 ? "bg-primary text-white" : "bg-surface text-ink"
            )}
          >
            {f}
          </button>
        ))}
      </div>

      <main className="px-5 flex flex-col gap-7">
        <section className="bg-accent-yellow border-2 border-ink rounded-[12px] p-5 shadow-retro relative overflow-hidden">
          <span className="bg-surface text-ink font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 border-2 border-ink rounded-full mb-4 inline-block relative z-10">
            KARTU HARI INI
          </span>
          <div className="flex flex-col gap-2 mb-6 relative z-10 pr-20">
            <h2 className="font-display text-2xl font-extrabold text-ink">
              Kenapa harus minum TTD?
            </h2>
            <p className="font-sans text-base text-ink/90">
              Tablet Tambah Darah mencegah anemia dan bikin kamu tetap fokus di sekolah!
            </p>
          </div>
          <div className="absolute -bottom-8 -right-8 size-40 bg-pink-cream rounded-full border-2 border-ink z-0 flex items-center justify-center overflow-hidden">
            <div className="size-20 bg-primary rounded-full border-2 border-ink translate-y-2 translate-x-2" />
          </div>
          <Link
            href="/edukasi/manfaat-ttd"
            className="bg-primary text-white font-mono text-[11px] font-bold uppercase tracking-wider px-5 py-3 border-2 border-ink rounded-[8px] shadow-retro press-retro flex items-center gap-2 relative z-10 w-fit"
          >
            BUKA KARTU
            <ArrowRight className="size-4" strokeWidth={3} />
          </Link>
        </section>

        <section className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/edukasi/${c.slug}`}
              className={cn(
                "border-2 border-ink rounded-[12px] p-4 shadow-retro press-retro flex flex-col items-center justify-center text-center gap-3 h-32",
                c.bg
              )}
            >
              <c.Icon className={cn("size-8", c.iconColor)} strokeWidth={2.5} />
              <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink leading-tight">
                {c.label}
              </span>
            </Link>
          ))}
        </section>

        <section className="bg-surface border-2 border-ink rounded-[12px] p-5 shadow-retro flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg font-extrabold text-ink uppercase">
              PROGRES BACAANMU
            </h3>
            <span className="font-mono text-xl font-bold text-primary-strong">
              12 / 30
            </span>
          </div>
          <div className="w-full h-6 bg-pink-cream border-2 border-ink rounded-full overflow-hidden relative">
            <div className="h-full bg-primary border-r-2 border-ink" style={{ width: "40%" }} />
            <div className="absolute inset-0 flex justify-between px-2 pointer-events-none opacity-20">
              {Array.from({ length: 10 }).map((_, i) => (
                <span key={i} className="w-0.5 h-full bg-ink" />
              ))}
            </div>
          </div>
          <p className="font-sans text-sm text-text-muted text-center">kartu dibaca</p>
        </section>
      </main>
    </>
  );
}
