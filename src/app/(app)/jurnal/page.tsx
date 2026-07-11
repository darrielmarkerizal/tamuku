import Link from "next/link";
import { ArrowLeft, ChevronRight, Minus, Sparkles } from "lucide-react";
import { Mascot } from "@/components/mascot";
import { requireUser } from "@/lib/auth/current-user";
import { db } from "@/lib/db";
import {
  addDays,
  formatDayShort,
  formatShort,
  isSameLocalDay,
  today,
  toIsoDate,
} from "@/lib/date";
import { MOOD_BY_VALUE } from "@/lib/mood-icons";

const SYMPTOM_LABEL: Record<string, string> = {
  CRAMP: "Kram",
  HEADACHE: "Sakit kepala",
  BLOATING: "Kembung",
  ACNE: "Jerawat",
  FATIGUE: "Lemas",
  BACKPAIN: "Sakit pinggang",
};

export default async function JurnalListPage() {
  const user = await requireUser();
  const todayDate = today();
  const from = addDays(todayDate, -13);

  const entries = await db.journalLog.findMany({
    where: { userId: user.id, log_date: { gte: from, lte: todayDate } },
    orderBy: { log_date: "desc" },
    select: {
      log_date: true,
      mood: true,
      symptoms: true,
      notes: true,
    },
  });

  const todaysEntry = entries.find((e) => isSameLocalDay(e.log_date, todayDate));
  const historicalEntries = entries.filter(
    (e) => !isSameLocalDay(e.log_date, todayDate)
  );

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
              <h2 className="font-display text-2xl font-extrabold text-ink mb-1 flex items-center gap-2">
                {todaysEntry ? (
                  <>
                    <span>Sudah nulis hari ini</span>
                    <Sparkles
                      className="size-5 text-primary-strong"
                      strokeWidth={2.5}
                    />
                  </>
                ) : (
                  "Belum nulis hari ini"
                )}
              </h2>
              <p className="font-sans text-base text-ink mb-6">
                {todaysEntry
                  ? "Klik untuk edit atau tambah catatan."
                  : "Jurnal kamu bantu lihat pola, lho!"}
              </p>
            </div>
            <Link
              href="/jurnal/today"
              className="block w-full bg-primary text-white text-center font-mono text-[11px] font-bold uppercase tracking-widest py-4 px-4 rounded-[12px] border-2 border-ink shadow-retro press-retro"
            >
              {todaysEntry ? "EDIT JURNAL HARI INI" : "ISI JURNAL HARI INI"}
            </Link>
          </div>
        </section>

        <div className="px-5 mt-8 mb-4">
          <h3 className="font-display text-lg font-extrabold uppercase tracking-wide text-text-muted">
            14 HARI TERAKHIR
          </h3>
        </div>

        <div className="flex flex-col gap-3 px-5 mb-8 w-full">
          {historicalEntries.length === 0 ? (
            <div className="bg-surface border-2 border-ink shadow-retro rounded-[12px] p-8 text-center">
              <p className="font-display text-lg font-extrabold uppercase text-ink mb-2">
                Belum ada jurnal
              </p>
              <p className="font-sans text-sm text-text-muted">
                Mulai catat hari ini biar Hemo bisa bantu lihat polamu.
              </p>
            </div>
          ) : (
            historicalEntries.map((e) => {
              const meta =
                e.mood &&
                MOOD_BY_VALUE[e.mood as keyof typeof MOOD_BY_VALUE];
              const iso = toIsoDate(e.log_date);
              const MoodIcon = meta?.Icon ?? Minus;
              const tone = meta?.tone ?? "bg-surface";
              return (
                <Link
                  key={iso}
                  href={`/jurnal/${iso}`}
                  className="bg-surface border-2 border-ink shadow-retro rounded-[12px] p-3 flex items-center gap-4 press-retro"
                >
                  <div
                    className={`size-14 shrink-0 ${tone} border-2 border-ink rounded-[8px] flex items-center justify-center shadow-retro-sm`}
                  >
                    <MoodIcon
                      className="size-7 text-ink"
                      strokeWidth={2.5}
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-center min-w-0">
                    <h4 className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink mb-2">
                      {formatDayShort(e.log_date)}, {formatShort(e.log_date)}
                    </h4>
                    {e.symptoms.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {e.symptoms.slice(0, 3).map((s) => (
                          <span
                            key={s}
                            className="bg-pink-soft border-2 border-ink rounded-full px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-wider text-ink"
                          >
                            {SYMPTOM_LABEL[s] ?? s}
                          </span>
                        ))}
                        {e.symptoms.length > 3 && (
                          <span className="font-mono text-[10px] text-text-muted">
                            +{e.symptoms.length - 3}
                          </span>
                        )}
                      </div>
                    ) : e.notes ? (
                      <p className="font-sans text-xs text-text-muted line-clamp-1">
                        {e.notes}
                      </p>
                    ) : null}
                  </div>
                  <ChevronRight
                    className="size-5 text-text-muted shrink-0"
                    strokeWidth={2.5}
                  />
                </Link>
              );
            })
          )}
        </div>
      </main>
    </>
  );
}
