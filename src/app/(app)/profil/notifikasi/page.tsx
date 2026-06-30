"use client";

import { useState } from "react";
import { Bell, BellOff, ChevronDown, ChevronUp, Droplet, MoonStar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubpageHeader } from "@/components/subpage-header";
import { cn } from "@/lib/cn";

const DAYS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

type Toggle = {
  key: string;
  Icon: typeof Bell;
  title: string;
  desc: string;
};

const CHANNELS: Toggle[] = [
  {
    key: "weekly",
    Icon: Bell,
    title: "Pengingat TTD mingguan",
    desc: "Notifikasi di hari & jam yang kamu pilih.",
  },
  {
    key: "daily",
    Icon: Droplet,
    title: "Pengingat TTD harian saat haid",
    desc: "Otomatis aktif setiap hari pas kamu lagi haid.",
  },
  {
    key: "prediction",
    Icon: MoonStar,
    title: "Prediksi haid mendekat",
    desc: "Diingatkan 2 hari sebelum perkiraan haid datang.",
  },
  {
    key: "quiet",
    Icon: BellOff,
    title: "Mode tenang malam (21:00 - 06:00)",
    desc: "Notifikasi ditahan sampai pagi.",
  },
];

export default function NotifikasiPage() {
  const [day, setDay] = useState("Jum");
  const [hour, setHour] = useState(19);
  const [minute, setMinute] = useState(0);
  const [toggles, setToggles] = useState<Record<string, boolean>>({
    weekly: true,
    daily: true,
    prediction: true,
    quiet: true,
  });

  const toggle = (k: string) => setToggles((t) => ({ ...t, [k]: !t[k] }));

  return (
    <>
      <SubpageHeader title="PENGINGAT" backHref="/profil" />

      <main className="px-5 flex flex-col gap-6 pb-8">
        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
            HARI PENGINGAT MINGGUAN
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x [&::-webkit-scrollbar]:hidden">
            {DAYS.map((d) => {
              const active = d === day;
              return (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDay(d)}
                  className={cn(
                    "snap-center shrink-0 size-12 flex items-center justify-center border-2 border-ink rounded-[8px] shadow-retro-sm press-retro font-mono text-[11px] font-bold uppercase tracking-wider",
                    active ? "bg-primary text-white" : "bg-surface text-ink"
                  )}
                >
                  {d}
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4 items-center py-2">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted self-start">
            JAM PENGINGAT
          </h2>
          <div className="flex items-center gap-6">
            <Stepper
              onUp={() => setHour((h) => (h + 1) % 24)}
              onDown={() => setHour((h) => (h + 23) % 24)}
            />
            <div className="bg-surface border-2 border-ink rounded-[12px] px-8 py-4 shadow-retro flex items-center justify-center">
              <span className="font-mono text-[48px] font-bold leading-none tracking-widest text-ink">
                {String(hour).padStart(2, "0")}:{String(minute).padStart(2, "0")}
              </span>
            </div>
            <Stepper
              onUp={() => setMinute((m) => (m + 5) % 60)}
              onDown={() => setMinute((m) => (m + 55) % 60)}
            />
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
            JENIS NOTIFIKASI
          </h2>
          {CHANNELS.map((c) => (
            <div
              key={c.key}
              className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center gap-3"
            >
              <div className="size-10 shrink-0 bg-pink-cream border-2 border-ink rounded-[8px] flex items-center justify-center">
                <c.Icon className="size-5 text-primary-strong" strokeWidth={2.5} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-extrabold text-ink leading-tight">
                  {c.title}
                </h3>
                <p className="font-sans text-sm text-text-muted leading-snug mt-0.5">
                  {c.desc}
                </p>
              </div>
              <button
                type="button"
                role="switch"
                aria-checked={toggles[c.key]}
                onClick={() => toggle(c.key)}
                className={cn(
                  "relative shrink-0 w-12 h-6 border-2 border-ink rounded-[6px] transition-colors press-retro",
                  toggles[c.key] ? "bg-primary-strong" : "bg-surface"
                )}
              >
                <span
                  className={cn(
                    "absolute top-[1px] size-4 bg-surface border-2 border-ink rounded-[4px] transition-transform",
                    toggles[c.key] ? "translate-x-[22px]" : "translate-x-[1px]"
                  )}
                />
              </button>
            </div>
          ))}
        </section>

        <Button size="lg" className="w-full mt-2">
          SIMPAN PENGATURAN
        </Button>
      </main>
    </>
  );
}

function Stepper({ onUp, onDown }: { onUp: () => void; onDown: () => void }) {
  return (
    <div className="flex flex-col gap-6 items-center">
      <button
        type="button"
        onClick={onUp}
        aria-label="Tambah"
        className="size-10 bg-surface border-2 border-ink rounded-[6px] shadow-retro-sm flex items-center justify-center press-retro"
      >
        <ChevronUp className="size-5 text-ink" strokeWidth={2.75} />
      </button>
      <button
        type="button"
        onClick={onDown}
        aria-label="Kurang"
        className="size-10 bg-surface border-2 border-ink rounded-[6px] shadow-retro-sm flex items-center justify-center press-retro"
      >
        <ChevronDown className="size-5 text-ink" strokeWidth={2.75} />
      </button>
    </div>
  );
}
