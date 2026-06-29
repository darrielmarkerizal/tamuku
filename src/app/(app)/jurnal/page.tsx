import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";
import { Mascot } from "@/components/mascot";

type Entry = {
  date: string;
  emoji: string;
  symptoms: string[];
  tone: "yellow" | "pink" | "mint" | "peach";
};

const ENTRIES: Entry[] = [
  { date: "KAM, 25 JUN", emoji: "😌", symptoms: ["Kram", "Lemas"], tone: "pink" },
  { date: "RAB, 24 JUN", emoji: "😴", symptoms: ["Lemas", "Pusing"], tone: "yellow" },
  { date: "SEL, 23 JUN", emoji: "😠", symptoms: ["Sensitif"], tone: "peach" },
  { date: "SEN, 22 JUN", emoji: "😭", symptoms: ["Sedih", "Kram"], tone: "pink" },
  { date: "MIN, 21 JUN", emoji: "😄", symptoms: ["Berenergi"], tone: "mint" },
];

const TONE_BG: Record<Entry["tone"], string> = {
  yellow: "bg-accent-yellow",
  pink: "bg-pink-soft",
  mint: "bg-accent-mint",
  peach: "bg-accent-peach",
};

export default function JurnalListPage() {
  return (
    <>
      <header className="flex items-center px-5 py-4 sticky top-0 bg-bg z-30">
        <Link
          href="/dashboard"
          aria-label="Kembali"
          className="size-10 -ml-2 rounded-full hover:bg-pink-cream flex items-center justify-center transition-colors"
        >
          <ArrowLeft className="size-6 text-ink" strokeWidth={2.5} />
        </Link>
        <h1 className="ml-2 font-display text-lg font-extrabold uppercase tracking-wider text-ink">
          JURNALMU
        </h1>
      </header>

      <main className="flex-1 flex flex-col">
        <section className="px-5 mt-2">
          <div className="bg-accent-yellow border-2 border-ink shadow-retro rounded-[12px] p-5 relative overflow-hidden">
            <div className="absolute -right-4 -top-2 w-28 h-28 z-10 pointer-events-none drop-shadow-[2px_2px_0_#1a0a14]">
              <Mascot state="vibrant" size={112} />
            </div>
            <div className="z-20 relative pr-20 w-full">
              <span className="inline-block bg-surface border-2 border-ink px-2 py-1 rounded-[6px] mb-3 font-mono text-[10px] font-bold uppercase tracking-wider text-ink">
                HARI INI
              </span>
              <h2 className="font-display text-2xl font-extrabold text-ink mb-1">
                Belum nulis hari ini
              </h2>
              <p className="font-sans text-base text-ink mb-6">
                Jurnal kamu bantu lihat pola, lho!
              </p>
            </div>
            <Link
              href="/jurnal/today"
              className="block w-full bg-primary text-white text-center font-mono text-[11px] font-bold uppercase tracking-widest py-4 px-4 rounded-[12px] border-2 border-ink shadow-retro press-retro"
            >
              ISI JURNAL HARI INI
            </Link>
          </div>
        </section>

        <div className="px-5 mt-8 mb-4">
          <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-text-muted">
            14 HARI TERAKHIR
          </h3>
        </div>

        <div className="flex flex-col gap-3 px-5 mb-8 w-full">
          {ENTRIES.map((e, i) => (
            <Link
              key={i}
              href={`/jurnal/${e.date.toLowerCase().replace(/[, ]+/g, "-")}`}
              className="bg-surface border-2 border-ink shadow-retro rounded-[12px] p-3 flex items-center gap-4 press-retro"
            >
              <div
                className={`size-14 shrink-0 ${TONE_BG[e.tone]} border-2 border-ink rounded-[8px] flex items-center justify-center text-3xl shadow-retro-sm`}
              >
                {e.emoji}
              </div>
              <div className="flex-1 flex flex-col justify-center min-w-0">
                <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink mb-2">
                  {e.date}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {e.symptoms.map((s) => (
                    <span
                      key={s}
                      className="bg-pink-soft border-2 border-ink rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink"
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
              <ChevronRight className="size-5 text-text-muted shrink-0" strokeWidth={2.5} />
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
