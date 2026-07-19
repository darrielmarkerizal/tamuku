import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/cn";
import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import { CATEGORIES, FLASHCARDS } from "@/content/flashcards";
import { SECTION_TONE } from "@/lib/section-tone";

export default async function EdukasiPage() {
  const user = await requireUser();
  const cur = await db.user.findUnique({
    where: { id: user.id },
    select: { seen_flashcards: true },
  });
  const seen = new Set(cur?.seen_flashcards ?? []);
  const totalCards = FLASHCARDS.length;
  const readCount = FLASHCARDS.filter((f) => seen.has(f.id)).length;
  const readPct = totalCards === 0 ? 0 : Math.round((readCount / totalCards) * 100);

  const unseenFirst =
    FLASHCARDS.find((f) => !seen.has(f.id)) ?? FLASHCARDS[0];
  const featuredCategory = CATEGORIES.find(
    (c) => c.slug === unseenFirst?.category
  );

  return (
    <>
      <header className="px-5 pt-8 pb-6 flex flex-col gap-2">

        <h1
          className={`font-display text-[40px] leading-none font-black uppercase tracking-tight ${SECTION_TONE.edukasi.accent}`}
        >
          BELAJAR YUK
        </h1>
        <p className="font-sans text-base text-text-muted">
          Kartu singkat soal haid & TTD.
        </p>
      </header>

      <main className="px-5 flex flex-col gap-7 pb-8">
        {unseenFirst && featuredCategory && (
          <section className="bg-accent-yellow border-2 border-ink rounded-[12px] p-5 shadow-retro relative overflow-hidden">
            <span className="bg-surface text-ink font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-1 border-2 border-ink rounded-full mb-4 inline-block relative z-10">
              {seen.has(unseenFirst.id) ? "KARTU PILIHAN" : "KARTU HARI INI"}
            </span>
            <div className="flex flex-col gap-2 mb-6 relative z-10 pr-20">
              <h2 className="font-display text-2xl font-extrabold text-ink">
                {unseenFirst.title}
              </h2>
              <p className="font-sans text-base text-ink/90 line-clamp-3">
                {unseenFirst.body}
              </p>
            </div>
            <div className="absolute -bottom-8 -right-8 size-40 bg-pink-cream rounded-full border-2 border-ink z-0 flex items-center justify-center overflow-hidden">
              <featuredCategory.Icon
                className="size-16 text-ink"
                strokeWidth={2.25}
              />
            </div>
            <Link
              href={`/edukasi/${featuredCategory.slug}`}
              className="bg-primary text-white font-mono text-[11px] font-bold uppercase tracking-wider px-5 py-3 border-2 border-ink rounded-[8px] shadow-retro press-retro flex items-center gap-2 relative z-10 w-fit"
            >
              BUKA KARTU
              <ArrowRight className="size-4" strokeWidth={3} />
            </Link>
          </section>
        )}

        <section className="grid grid-cols-2 gap-4">
          {CATEGORIES.map((c) => {
            const total = c.cards.length;
            const read = c.cards.filter((card) => seen.has(card.id)).length;
            return (
              <Link
                key={c.slug}
                href={`/edukasi/${c.slug}`}
                className={cn(
                  "border-2 border-ink rounded-[12px] p-4 shadow-retro press-retro flex flex-col items-center justify-center text-center gap-2",
                  c.tone
                )}
              >
                <c.Icon
                  className="size-8 text-ink"
                  strokeWidth={2.5}
                />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink leading-tight">
                  {c.label}
                </span>
                <span className="font-mono text-[10px] font-bold text-ink/70">
                  {read}/{total}
                </span>
              </Link>
            );
          })}
        </section>

        <section className="bg-surface border-2 border-ink rounded-[12px] p-5 shadow-retro flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <h3 className="font-display text-lg font-extrabold text-ink uppercase">
              PROGRES BACAANMU
            </h3>
            <span className="font-mono text-xl font-bold text-primary-strong">
              {readCount} / {totalCards}
            </span>
          </div>
          <div className="w-full h-6 bg-pink-cream border-2 border-ink rounded-full overflow-hidden relative">
            <div
              className="h-full bg-primary border-r-2 border-ink"
              style={{ width: `${readPct}%` }}
            />
          </div>
          <p className="font-sans text-sm text-text-muted text-center">
            kartu dibaca
          </p>
        </section>
      </main>
    </>
  );
}
