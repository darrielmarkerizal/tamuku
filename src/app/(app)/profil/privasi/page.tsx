import { Lock } from "lucide-react";
import { SubpageHeader } from "@/components/subpage-header";
import { requireUser } from "@/lib/auth/current-user";
import { DiscreetToggle } from "./discreet-toggle";
import { PrivasiActions } from "./privasi-actions";

export default async function PrivasiPage() {
  const user = await requireUser();

  return (
    <>
      <SubpageHeader title="PRIVASI & DATA" backHref="/profil" />

      <main className="px-5 flex flex-col gap-6 pb-8">
        <section className="bg-accent-mint border-2 border-ink rounded-[12px] shadow-retro p-5">
          <div className="flex items-start gap-3">
            <div className="size-10 shrink-0 bg-surface border-2 border-ink rounded-full flex items-center justify-center shadow-retro-sm">
              <Lock className="size-5 text-ink" strokeWidth={2.5} />
            </div>
            <div className="flex-1">
              <h2 className="font-display text-lg font-extrabold text-ink mb-1 uppercase">
                Privasimu prioritas utama
              </h2>
              <p className="font-sans text-sm text-ink leading-snug">
                Data haid, TTD, dan jurnal kamu disimpan pribadi. Tidak ada
                sekolah, UKS, atau pihak ketiga yang bisa lihat tanpa izinmu.
              </p>
            </div>
          </div>
        </section>

        <DiscreetToggle initial={user.discreet_mode} />

        <PrivasiActions />
      </main>
    </>
  );
}
