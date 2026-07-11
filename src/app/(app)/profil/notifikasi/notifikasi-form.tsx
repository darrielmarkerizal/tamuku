"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import {
  Bell,
  BellOff,
  BellRing,
  Droplet,
  MoonStar,
  Award,
  PackageOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SubpageHeader } from "@/components/subpage-header";
import { RetroToggle } from "@/components/retro-toggle";
import { TimePicker } from "@/components/time-picker";
import { cn } from "@/lib/cn";
import { updateNotificationSettingAction } from "@/lib/notification/actions";
import {
  currentSubscriptionStatus,
  subscribePush,
  unsubscribePush,
} from "@/lib/push/client";

// weekly_day: 0=Minggu..6=Sabtu
const DAYS = [
  { value: 1, label: "Sen" },
  { value: 2, label: "Sel" },
  { value: 3, label: "Rab" },
  { value: 4, label: "Kam" },
  { value: 5, label: "Jum" },
  { value: 6, label: "Sab" },
  { value: 0, label: "Min" },
];

interface Props {
  initial: {
    weekly_day: number;
    reminder_hour: number;
    reminder_minute: number;
    enabled: boolean;
    ttd_weekly: boolean;
    ttd_daily: boolean;
    period_prediction: boolean;
    low_stock: boolean;
    badge_earned: boolean;
    quiet_enabled: boolean;
  };
}

export function NotifikasiForm({ initial }: Props) {
  const router = useRouter();
  const [day, setDay] = useState(initial.weekly_day);
  const [hour, setHour] = useState(initial.reminder_hour);
  const [minute, setMinute] = useState(initial.reminder_minute);
  const [enabled, setEnabled] = useState(initial.enabled);
  const [ttdWeekly, setTtdWeekly] = useState(initial.ttd_weekly);
  const [ttdDaily, setTtdDaily] = useState(initial.ttd_daily);
  const [prediction, setPrediction] = useState(initial.period_prediction);
  const [lowStock, setLowStock] = useState(initial.low_stock);
  const [badgeEarned, setBadgeEarned] = useState(initial.badge_earned);
  const [quiet, setQuiet] = useState(initial.quiet_enabled);
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [pushStatus, setPushStatus] = useState<
    "granted" | "denied" | "default" | "unsupported"
  >("default");
  const [pushBusy, setPushBusy] = useState(false);

  useEffect(() => {
    currentSubscriptionStatus().then(setPushStatus);
  }, []);

  async function handleTogglePush() {
    setPushBusy(true);
    if (pushStatus === "granted") {
      await unsubscribePush();
      setPushStatus("default");
    } else {
      const res = await subscribePush();
      if (res.ok) setPushStatus("granted");
      else setError(res.error);
    }
    setPushBusy(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      const fd = new FormData();
      fd.set("weekly_day", String(day));
      fd.set("reminder_hour", String(hour));
      fd.set("reminder_minute", String(minute));
      fd.set("enabled", enabled ? "on" : "false");
      fd.set("ttd_weekly", ttdWeekly ? "on" : "false");
      fd.set("ttd_daily", ttdDaily ? "on" : "false");
      fd.set("period_prediction", prediction ? "on" : "false");
      fd.set("low_stock", lowStock ? "on" : "false");
      fd.set("badge_earned", badgeEarned ? "on" : "false");
      fd.set("quiet_enabled", quiet ? "on" : "false");
      const res = await updateNotificationSettingAction(fd);
      if (res.ok) {
        setSuccess(true);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  const channels = [
    {
      Icon: Bell,
      title: "Pengingat TTD mingguan",
      desc: "Notif di hari & jam yang kamu pilih.",
      checked: ttdWeekly,
      setChecked: setTtdWeekly,
    },
    {
      Icon: Droplet,
      title: "Pengingat TTD harian saat haid",
      desc: "Otomatis aktif setiap hari pas kamu lagi haid.",
      checked: ttdDaily,
      setChecked: setTtdDaily,
    },
    {
      Icon: MoonStar,
      title: "Prediksi haid mendekat",
      desc: "Diingatkan 2 hari sebelum perkiraan haid datang.",
      checked: prediction,
      setChecked: setPrediction,
    },
    {
      Icon: PackageOpen,
      title: "Stok TTD menipis",
      desc: "Notif kalau sisa pil ≤ 1.",
      checked: lowStock,
      setChecked: setLowStock,
    },
    {
      Icon: Award,
      title: "Lencana baru",
      desc: "Notif kalau kamu dapat badge baru.",
      checked: badgeEarned,
      setChecked: setBadgeEarned,
    },
    {
      Icon: BellOff,
      title: "Mode tenang malam (21:00–06:00)",
      desc: "Notifikasi ditahan sampai pagi.",
      checked: quiet,
      setChecked: setQuiet,
    },
  ];

  return (
    <>
      <SubpageHeader title="PENGINGAT" backHref="/profil" />

      <form onSubmit={handleSubmit} className="px-5 flex flex-col gap-6 pb-8">
        <section
          className={cn(
            "border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center gap-4",
            pushStatus === "granted" ? "bg-accent-mint" : "bg-accent-yellow"
          )}
        >
          <div className="size-10 shrink-0 bg-surface border-2 border-ink rounded-full flex items-center justify-center">
            {pushStatus === "granted" ? (
              <BellRing
                className="size-5 text-primary-strong"
                strokeWidth={2.5}
              />
            ) : (
              <Bell className="size-5 text-ink" strokeWidth={2.5} />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-base font-extrabold text-ink leading-tight">
              {pushStatus === "granted"
                ? "Push aktif"
                : pushStatus === "denied"
                  ? "Push diblokir"
                  : pushStatus === "unsupported"
                    ? "Push tidak didukung"
                    : "Aktifkan push notif"}
            </h3>
            <p className="font-sans text-xs text-ink leading-snug">
              {pushStatus === "granted"
                ? "Tamuku bisa kirim pengingat walau app ditutup."
                : pushStatus === "denied"
                  ? "Aktifkan di setting browser dulu."
                  : "Klik tombol → izinkan → siap."}
            </p>
          </div>
          {pushStatus !== "unsupported" && pushStatus !== "denied" && (
            <button
              type="button"
              onClick={handleTogglePush}
              disabled={pushBusy}
              className="shrink-0 bg-primary text-white font-mono text-[10px] font-bold uppercase tracking-wider px-3 py-2 border-2 border-ink rounded-[8px] shadow-retro-sm press-retro disabled:opacity-70"
            >
              {pushBusy
                ? "…"
                : pushStatus === "granted"
                  ? "MATIKAN"
                  : "AKTIFKAN"}
            </button>
          )}
        </section>

        <section className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center gap-4">
          <div className="flex-1">
            <h3 className="font-display text-lg font-extrabold text-ink leading-tight">
              Notifikasi utama
            </h3>
            <p className="font-sans text-sm text-text-muted">
              Master switch. Kalau off, semua pengingat mati.
            </p>
          </div>
          <RetroToggle
            checked={enabled}
            onChange={setEnabled}
            label="Notifikasi utama"
          />
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
            HARI PENGINGAT MINGGUAN
          </h2>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-5 px-5 snap-x [&::-webkit-scrollbar]:hidden">
            {DAYS.map((d) => {
              const active = d.value === day;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDay(d.value)}
                  className={cn(
                    "snap-center shrink-0 size-12 flex items-center justify-center border-2 border-ink rounded-[8px] shadow-retro-sm press-retro font-mono text-[11px] font-bold uppercase tracking-wider",
                    active ? "bg-primary text-white" : "bg-surface text-ink"
                  )}
                >
                  {d.label}
                </button>
              );
            })}
          </div>
        </section>

        <section className="flex flex-col gap-4 py-2">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
            JAM PENGINGAT
          </h2>
          <TimePicker
            hour={hour}
            minute={minute}
            onHourChange={setHour}
            onMinuteChange={setMinute}
          />
        </section>

        <section className="flex flex-col gap-3">
          <h2 className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-muted">
            JENIS NOTIFIKASI
          </h2>
          {channels.map((c, i) => (
            <div
              key={i}
              className="bg-surface border-2 border-ink rounded-[12px] shadow-retro p-4 flex items-center gap-3"
            >
              <div className="size-10 shrink-0 bg-pink-cream border-2 border-ink rounded-[8px] flex items-center justify-center">
                <c.Icon
                  className="size-5 text-primary-strong"
                  strokeWidth={2.5}
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-base font-extrabold text-ink leading-tight">
                  {c.title}
                </h3>
                <p className="font-sans text-sm text-text-muted leading-snug mt-0.5">
                  {c.desc}
                </p>
              </div>
              <RetroToggle
                checked={c.checked}
                onChange={c.setChecked}
                label={c.title}
              />
            </div>
          ))}
        </section>

        {error && (
          <div className="bg-pink-cream border-2 border-danger rounded-[8px] px-3 py-2 font-sans text-sm text-danger">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-accent-mint border-2 border-ink rounded-[8px] px-3 py-2 font-sans text-sm text-ink">
            Pengaturan tersimpan.
          </div>
        )}

        <Button size="lg" className="w-full mt-2" type="submit" disabled={pending}>
          {pending ? "MENYIMPAN…" : "SIMPAN PENGATURAN"}
        </Button>
      </form>
    </>
  );
}
