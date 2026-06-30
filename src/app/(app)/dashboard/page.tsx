import Link from "next/link";
import { AppHeader } from "@/components/app-header";
import { Mascot } from "@/components/mascot";

const moods = [
  { emoji: "😀", label: "Senang" },
  { emoji: "😌", label: "Tenang" },
  { emoji: "😢", label: "Sedih" },
  { emoji: "😠", label: "Kesal" },
  { emoji: "😩", label: "Lelah" },
  { emoji: "😟", label: "Cemas" },
];

export default function DashboardPage() {
  return (
    <>
      <AppHeader greeting="HALO, NISA 👋" hasUnread />

      <main className="px-5 flex flex-col gap-5 mt-2">
        <StatusCard />
        <PeriodLogButton />
        <TtdCard />
        <div className="grid grid-cols-2 gap-4">
          <MascotCard />
          <StreakCard />
        </div>
        <JournalQuickCard />
      </main>
    </>
  );
}

function StatusCard() {
  return (
    <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro-lg p-5 relative overflow-hidden">
      <div className="pr-24 relative z-10">
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mb-2">
          STATUS HARI INI
        </p>
        <h2 className="font-display text-2xl font-extrabold uppercase text-ink mb-2 leading-tight">
          HARI KE-3 HAID KAMU
        </h2>
        <p className="font-sans text-base text-ink">
          Ingat minum TTD ya, biar ga lemas.
        </p>
      </div>
      <div className="absolute right-[-12px] bottom-[-8px] w-28 h-28 z-0 -rotate-6">
        <Mascot state="vibrant" size={112} />
      </div>
    </section>
  );
}

function PeriodLogButton() {
  return (
    <button
      type="button"
      className="w-full h-[72px] bg-primary rounded-[12px] border-2 border-ink shadow-retro flex flex-col items-center justify-center px-4 press-retro"
    >
      <span className="font-display text-xl font-extrabold uppercase text-white leading-tight">
        TANDAI HAID SELESAI
      </span>
      <span className="font-sans text-sm font-bold text-white/90 leading-tight mt-0.5">
        Hari ke-3 dimulai 27 Jun
      </span>
    </button>
  );
}

function TtdCard() {
  return (
    <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro p-5 flex flex-col gap-4">
      <div className="flex justify-between items-start gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1">
            TTD HARI INI
          </p>
          <p className="font-sans text-base text-ink">
            Mode harian — kamu sedang haid.
          </p>
        </div>
        <Link
          href="/ttd"
          className="shrink-0 bg-pink-soft rounded-full px-3 py-1 border-2 border-ink shadow-retro-sm font-mono text-[10px] font-bold uppercase tracking-wider text-ink press-retro"
        >
          Sisa: 6 pil →
        </Link>
      </div>
      <button
        type="button"
        className="w-full bg-accent-mint rounded-[8px] border-2 border-ink shadow-retro-sm py-3 px-4 font-display text-lg font-extrabold text-ink uppercase text-center press-retro"
      >
        SUDAH MINUM TTD HARI INI ✓
      </button>
      <Link
        href="/ttd/riwayat"
        className="text-center font-mono text-[10px] font-bold uppercase tracking-wider text-primary-strong hover:underline"
      >
        Lihat riwayat & stok →
      </Link>
    </section>
  );
}

function MascotCard() {
  return (
    <Link
      href="/profil"
      className="bg-accent-yellow rounded-[12px] border-2 border-ink shadow-retro p-4 flex flex-col items-center justify-center text-center press-retro"
    >
      <Mascot state="cheerful" size={64} />
      <p className="font-display text-base font-extrabold text-ink leading-tight mt-2">
        Hemo lagi ceria!
      </p>
    </Link>
  );
}

function StreakCard() {
  return (
    <div className="bg-surface rounded-[12px] border-2 border-ink shadow-retro p-4 flex flex-col items-center justify-center text-center">
      <div className="flex items-baseline gap-1">
        <span className="text-3xl">🔥</span>
        <span className="font-mono text-5xl font-bold text-ink leading-none tracking-tighter">
          3
        </span>
      </div>
      <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-ink mt-2">
        MINGGU BERTURUT
      </p>
    </div>
  );
}

function JournalQuickCard() {
  return (
    <section className="bg-surface rounded-[12px] border-2 border-ink shadow-retro p-5 flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
          JURNAL HARI INI
        </p>
        <Link
          href="/jurnal"
          className="font-mono text-[10px] font-bold uppercase tracking-wider text-primary-strong hover:underline"
        >
          Lihat semua →
        </Link>
      </div>
      <div className="flex gap-2 justify-between">
        {moods.map(({ emoji, label }) => (
          <Link
            key={label}
            href={`/jurnal/today?mood=${encodeURIComponent(label.toLowerCase())}`}
            aria-label={`Catat mood: ${label}`}
            className="size-10 bg-pink-soft rounded-[6px] border-2 border-ink flex items-center justify-center text-xl press-retro shadow-retro-sm"
          >
            {emoji}
          </Link>
        ))}
      </div>
      <Link
        href="/jurnal/today"
        className="text-center font-sans text-sm font-bold text-primary-strong hover:underline"
      >
        Tambahkan catatan →
      </Link>
    </section>
  );
}
